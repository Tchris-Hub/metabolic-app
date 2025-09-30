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

export default function PreferencesScreen() {
  const [useMetric, setUseMetric] = useState(false); // false = Imperial, true = Metric
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleToggle = async (value: boolean, setter: (val: boolean) => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
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
            <Text style={styles.headerTitle}>App Preferences</Text>
            <Text style={styles.headerSubtitle}>Customize your experience</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Units */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>

          <View style={styles.unitsCard}>
            <Text style={styles.unitsLabel}>Measurement System</Text>
            <View style={styles.unitsToggle}>
              <TouchableOpacity
                style={[styles.unitOption, !useMetric && styles.unitOptionActive]}
                onPress={() => handleToggle(false, setUseMetric)}
                activeOpacity={0.7}
              >
                <Text style={[styles.unitText, !useMetric && styles.unitTextActive]}>
                  Imperial
                </Text>
                <Text style={[styles.unitSubtext, !useMetric && styles.unitSubtextActive]}>
                  lbs, ft, °F
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.unitOption, useMetric && styles.unitOptionActive]}
                onPress={() => handleToggle(true, setUseMetric)}
                activeOpacity={0.7}
              >
                <Text style={[styles.unitText, useMetric && styles.unitTextActive]}>
                  Metric
                </Text>
                <Text style={[styles.unitSubtext, useMetric && styles.unitSubtextActive]}>
                  kg, cm, °C
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.unitsInfo}>
              <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.unitsInfoText}>
                This will affect all measurements throughout the app
              </Text>
            </View>
          </View>

          {/* Unit Examples */}
          <View style={styles.examplesCard}>
            <Text style={styles.examplesTitle}>Current Units:</Text>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Weight:</Text>
              <Text style={styles.exampleValue}>{useMetric ? 'Kilograms (kg)' : 'Pounds (lbs)'}</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Height:</Text>
              <Text style={styles.exampleValue}>{useMetric ? 'Centimeters (cm)' : 'Feet & Inches'}</Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Blood Sugar:</Text>
              <Text style={styles.exampleValue}>{useMetric ? 'mmol/L' : 'mg/dL'}</Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="moon" size={24} color="#9C27B0" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>
                    Use dark theme throughout the app
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(value) => handleToggle(value, setDarkMode)}
                trackColor={{ false: '#D1D5DB', true: '#BA68C8' }}
                thumbColor={darkMode ? '#9C27B0' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Interaction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interaction</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="phone-portrait" size={24} color="#FF9800" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibration feedback for interactions
                  </Text>
                </View>
              </View>
              <Switch
                value={hapticFeedback}
                onValueChange={(value) => handleToggle(value, setHapticFeedback)}
                trackColor={{ false: '#D1D5DB', true: '#FFB74D' }}
                thumbColor={hapticFeedback ? '#FF9800' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIcon}>
                  <Ionicons name="sync" size={24} color="#4CAF50" />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Auto-Sync</Text>
                  <Text style={styles.settingDescription}>
                    Automatically sync data when connected
                  </Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={(value) => handleToggle(value, setAutoSync)}
                trackColor={{ false: '#D1D5DB', true: '#81C784' }}
                thumbColor={autoSync ? '#4CAF50' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // TODO: Save preferences
              router.back();
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.saveGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.saveText}>Save Preferences</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  unitsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  unitsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  unitsToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  unitOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  unitOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2196F3',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  unitTextActive: {
    color: '#2196F3',
  },
  unitSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unitSubtextActive: {
    color: '#64B5F6',
  },
  unitsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitsInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  examplesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  exampleLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  exampleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
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
  saveSection: {
    paddingHorizontal: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
