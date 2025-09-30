import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function MealScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#FF9800', '#F57C00']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Ionicons name="restaurant" size={48} color="white" />
            <Text style={styles.title}>Nutrition & Meals</Text>
            <Text style={styles.subtitle}>Plan your healthy eating journey</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🍽️ Meal Screen</Text>
            <Text style={styles.cardText}>
              This will be your nutrition center with:
            </Text>
            <Text style={styles.listItem}>• Daily Meal Plans</Text>
            <Text style={styles.listItem}>• Diabetes-Friendly Recipes</Text>
            <Text style={styles.listItem}>• Carb & Calorie Counter</Text>
            <Text style={styles.listItem}>• Food Search Database</Text>
            <Text style={styles.listItem}>• Hydration Tracker</Text>
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