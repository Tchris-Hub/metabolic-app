import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function AddMealScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  const onSave = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (!name.trim()) {
        Alert.alert('Missing name', 'Please enter a meal name.');
        return;
      }
      // Minimal placeholder: in a fuller implementation, persist to Supabase or Redux
      Alert.alert('Saved', `${name} added (cal ${calories || '0'})`);
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save meal.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <LinearGradient colors={isDarkMode ? (gradients.meal as [string, string]) : ['#FFF3E0', '#FFFFFF']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#1F2937' }]}>Add Meal</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Meal name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Grilled chicken salad"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB' }]}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={[styles.label, { color: colors.text }]}>Calories</Text>
              <TextInput
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB' }]}
              />
            </View>
            <View style={styles.col}>
              <Text style={[styles.label, { color: colors.text }]}>Carbs (g)</Text>
              <TextInput
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB' }]}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={[styles.label, { color: colors.text }]}>Protein (g)</Text>
              <TextInput
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB' }]}
              />
            </View>
            <View style={styles.col}>
              <Text style={[styles.label, { color: colors.text }]}>Fat (g)</Text>
              <TextInput
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB' }]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave} activeOpacity={0.9}>
          <LinearGradient colors={["#FF9800", "#F57C00"]} style={styles.saveBtnGradient}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Save Meal</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.06)' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 12 },
  content: { padding: 20 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  label: { fontSize: 14, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  saveBtn: { marginTop: 12 },
  saveBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});