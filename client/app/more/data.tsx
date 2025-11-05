import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ReportService } from '../../services/health/ReportService';

export default function DataReportsScreen() {
  const { isDarkMode, colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Data & Reports</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Export your logs as a PDF medical report</Text>
      </View>
      <TouchableOpacity style={[styles.action, { backgroundColor: colors.surface }]}
        onPress={async () => {
          try {
            const uri = await ReportService.generateHealthReportPDF();
            if (!uri) {
              Alert.alert('Not signed in', 'Please sign in to export your report.');
              return;
            }
            await ReportService.sharePdf(uri);
          } catch (e) {
            Alert.alert('Export failed', 'Could not generate report.');
          }
        }}>
        <Ionicons name="download-outline" size={20} color="#667eea" />
        <Text style={[styles.actionText, { color: colors.text }]}>Export Health Report (PDF)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12 },
  actionText: { fontSize: 16, fontWeight: '600' },
});


