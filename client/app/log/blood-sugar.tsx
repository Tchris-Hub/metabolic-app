import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AdvancedLineChart from '../../component/charts/AdvancedLineChart';
import { useAuth } from '../../contexts/AuthContext';
import { HealthReadingsRepository } from '../../services/supabase/repositories/HealthReadingsRepository';
import BloodSugarModal from '../../component/modals/BloodSugarModal';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Reading {
  id: string;
  value: number;
  mealTiming: string;
  time: Date;
  notes?: string;
}

export default function BloodSugarDetailScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const [filterRange, setFilterRange] = useState<'7days' | '30days' | '3months'>('7days');
  const { user } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const days = useMemo(() => (filterRange === '7days' ? 7 : filterRange === '30days' ? 30 : 90), [filterRange]);

  const load = async () => {
    if (!user) return;
    const rows = await HealthReadingsRepository.getReadingsByType(user.id, 'bloodSugar', { days });
    const mapped: Reading[] = rows.map((r: any) => ({
      id: r.id,
      value: r.value,
      mealTiming: r.metadata?.meal_context || 'unspecified',
      time: new Date(r.timestamp),
      notes: r.notes || undefined,
    }));
    setReadings(mapped);
  };

  useEffect(() => { load(); }, [user, days]);

  const filterOptions: { value: '7days' | '30days' | '3months'; label: string }[] = [
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '3months', label: '3 Months' },
  ];

  const getValueColor = (value: number) => {
    if (value < 70) return '#F44336'; // Low
    if (value <= 130) return '#4CAF50'; // Normal
    if (value <= 180) return '#FFC107'; // Elevated
    return '#F44336'; // High
  };

  const getMealTimingLabel = (timing: string) => {
    switch (timing) {
      case 'fasting': return 'Fasting';
      case 'before-meal': return 'Before Meal';
      case 'after-meal': return 'After Meal';
      default: return timing;
    }
  };

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

  const getAverageReading = () => {
    const sum = readings.reduce((acc, r) => acc + r.value, 0);
    return Math.round(sum / readings.length);
  };

  const getInRangePercentage = () => {
    const inRange = readings.filter(r => r.value >= 70 && r.value <= 130).length;
    return Math.round((inRange / readings.length) * 100);
  };

  // Advanced chart data with safe fallback (chart requires >= 2 points)
  const baseChartData = readings.slice(0, 7).reverse().map(r => ({
    value: r.value,
    label: formatDate(r.time),
    color: getValueColor(r.value),
  }));
  const chartData = baseChartData.length >= 2
    ? baseChartData
    : [
        { value: 0, label: '', color: '#E5E7EB' },
        { value: 0, label: '', color: '#E5E7EB' },
      ];

  const handleExport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement export functionality
    console.log('Exporting blood sugar data...');
  };

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleSave = async (data: any) => {
    if (!user) return;
    try {
      const value = parseFloat(data.value);
      const id = await HealthReadingsRepository.saveBloodSugarReading({
        user_id: user.id,
        value,
        unit: data.unit || 'mg/dL',
        meal_context: data.mealContext,
        notes: data.notes,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Blood sugar reading saved successfully.');
      setModalVisible(false);
      await load();
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', e?.message || 'Failed to save blood sugar reading.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ['#7C2D12', '#991B1B'] : ['#FCE4EC', '#FFFFFF']}
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
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#FCA5A5' : '#E91E63'} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#FEE2E2' : '#1F2937' }]}>Blood Sugar</Text>
            <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#FECACA' : '#6B7280' }]}>Glucose Tracking</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={20} color={isDarkMode ? '#FCA5A5' : '#E91E63'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{getAverageReading()}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg mg/dL</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>{getInRangePercentage()}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Range</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{readings.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Readings</Text>
          </View>
        </View>

        {/* Filter Options */}
        <View style={styles.filterContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: colors.border },
                filterRange === option.value && styles.filterButtonActive
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterRange(option.value);
              }}
            >
              <Text style={[
                styles.filterText,
                filterRange === option.value && styles.filterTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Trend Over Time</Text>
          <View style={styles.chartContainer}>
            <AdvancedLineChart
              data={chartData}
              height={240}
              color="#E91E63"
              showGrid={true}
              showDots={true}
              animated={true}
              onPointPress={(point, index) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                console.log('Point pressed:', point);
              }}
            />
          </View>
          
          {/* Reference Lines */}
          <View style={styles.referenceContainer}>
            <View style={styles.referenceItem}>
              <View style={[styles.referenceDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.referenceText}>Normal (70-130 mg/dL)</Text>
            </View>
            <View style={styles.referenceItem}>
              <View style={[styles.referenceDot, { backgroundColor: '#FFC107' }]} />
              <Text style={styles.referenceText}>Elevated (131-180 mg/dL)</Text>
            </View>
            <View style={styles.referenceItem}>
              <View style={[styles.referenceDot, { backgroundColor: '#F44336' }]} />
              <Text style={styles.referenceText}>High (&gt;180 mg/dL)</Text>
            </View>
          </View>
        </View>

        {/* Readings List */}
        <View style={styles.readingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Readings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {readings.map((reading) => (
            <View key={reading.id} style={styles.readingCard}>
              <View style={styles.readingLeft}>
                <View style={[
                  styles.readingIndicator,
                  { backgroundColor: getValueColor(reading.value) }
                ]} />
                <View style={styles.readingInfo}>
                  <Text style={styles.readingValue}>{reading.value} mg/dL</Text>
                  <Text style={styles.readingTiming}>{getMealTimingLabel(reading.mealTiming)}</Text>
                  {reading.notes && (
                    <Text style={styles.readingNotes}>{reading.notes}</Text>
                  )}
                </View>
              </View>
              <View style={styles.readingRight}>
                <Text style={styles.readingTime}>{formatTime(reading.time)}</Text>
                <Text style={styles.readingDate}>{formatDate(reading.time)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAdd}
      >
        <LinearGradient
          colors={['#E91E63', '#C2185B']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <BloodSugarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
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
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
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
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E91E63',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  referenceContainer: {
    marginTop: 16,
    gap: 8,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  referenceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  readingsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  readingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  readingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  readingIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  readingInfo: {
    flex: 1,
  },
  readingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  readingTiming: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  readingNotes: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  readingRight: {
    alignItems: 'flex-end',
  },
  readingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  readingDate: {
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
