import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function NotificationsScreen() {
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [healthTips, setHealthTips] = useState(true);
  const [logReminders, setLogReminders] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);

  const handleToggle = async (value: boolean, setter: (val: boolean) => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
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
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Manage your alerts</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Health Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Reminders</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="medical" size={24} color="#FF9800" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Medication Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when it's time to take your medications
                  </Text>
                </View>
              </View>
              <Switch
                value={medicationReminders}
                onValueChange={(value) => handleToggle(value, setMedicationReminders)}
                trackColor={{ false: '#D1D5DB', true: '#FFB74D' }}
                thumbColor={medicationReminders ? '#FF9800' : '#F3F4F6'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="clipboard" size={24} color="#2196F3" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Log Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Reminders to log your health metrics daily
                  </Text>
                </View>
              </View>
              <Switch
                value={logReminders}
                onValueChange={(value) => handleToggle(value, setLogReminders)}
                trackColor={{ false: '#D1D5DB', true: '#64B5F6' }}
                thumbColor={logReminders ? '#2196F3' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Content & Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content & Updates</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="bulb" size={24} color="#4CAF50" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Daily Health Tips</Text>
                  <Text style={styles.settingDescription}>
                    Receive helpful health tips and advice
                  </Text>
                </View>
              </View>
              <Switch
                value={healthTips}
                onValueChange={(value) => handleToggle(value, setHealthTips)}
                trackColor={{ false: '#D1D5DB', true: '#81C784' }}
                thumbColor={healthTips ? '#4CAF50' : '#F3F4F6'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="stats-chart" size={24} color="#9C27B0" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Weekly Reports</Text>
                  <Text style={styles.settingDescription}>
                    Summary of your health progress each week
                  </Text>
                </View>
              </View>
              <Switch
                value={weeklyReports}
                onValueChange={(value) => handleToggle(value, setWeeklyReports)}
                trackColor={{ false: '#D1D5DB', true: '#BA68C8' }}
                thumbColor={weeklyReports ? '#9C27B0' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="moon" size={24} color="#607D8B" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Enable Quiet Hours</Text>
                  <Text style={styles.settingDescription}>
                    Pause notifications during specified hours
                  </Text>
                </View>
              </View>
              <Switch
                value={quietHoursEnabled}
                onValueChange={(value) => handleToggle(value, setQuietHoursEnabled)}
                trackColor={{ false: '#D1D5DB', true: '#90A4AE' }}
                thumbColor={quietHoursEnabled ? '#607D8B' : '#F3F4F6'}
              />
            </View>

            {quietHoursEnabled && (
              <View style={styles.quietHoursSettings}>
                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Text style={styles.timeSelectorLabel}>From</Text>
                  <Text style={styles.timeSelectorValue}>10:00 PM</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.timeSelector}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Text style={styles.timeSelectorLabel}>To</Text>
                  <Text style={styles.timeSelectorValue}>7:00 AM</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <Text style={styles.infoText}>
            You can customize notification sounds and vibration patterns in your device settings.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  quietHoursSettings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  timeSelectorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
    width: 40,
  },
  timeSelectorValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});
