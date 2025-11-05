import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function HelpSupportScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
      <Text style={[styles.paragraph, { color: colors.textSecondary }]}>Need help? Check FAQs or contact support.</Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com')}>
        <Text style={[styles.link]}>Email Support</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  paragraph: { fontSize: 14, marginBottom: 16 },
  link: { color: '#667eea', fontSize: 16, fontWeight: '600' },
});


