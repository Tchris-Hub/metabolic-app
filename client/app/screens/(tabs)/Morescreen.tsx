import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#607D8B', '#455A64']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Ionicons name="menu" size={48} color="white" />
            <Text style={styles.title}>Settings & More</Text>
            <Text style={styles.subtitle}>Customize your health experience</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚙️ More Screen</Text>
            <Text style={styles.cardText}>
              This will be your settings hub with:
            </Text>
            <Text style={styles.listItem}>• Profile & Account Settings</Text>
            <Text style={styles.listItem}>• Medication Reminders</Text>
            <Text style={styles.listItem}>• Notification Preferences</Text>
            <Text style={styles.listItem}>• 👑 Premium Features</Text>
            <Text style={styles.listItem}>• Export Health Reports</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    paddingLeft: 8,
  },
});