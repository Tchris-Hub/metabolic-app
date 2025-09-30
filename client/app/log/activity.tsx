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
import AdvancedLineChart from '../../component/charts/AdvancedLineChart';

export default function ActivityDetailScreen() {
  const activities = [
    { id: '1', steps: 8547, date: new Date(2024, 0, 15), calories: 320, distance: 4.2 },
    { id: '2', steps: 7234, date: new Date(2024, 0, 14), calories: 280, distance: 3.6 },
    { id: '3', steps: 9821, date: new Date(2024, 0, 13), calories: 380, distance: 4.9 },
    { id: '4', steps: 6543, date: new Date(2024, 0, 12), calories: 250, distance: 3.3 },
    { id: '5', steps: 10234, date: new Date(2024, 0, 11), calories: 400, distance: 5.1 },
    { id: '6', steps: 7891, date: new Date(2024, 0, 10), calories: 310, distance: 3.9 },
    { id: '7', steps: 8123, date: new Date(2024, 0, 9), calories: 315, distance: 4.1 },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = activities.slice(0, 7).reverse().map(a => ({
    value: a.steps,
    label: formatDate(a.date),
    color: a.steps >= 10000 ? '#4CAF50' : a.steps >= 7000 ? '#9C27B0' : '#FFC107',
  }));

  const avgSteps = Math.round(activities.reduce((acc, a) => acc + a.steps, 0) / activities.length);
  const totalDistance = activities.reduce((acc, a) => acc + a.distance, 0).toFixed(1);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#F3E5F5', '#FFFFFF']}
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
            <Ionicons name="chevron-back" size={24} color="#9C27B0" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Activity</Text>
            <Text style={styles.headerSubtitle}>Activity Tracking</Text>
          </View>
          
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="footsteps" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>{avgSteps}</Text>
            <Text style={styles.statLabel}>Avg Steps</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF5722" />
            <Text style={styles.statValue}>320</Text>
            <Text style={styles.statLabel}>Avg Calories</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="navigate" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{totalDistance}</Text>
            <Text style={styles.statLabel}>Total Miles</Text>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Steps Trend</Text>
          <View style={styles.chartContainer}>
            <AdvancedLineChart
              data={chartData}
              height={240}
              color="#9C27B0"
              showGrid={true}
              showDots={true}
            />
          </View>
          
          {/* Goal Progress */}
          <View style={styles.goalContainer}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily Goal: 10,000 steps</Text>
              <Text style={styles.goalPercentage}>85%</Text>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '85%' }]} />
            </View>
          </View>
        </View>

        {/* Activity List */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          {activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={[
                styles.activityIndicator,
                { backgroundColor: activity.steps >= 10000 ? '#4CAF50' : '#9C27B0' }
              ]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activitySteps}>{activity.steps.toLocaleString()} steps</Text>
                <Text style={styles.activityDetails}>
                  {activity.distance} mi • {activity.calories} cal
                </Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
                {activity.steps >= 10000 && (
                  <Ionicons name="trophy" size={20} color="#FFD700" />
                )}
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
          colors={['#9C27B0', '#7B1FA2']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerGradient: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(156, 39, 176, 0.1)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  exportButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(156, 39, 176, 0.1)', alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  chartSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  chartContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  goalContainer: { marginTop: 16, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  goalTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  goalPercentage: { fontSize: 18, fontWeight: 'bold', color: '#9C27B0' },
  goalBar: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: '#9C27B0', borderRadius: 4 },
  activitySection: { paddingHorizontal: 20 },
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  activityIndicator: { width: 4, height: 40, borderRadius: 2, marginRight: 12 },
  activityInfo: { flex: 1 },
  activitySteps: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  activityDetails: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  activityRight: { alignItems: 'flex-end', gap: 4 },
  activityDate: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabGradient: { width: '100%', height: '100%', borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
