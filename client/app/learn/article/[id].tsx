import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../context/ThemeContext';
import { educationArticles } from '../../../data/education/articles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArticleDetailScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const { id } = useLocalSearchParams();
  const [bookmarked, setBookmarked] = useState(false);

  const article = educationArticles.find(a => a.id === id);

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Article not found</Text>
      </View>
    );
  }

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookmarked(!bookmarked);
  };

  const getCategoryColor = () => {
    switch (article.category) {
      case 'diabetes': return isDarkMode ? '#7E22CE' : '#9C27B0';
      case 'hypertension': return isDarkMode ? '#DC2626' : '#F44336';
      case 'nutrition': return isDarkMode ? '#059669' : '#4CAF50';
      case 'exercise': return isDarkMode ? '#2563EB' : '#2196F3';
      case 'emergency': return isDarkMode ? '#EA580C' : '#FF9800';
      default: return isDarkMode ? '#6B7280' : '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={gradients.learn as [string, string, ...string[]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleBookmark}
            >
              <Ionicons 
                name={bookmarked ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Article Header */}
        <View style={styles.articleHeader}>
          <Text style={styles.articleEmoji}>{article.image}</Text>
          <Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor()}20` }]}>
              <Text style={[styles.categoryText, { color: getCategoryColor() }]}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.readTime} min read
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="bar-chart-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.difficulty}
              </Text>
            </View>
          </View>

          <Text style={[styles.summary, { color: colors.textSecondary }]}>
            {article.summary}
          </Text>
        </View>

        {/* Key Points */}
        <View style={[styles.keyPointsSection, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bulb" size={24} color={getCategoryColor()} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Takeaways</Text>
          </View>
          {article.keyPoints.map((point, index) => (
            <View key={index} style={styles.keyPointItem}>
              <View style={[styles.keyPointBullet, { backgroundColor: getCategoryColor() }]}>
                <Text style={styles.keyPointNumber}>{index + 1}</Text>
              </View>
              <Text style={[styles.keyPointText, { color: colors.text }]}>{point}</Text>
            </View>
          ))}
        </View>

        {/* Article Content */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color={getCategoryColor()} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Full Article</Text>
          </View>
          {article.content.map((paragraph, index) => {
            // Check if paragraph is a heading (all caps or starts with special markers)
            const isHeading = paragraph === paragraph.toUpperCase() && paragraph.length < 50;
            const isBullet = paragraph.startsWith('•');
            
            if (paragraph === '') {
              return <View key={index} style={styles.spacer} />;
            }
            
            if (isHeading) {
              return (
                <Text key={index} style={[styles.contentHeading, { color: getCategoryColor() }]}>
                  {paragraph}
                </Text>
              );
            }
            
            if (isBullet) {
              return (
                <View key={index} style={styles.bulletItem}>
                  <Text style={[styles.bulletPoint, { color: getCategoryColor() }]}>•</Text>
                  <Text style={[styles.bulletText, { color: colors.text }]}>
                    {paragraph.substring(1).trim()}
                  </Text>
                </View>
              );
            }
            
            return (
              <Text key={index} style={[styles.contentParagraph, { color: colors.text }]}>
                {paragraph}
              </Text>
            );
          })}
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={[styles.tagsTitle, { color: colors.textSecondary }]}>Related Topics</Text>
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F3F4F6' }]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Navigate to related articles
            }}
          >
            <Ionicons name="library-outline" size={24} color={getCategoryColor()} />
            <Text style={[styles.actionCardText, { color: colors.text }]}>More Articles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/learn/quiz' as any);
            }}
          >
            <Ionicons name="school-outline" size={24} color={getCategoryColor()} />
            <Text style={[styles.actionCardText, { color: colors.text }]}>Take Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  articleHeader: {
    marginBottom: 24,
  },
  articleEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 16,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  keyPointsSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  keyPointBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  keyPointNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  contentSection: {
    marginBottom: 24,
  },
  contentHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  contentParagraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 20,
    marginRight: 12,
    marginTop: -2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  spacer: {
    height: 12,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionCardText: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
