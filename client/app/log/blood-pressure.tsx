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
import BloodPressureModal from '../../component/modals/BloodPressureModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BloodPressureDetailScreen() {
  const [filterRange, setFilterRange] = useState<'7days' | '30days' | '3months'>('7days');
  const { user } = useAuth();
  const [readings, setReadings] = useState<Array<{ id: string; systolic: number; diastolic: number; time: Date; notes?: string }>>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const days = useMemo(() => (filterRange === '7days' ? 7 : filterRange === '30days' ? 30 : 90), [filterRange]);

  const load = async () => {
    if (!user) return;
    const rows = await HealthReadingsRepository.getReadingsByType(user.id, 'bloodPressure', { days });
    const mapped = rows.map((r: any) => ({
      id: r.id,
      systolic: r.metadata?.systolic ?? r.value,
      diastolic: r.metadata?.diastolic ?? 0,
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

  const getBPColor = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return '#4CAF50';
    if (systolic < 130 && diastolic < 80) return '#FFC107';
    if (systolic < 140 || diastolic < 90) return '#FF9800';
    return '#F44336';
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
    const avgSys = Math.round(readings.reduce((acc, r) => acc + r.systolic, 0) / readings.length);
    const avgDia = Math.round(readings.reduce((acc, r) => acc + r.diastolic, 0) / readings.length);
    return `${avgSys}/${avgDia}`;
  };

  const chartData = readings.slice(0, 7).reverse().map(r => ({
    value: r.systolic,
    label: formatDate(r.time),
    color: getBPColor(r.systolic, r.diastolic),
  }));

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleSave = async (data: { systolic: string; diastolic: string; pulse?: string; time: Date }) => {
    if (!user) return;
    try {
      const systolic = parseInt(data.systolic, 10);
      const diastolic = parseInt(data.diastolic, 10);
      const heart_rate = data.pulse ? parseInt(data.pulse, 10) : undefined;
      await HealthReadingsRepository.saveBloodPressureReading({
        user_id: user.id,
        systolic,
        diastolic,
        heart_rate,
        timestamp: data.time?.toISOString(),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Blood pressure reading saved successfully.');
      setModalVisible(false);
      await load();
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', e?.message || 'Failed to save blood pressure reading.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#E3F2FD', '#FFFFFF']}
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
            <Ionicons name="chevron-back" size={24} color="#2196F3" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Blood Pressure</Text>
            <Text style={styles.headerSubtitle}>BP Monitoring</Text>
          </View>
          
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{getAverageReading()}</Text>
            <Text style={styles.statLabel}>Avg mmHg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>95%</Text>
            <Text style={styles.statLabel}>In Range</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{readings.length}</Text>
            <Text style={styles.statLabel}>Readings</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                filterRange === option.value && styles.filterButtonActive
              ]}
              onPress={() => setFilterRange(option.value)}
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

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Systolic Trend</Text>
          <View style={styles.chartContainer}>
            <AdvancedLineChart
              data={chartData}
              height={240}
              color="#2196F3"
              showGrid={true}
              showDots={true}
            />
          </View>
        </View>

        <View style={styles.readingsSection}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {readings.map((reading) => (
            <View key={reading.id} style={styles.readingCard}>
              <View style={styles.readingLeft}>
                <View style={[
                  styles.readingIndicator,
                  { backgroundColor: getBPColor(reading.systolic, reading.diastolic) }
                ]} />
                <View style={styles.readingInfo}>
                  <Text style={styles.readingValue}>
                    {reading.systolic}/{reading.diastolic} mmHg
                  </Text>
                  <Text style={styles.readingTiming}>Morning Reading</Text>
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

      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAdd}
      >
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
      <BloodPressureModal
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
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
    color: '#2196F3',
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
    backgroundColor: '#2196F3',
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
  readingsSection: {
    paddingHorizontal: 20,
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
