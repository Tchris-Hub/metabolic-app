import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { testDatabaseConnection, testDeleteAccount } from './test-database';
interface TestResult {
  test: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export default function DatabaseTestScreen() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (testName: string, success: boolean, message: string) => {
    setResults(prev => [...prev, {
      test: testName,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setResults([]);

    try {
      // Test 1: Database Connection
      const dbSuccess = await testDatabaseConnection();
      addResult('Database Connection', dbSuccess,
        dbSuccess ? '✅ Connection successful' : '❌ Connection failed');

      // Test 2: Delete Account Function
      const deleteSuccess = await testDeleteAccount();
      addResult('Delete Account Function', deleteSuccess,
        deleteSuccess ? '✅ Function exists and works' : '❌ Function not found or broken');

      // Test 3: Profile Data Structure
      try {
        const { supabase } = await import('./services/supabase/config');
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);

        if (error) {
          addResult('Profile Table Schema', false, `❌ Schema error: ${error.message}`);
        } else {
          addResult('Profile Table Schema', true, `✅ Table accessible, columns: ${Object.keys(data?.[0] || {}).join(', ')}`);
        }
      } catch (error: any) {
        addResult('Profile Table Schema', false, `❌ Schema test failed: ${error.message}`);
      }

    } catch (error: any) {
      addResult('Overall Test', false, `❌ Test suite failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Database Test Suite</Text>

      <TouchableOpacity
        style={[styles.button, isTesting && styles.buttonDisabled]}
        onPress={runTests}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? '🔄 Running Tests...' : '🚀 Run Database Tests'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {results.map((result: TestResult, index) => (
          <View key={index} style={[
            styles.resultItem,
            result.success ? styles.resultSuccess : styles.resultError
          ]}>
            <Text style={styles.resultTest}>{result.test}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  results: {
    flex: 1,
  },
  resultItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  resultError: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336',
  },
  resultTest: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
