import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function MedicationDetailScreen() {
  const medications = [
    { id: '1', name: 'Metformin', dosage: '500mg', frequency: '2x daily', taken: 14, missed: 0 },
    { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: '1x daily', taken: 7, missed: 0 },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: '1x daily', taken: 7, missed: 1 },
    { id: '4', name: 'Aspirin', dosage: '81mg', frequency: '1x daily', taken: 7, missed: 0 },
  ];

  const recentLogs = [
    { id: '1', medication: 'Metformin', time: new Date(2024, 0, 15, 8, 0), taken: true },
    { id: '2', medication: 'Lisinopril', time: new Date(2024, 0, 15, 8, 0), taken: true },
    { id: '3', medication: 'Metformin', time: new Date(2024, 0, 15, 20, 0), taken: true },
    { id: '4', medication: 'Atorvastatin', time: new Date(2024, 0, 14, 20, 0), taken: false },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getAdherenceRate = (med: typeof medications[0]) => {
    const total = med.taken + med.missed;
    return Math.round((med.taken / total) * 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#FFF3E0', '#FFFFFF']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FF9800" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Medications</Text>
            <Text style={styles.headerSubtitle}>Medication Tracking</Text>
          </View>
          
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#FF9800" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Streak Card */}
        <View style={styles.streakContainer}>
          <LinearGradient
            colors={['#FFF3E0', '#FFFFFF']}
            style={styles.streakGradient}
          >
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={32} color="#FF9800" />
              <Text style={styles.streakNumber}>7</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <Text style={styles.streakNumber}>95%</Text>
              <Text style={styles.streakLabel}>Adherence</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Medications List */}
        <View style={styles.medicationsSection}>
          <Text style={styles.sectionTitle}>Your Medications</Text>
          {medications.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={styles.medHeader}>
                <View style={styles.medIconContainer}>
                  <Ionicons name="medical" size={24} color="#FF9800" />
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medDosage}>{med.dosage} • {med.frequency}</Text>
                </View>
                <View style={styles.adherenceContainer}>
                  <Text style={[
                    styles.adherenceText,
                    { color: getAdherenceRate(med) >= 90 ? '#4CAF50' : '#FF9800' }
                  ]}>
                    {getAdherenceRate(med)}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.medStats}>
                <View style={styles.medStat}>
                  <Text style={styles.medStatValue}>{med.taken}</Text>
                  <Text style={styles.medStatLabel}>Taken</Text>
                </View>
                <View style={styles.medStat}>
                  <Text style={[styles.medStatValue, { color: '#F44336' }]}>{med.missed}</Text>
                  <Text style={styles.medStatLabel}>Missed</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentLogs.map((log) => (
            <View key={log.id} style={styles.activityCard}>
              <View style={[
                styles.activityIndicator,
                { backgroundColor: log.taken ? '#4CAF50' : '#F44336' }
              ]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityMed}>{log.medication}</Text>
                <Text style={styles.activityStatus}>
                  {log.taken ? 'Taken' : 'Missed'}
                </Text>
              </View>
              <View style={styles.activityTime}>
                <Text style={styles.activityTimeText}>{formatTime(log.time)}</Text>
                <Text style={styles.activityDateText}>{formatDate(log.time)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        <LinearGradient
          colors={['#FF9800', '#F57C00']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  streakContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  streakGradient: {
    flexDirection: 'row',
    padding: 24,
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  medicationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  medDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  adherenceContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  adherenceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medStats: {
    flexDirection: 'row',
    gap: 16,
  },
  medStat: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  medStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  medStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  activitySection: {
    paddingHorizontal: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityMed: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityStatus: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    alignItems: 'flex-end',
  },
  activityTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
