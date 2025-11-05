import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { educationArticles } from '../../../data/education/articles';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryListScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const list = educationArticles.filter(a => a.category === id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {String(id).charAt(0).toUpperCase() + String(id).slice(1)} Articles
          </Text>
          <TouchableOpacity
            style={[styles.videoButton, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/learn/videos/${id}` as any)}
          >
            <Ionicons name="play-circle-outline" size={20} color="#FF0000" />
            <Text style={[styles.videoButtonText, { color: colors.text }]}>Videos</Text>
          </TouchableOpacity>
        </View>
        {list.map((a) => (
          <TouchableOpacity key={a.id} style={[styles.card, { backgroundColor: colors.surface }]} onPress={() => router.push(`/learn/article/${a.id}` as any)}>
            <Text style={styles.emoji}>{a.image}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{a.title}</Text>
              <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{a.readTime} min • {a.difficulty}</Text>
              <Text style={[styles.cardSummary, { color: colors.textSecondary }]} numberOfLines={2}>{a.summary}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', flex: 1 },
  videoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8 },
  videoButtonText: { fontSize: 14, fontWeight: '600' },
  card: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 14, alignItems: 'center' },
  emoji: { fontSize: 28 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { fontSize: 12, fontWeight: '600' },
  cardSummary: { fontSize: 13 },
});


