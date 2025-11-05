import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase/config';
import { router } from 'expo-router';

export default function DebugResetScreen() {
  const [isResetting, setIsResetting] = useState(false);

  const resetEverything = async () => {
    try {
      setIsResetting(true);
      
      // 1. Clear AsyncStorage
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage cleared');
      
      // 2. Logout from Supabase
      await supabase.auth.signOut();
      console.log('✅ Supabase session cleared');
      
      Alert.alert(
        'Reset Complete!',
        'All data cleared. The app will now restart and show onboarding.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to onboarding
              router.replace('/screens/auth/PremiumOnboardingScreen');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert('Error', 'Failed to reset. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const checkCurrentState = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const { data: { session } } = await supabase.auth.getSession();
      
      const info = `
Current State:
- Has Seen Onboarding: ${hasSeenOnboarding || 'false'}
- Logged In: ${session ? 'Yes' : 'No'}
- User Email: ${session?.user?.email || 'None'}
      `;
      
      Alert.alert('Current State', info);
    } catch (error) {
      Alert.alert('Error', 'Failed to check state');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        🔧 Debug & Reset
      </Text>
      
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 40, textAlign: 'center' }}>
        Use this screen to reset the app and test the complete onboarding flow
      </Text>

      <TouchableOpacity
        onPress={checkCurrentState}
        style={{
          backgroundColor: '#2196F3',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          marginBottom: 16,
          width: '100%',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          Check Current State
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resetEverything}
        disabled={isResetting}
        style={{
          backgroundColor: isResetting ? '#ccc' : '#f44336',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          marginBottom: 16,
          width: '100%',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          {isResetting ? 'Resetting...' : '🔄 Reset Everything'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/screens/auth/PremiumOnboardingScreen')}
        style={{
          backgroundColor: '#4CAF50',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          width: '100%',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          Go to Onboarding
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: '#999', marginTop: 40, textAlign: 'center' }}>
        After reset, the app will show the complete onboarding flow
      </Text>
    </View>
  );
}
