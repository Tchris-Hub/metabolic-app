import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function PrivacyScreen() {
  const { isDarkMode, colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Privacy & Security</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>We respect your privacy. Your health data stays on secure servers and is used only to power app features you opt into. You can export or delete your data anytime.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  paragraph: { fontSize: 14, lineHeight: 20 },
});


