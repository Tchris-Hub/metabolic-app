import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { educationArticles, getFeaturedArticle } from '../../data/education/articles';
import { healthQuizzes } from '../../data/education/quizzes';
import Skeleton, { CardSkeleton, ListSkeleton } from '../../component/ui/Skeleton';
import { PersonalizedEducationService } from '../../services/PersonalizedEducationService';
import { YouTubeService, YouTubeVideo } from '../../services/apis/YouTubeService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LearnScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [personalizedArticles, setPersonalizedArticles] = useState(educationArticles);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Mock user profile for demonstration - in real app, this would come from Redux/auth
  const mockUserProfile = {
    goals: ['glucose control', 'weight management', 'better sleep'],
    readings: {
      bloodSugar: [120, 145, 135, 110, 150, 125, 140, 130],
      bloodPressure: [
        { systolic: 125, diastolic: 80 },
        { systolic: 130, diastolic: 85 },
        { systolic: 128, diastolic: 82 }
      ],
      weight: [75, 74.5, 74, 73.8, 74.2]
    },
    preferences: {
      dietType: 'low-carb',
      activityLevel: 'moderate',
      conditions: ['diabetes', 'hypertension']
    }
  };

  useEffect(() => {
    loadPersonalizedContent();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Simulate loading education content
    const loadContent = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      setLoading(false);
    };

    loadContent();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadYouTubeVideos = async () => {
    try {
      console.log('📺 Loading YouTube videos...');
      setVideosLoading(true);
      
      // Load diabetes-related educational videos
      const videos = await YouTubeService.getHealthVideos('diabetes');
      console.log('✅ Loaded YouTube videos:', videos.length);
      
      setYoutubeVideos(videos);
      setVideosLoading(false);
    } catch (error) {
      console.error('❌ Failed to load YouTube videos:', error);
      setVideosLoading(false);
    }
  };

  const loadPersonalizedContent = async () => {
    try {
      // Generate personalized articles based on user profile
      const personalizedArticles = PersonalizedEducationService.generatePersonalizedArticles(mockUserProfile);

      const recommendations = PersonalizedEducationService.getPersonalizedRecommendations(mockUserProfile);

      setPersonalizedArticles(personalizedArticles.length > 0 ? personalizedArticles : educationArticles);
      setPersonalizedRecommendations(recommendations);

      // Load YouTube videos
      loadYouTubeVideos();

      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    } catch (error) {
      console.error('Error loading personalized content:', error);
      setPersonalizedArticles(educationArticles);
      setLoading(false);
    }
  };

  // Render skeleton loading state
  const renderLoadingSkeleton = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Hero Section Skeleton */}
      <LinearGradient
        colors={gradients.learn as [string, string, ...string[]]}
        style={[styles.heroSection, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroGreeting}>Loading...</Text>
            <Text style={styles.heroTitle}>Personalizing for you</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={[styles.statCard, { opacity: 0.6 }]}>
              <Skeleton width={40} height={24} borderRadius={4} />
              <View style={{ height: 8 }} />
              <Skeleton width={50} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Featured Article Skeleton */}
      <View style={styles.featuredSection}>
        <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        <View style={[styles.featuredCard, { backgroundColor: colors.surface }]}>
          <View style={styles.featuredContent}>
            <Skeleton width={56} height={56} borderRadius={12} />
            <View style={styles.featuredTextContent}>
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <Skeleton width="70%" height={12} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      {/* Categories Grid Skeleton */}
      <View style={styles.categoriesSection}>
        <Skeleton width={120} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        <View style={styles.categoriesGrid}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.categoryWrapper}>
              <CardSkeleton style={{ minHeight: 160 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // Show skeleton loading screen while content is being loaded
  if (loading) {
    return renderLoadingSkeleton();
  }

  // Get featured article from personalized content
  const featuredArticle = personalizedArticles[0] || getFeaturedArticle();

  const categories = [
    { id: 'diabetes', name: 'Understanding Diabetes', icon: '📚', color: '#E91E63', articles: educationArticles.filter(a => a.category === 'diabetes').length },
    { id: 'hypertension', name: 'Managing Hypertension', icon: '❤️', color: '#2196F3', articles: educationArticles.filter(a => a.category === 'hypertension').length },
    { id: 'nutrition', name: 'Nutrition Basics', icon: '🥗', color: '#4CAF50', articles: educationArticles.filter(a => a.category === 'nutrition').length },
    { id: 'exercise', name: 'Exercise Guide', icon: '🏃', color: '#FF9800', articles: educationArticles.filter(a => a.category === 'exercise').length },
    { id: 'emergency', name: 'Emergency Info', icon: '🚨', color: '#F44336', articles: educationArticles.filter(a => a.category === 'emergency').length },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    await loadPersonalizedContent();

    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#A78BFA' : '#9C27B0'}
            colors={[isDarkMode ? '#A78BFA' : '#9C27B0']}
          />
        }
      >
        {/* Hero Header */}
        <LinearGradient
          colors={gradients.learn as [string, string, ...string[]]}
          style={[styles.heroSection, { paddingTop: insets.top + 16 }]}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>Expand Your Knowledge 💡</Text>
                <Text style={styles.heroTitle}>Learn & Grow</Text>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="search" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{educationArticles.length}</Text>
                <Text style={styles.statLabel}>Articles</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{healthQuizzes.length}</Text>
                <Text style={styles.statLabel}>Quizzes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Topics</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
        {/* Featured Article */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Article</Text>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>NEW</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: colors.surface }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/learn/article/${featuredArticle.id}` as any);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredEmoji}>{featuredArticle.image}</Text>
              <View style={styles.featuredTextContent}>
                <Text style={[styles.featuredTitle, { color: colors.text }]} numberOfLines={2}>{featuredArticle.title}</Text>
                <Text style={[styles.featuredSummary, { color: colors.textSecondary }]} numberOfLines={2}>
                  {featuredArticle.summary}
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={isDarkMode ? '#C084FC' : '#9C27B0'} />
                    <Text style={[styles.metaText, { color: isDarkMode ? '#C084FC' : '#9C27B0' }]}>{featuredArticle.readTime} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="bar-chart-outline" size={14} color={isDarkMode ? '#C084FC' : '#9C27B0'} />
                    <Text style={[styles.metaText, { color: isDarkMode ? '#C084FC' : '#9C27B0' }]}>{featuredArticle.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Topics</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  styles.categoryWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 10)]
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={[styles.categoryCard, { backgroundColor: colors.surface }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/learn/category/${category.id}` as any);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={[styles.categoryIconWrapper, { backgroundColor: `${category.color}20` }]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={2}>{category.name}</Text>
                  <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>{category.articles} articles</Text>
                  <View style={[styles.categoryArrow, { backgroundColor: `${category.color}` }]}>
                    <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Interactive Quizzes */}
        <View style={styles.quizzesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Test Your Knowledge</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {healthQuizzes.slice(0, 2).map((quiz, index) => (
            <TouchableOpacity
              key={quiz.id}
              style={[styles.quizCard, { backgroundColor: colors.surface }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/learn/quiz/${quiz.id}` as any);
              }}
              activeOpacity={0.9}
            >
              <View style={[styles.quizIconWrapper, { backgroundColor: quiz.badge.color + '20' }]}>
                <Text style={styles.quizEmoji}>{quiz.badge.icon}</Text>
              </View>
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizDescription} numberOfLines={1}>
                  {quiz.description}
                </Text>
                <View style={styles.quizFooter}>
                  <Text style={styles.quizQuestions}>{quiz.questions.length} questions</Text>
                  <View style={[styles.quizBadge, { backgroundColor: quiz.badge.color }]}>
                    <Ionicons name="trophy" size={12} color="#FFFFFF" />
                    <Text style={styles.quizBadgeText}>Badge</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* YouTube Educational Videos */}
        <View style={styles.videosSection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Video Tutorials</Text>
            </View>
          </View>
          
          {videosLoading ? (
            // Video loading skeleton
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            >
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={[styles.videoCard, { backgroundColor: colors.surface }]}>
                  <Skeleton width={280} height={160} borderRadius={0} />
                  <View style={styles.videoInfo}>
                    <Skeleton width="90%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                    <Skeleton width="60%" height={12} borderRadius={4} />
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : youtubeVideos.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            >
              {youtubeVideos.slice(0, 10).map((video, index) => (
                <TouchableOpacity
                  key={video.id}
                  style={[styles.videoCard, { backgroundColor: colors.surface }]}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const url = YouTubeService.getWatchUrl(video.id);
                    Linking.openURL(url);
                  }}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.videoOverlay}>
                    <View style={styles.playButton}>
                      <Ionicons name="play" size={24} color="#FFFFFF" />
                    </View>
                  </View>
                  {video.duration && (
                    <View style={styles.videoDuration}>
                      <Text style={styles.videoDurationText}>{video.duration}</Text>
                    </View>
                  )}
                  <View style={styles.videoInfo}>
                    <Text style={[styles.videoTitle, { color: colors.text }]} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={[styles.videoChannel, { color: colors.textSecondary }]} numberOfLines={1}>
                      {video.channelTitle}
                    </Text>
                    {video.viewCount && (
                      <View style={styles.videoMeta}>
                        <Ionicons name="eye-outline" size={12} color={colors.textSecondary} />
                        <Text style={[styles.videoMetaText, { color: colors.textSecondary }]}>
                          {video.viewCount} views
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            // Empty state for no videos
            <View style={[styles.emptyVideosState, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyVideosEmoji}>📺</Text>
              <Text style={[styles.emptyVideosTitle, { color: colors.text }]}>No videos available</Text>
              <Text style={[styles.emptyVideosText, { color: colors.textSecondary }]}>
                Check back later for educational video content
              </Text>
              <TouchableOpacity
                style={styles.emptyVideosButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  loadYouTubeVideos();
                }}
                accessibilityRole="button"
                accessibilityLabel="Retry loading videos"
                accessibilityHint="Tap to try loading videos again"
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.emptyVideosButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button - Gamification Quiz */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/learn/quiz' as any);
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#9C27B0', '#7B1FA2']}
          style={styles.fabGradient}
        >
          <Ionicons name="game-controller" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // Hero Section
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  heroGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuredBadge: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredContent: {
    flexDirection: 'row',
    gap: 16,
  },
  featuredEmoji: {
    fontSize: 56,
  },
  featuredTextContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  featuredSummary: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9C27B0',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryWrapper: {
    width: (SCREEN_WIDTH - 52) / 2,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  categoryIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    minHeight: 36,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  categoryArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  quizzesSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9C27B0',
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quizIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizEmoji: {
    fontSize: 28,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  quizFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizQuestions: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  quizBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // YouTube Videos Section
  videosSection: {
    paddingVertical: 24,
  },
  videoCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  videoThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E7EB',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 76,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  videoChannel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoMetaText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  // Empty videos state
  emptyVideosState: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyVideosEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyVideosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyVideosText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyVideosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C27B0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyVideosButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
