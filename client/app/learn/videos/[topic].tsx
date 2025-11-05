import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { YouTubeService, YouTubeVideo } from '../../../services/youtube/YouTubeService';
import { Ionicons } from '@expo/vector-icons';

export default function HealthVideosScreen() {
  const { topic } = useLocalSearchParams();
  const { colors } = useTheme();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [topic]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const topicVideos = await YouTubeService.getHealthTopicVideos(topic as any);
      setVideos(topicVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    const url = YouTubeService.getWatchUrl(video.id);
    Linking.openURL(url);
  };

  const getTopicTitle = () => {
    const titles = {
      diabetes: 'Diabetes Management Videos',
      hypertension: 'Blood Pressure Videos',
      nutrition: 'Nutrition & Diet Videos',
      exercise: 'Exercise & Fitness Videos',
      emergency: 'Emergency Health Videos',
    };
    return titles[topic as keyof typeof titles] || 'Health Videos';
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{getTopicTitle()}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Educational videos to help you learn more about {topic}
        </Text>
        
        {videos.length > 0 ? (
          videos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={[styles.videoCard, { backgroundColor: colors.surface }]}
              onPress={() => handleVideoPress(video)}
            >
              <View style={styles.videoThumbnail}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={[styles.channelName, { color: colors.textSecondary }]}>
                  {video.channelTitle}
                </Text>
                <Text style={[styles.videoDuration, { color: colors.textSecondary }]}>
                  {video.duration}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📺</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No videos found</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Check your internet connection and try again
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  loadingText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  videoCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { fontSize: 20 },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  channelName: { fontSize: 12, marginBottom: 2 },
  videoDuration: { fontSize: 12 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
