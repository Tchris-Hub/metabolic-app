import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AdvancedLineChart from '../../component/charts/AdvancedLineChart';
import { useAuth } from '../../contexts/AuthContext';
import { HealthReadingsRepository } from '../../services/supabase/repositories/HealthReadingsRepository';
import WeightModal from '../../component/modals/WeightModal';

export default function WeightDetailScreen() {
  type Reading = { id: string; value: number; unit: string; time: Date; notes?: string };
  const { user } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const load = async () => {
    if (!user) return;
    const rows = await HealthReadingsRepository.getReadingsByType(user.id, 'weight', { days: 30 });
    const mapped: Reading[] = rows.map((r: any) => ({
      id: r.id,
      value: r.value,
      unit: r.unit,
      time: new Date(r.timestamp),
      notes: r.notes || undefined,
    }));
    setReadings(mapped);
  };

  useEffect(() => { load(); }, [user]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = readings.slice(0, 7).reverse().map(r => ({
    value: r.value,
    label: formatDate(r.time),
    color: '#4CAF50',
  }));

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleSave = async (data: { weight: string; unit: 'kg' | 'lbs'; time: Date; bodyFat?: string }) => {
    if (!user) return;
    try {
      const weightNum = parseFloat(data.weight);
      await HealthReadingsRepository.saveWeightReading({
        user_id: user.id,
        weight: weightNum,
        unit: data.unit,
        timestamp: data.time?.toISOString(),
        notes: undefined,
        body_fat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Weight reading saved successfully.');
      setModalVisible(false);
      await load();
    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', e?.message || 'Failed to save weight reading.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient colors={['#E8F5E8', '#FFFFFF']} style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Weight</Text>
            <Text style={styles.headerSubtitle}>Weight Management</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>165</Text>
            <Text style={styles.statLabel}>Current lbs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>-2</Text>
            <Text style={styles.statLabel}>Change lbs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23.4</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weight Trend</Text>
          <View style={styles.chartContainer}>
            <AdvancedLineChart data={chartData} height={240} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.readingsSection}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {readings.map((reading) => (
            <View key={reading.id} style={styles.readingCard}>
              <View style={styles.readingLeft}>
                <View style={[styles.readingIndicator, { backgroundColor: '#4CAF50' }]} />
                <View style={styles.readingInfo}>
                  <Text style={styles.readingValue}>{reading.value} lbs</Text>
                  <Text style={styles.readingTiming}>Daily Weigh-in</Text>
                </View>
              </View>
              <View style={styles.readingRight}>
                <Text style={styles.readingTime}>Morning</Text>
                <Text style={styles.readingDate}>{formatDate(reading.time)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.fabGradient}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
      <WeightModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerGradient: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(76, 175, 80, 0.1)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  exportButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(76, 175, 80, 0.1)', alignItems: 'center', justifyContent: 'center' },
  scrollView: { flex: 1 },
  statsContainer: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  chartSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  chartContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  readingsSection: { paddingHorizontal: 20 },
  readingCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  readingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  readingIndicator: { width: 4, height: 40, borderRadius: 2, marginRight: 12 },
  readingInfo: { flex: 1 },
  readingValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  readingTiming: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  readingRight: { alignItems: 'flex-end' },
  readingTime: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  readingDate: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabGradient: { width: '100%', height: '100%', borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
});
