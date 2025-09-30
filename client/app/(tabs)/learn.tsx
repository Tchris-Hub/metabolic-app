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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { educationArticles, getFeaturedArticle } from '../../data/education/articles';
import { healthQuizzes } from '../../data/education/quizzes';
import LoadingScreen from '../../component/common/LoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LearnScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  const featuredArticle = getFeaturedArticle();

  const categories = [
    { id: 'diabetes', name: 'Understanding Diabetes', icon: '📚', color: '#E91E63', articles: 2 },
    { id: 'hypertension', name: 'Managing Hypertension', icon: '❤️', color: '#2196F3', articles: 1 },
    { id: 'nutrition', name: 'Nutrition Basics', icon: '🥗', color: '#4CAF50', articles: 1 },
    { id: 'exercise', name: 'Exercise Guide', icon: '🏃', color: '#FF9800', articles: 1 },
    { id: 'emergency', name: 'Emergency Info', icon: '🚨', color: '#F44336', articles: 1 },
  ];

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

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate refreshing education content
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  // Show loading screen while content is being loaded
  if (loading) {
    return <LoadingScreen message="Loading health education..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9C27B0"
            colors={['#9C27B0']}
          />
        }
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#9C27B0', '#7B1FA2']}
          style={styles.heroSection}
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
            <Text style={styles.sectionTitle}>Featured Article</Text>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>NEW</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/learn/article/${featuredArticle.id}` as any);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredEmoji}>{featuredArticle.image}</Text>
              <View style={styles.featuredTextContent}>
                <Text style={styles.featuredTitle} numberOfLines={2}>{featuredArticle.title}</Text>
                <Text style={styles.featuredSummary} numberOfLines={2}>
                  {featuredArticle.summary}
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#9C27B0" />
                    <Text style={styles.metaText}>{featuredArticle.readTime} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="bar-chart-outline" size={14} color="#9C27B0" />
                    <Text style={styles.metaText}>{featuredArticle.difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Health Topics</Text>
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
                  style={styles.categoryCard}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/learn/category/${category.id}` as any);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={[styles.categoryIconWrapper, { backgroundColor: `${category.color}20` }]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.articles} articles</Text>
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
            <Text style={styles.sectionTitle}>Test Your Knowledge</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {healthQuizzes.slice(0, 2).map((quiz, index) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
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

        <View style={{ height: 100 }} />
      </ScrollView>
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
});
