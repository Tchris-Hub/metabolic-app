import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryCard {
  id: string;
  title: string;
  icon: string;
  iconType: 'ionicons' | 'material';
  color: string;
  gradientColors: string[];
  lastReading: string;
  status: string;
  route: string;
}

export default function LogScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const [categories] = useState<CategoryCard[]>([
    {
      id: '1',
      title: 'Blood Sugar Tracking',
      icon: 'water',
      iconType: 'ionicons',
      color: '#E91E63',
      gradientColors: ['#FCE4EC', '#FFFFFF'],
      lastReading: '124 mg/dL',
      status: 'Normal • 2h ago',
      route: '/(tabs)/log' // Temporarily navigate to log screen until we create all detail screens
    },
    {
      id: '2',
      title: 'Blood Pressure Monitoring',
      icon: 'heart',
      iconType: 'ionicons',
      color: '#2196F3',
      gradientColors: ['#E3F2FD', '#FFFFFF'],
      lastReading: '120/80 mmHg',
      status: 'Normal • This morning',
      route: '/(tabs)/log'
    },
    {
      id: '3',
      title: 'Weight Management',
      icon: 'monitor-weight',
      iconType: 'material',
      color: '#4CAF50',
      gradientColors: ['#E8F5E8', '#FFFFFF'],
      lastReading: '165 lbs',
      status: 'On track • Yesterday',
      route: '/(tabs)/log'
    },
    {
      id: '4',
      title: 'Medication Management',
      icon: 'medical',
      iconType: 'ionicons',
      color: '#FF9800',
      gradientColors: ['#FFF3E0', '#FFFFFF'],
      lastReading: '3 of 4 taken',
      status: 'Next in 2 hours',
      route: '/(tabs)/log'
    },
    {
      id: '5',
      title: 'Activity Tracking',
      icon: 'walk',
      iconType: 'ionicons',
      color: '#9C27B0',
      gradientColors: ['#F3E5F5', '#FFFFFF'],
      lastReading: '6,847 steps',
      status: '68% of daily goal',
      route: '/(tabs)/log'
    }
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
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
    
    // Simulate refreshing health data
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  const handleCategoryPress = async (category: CategoryCard, categoryId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to specific detail screens based on category
    switch (categoryId) {
      case '1': // Blood Sugar
        router.push('/log/blood-sugar' as any);
        break;
      case '2': // Blood Pressure
        router.push('/log/blood-pressure' as any);
        break;
      case '3': // Weight
        router.push('/log/weight' as any);
        break;
      case '4': // Medication
        router.push('/log/medication' as any);
        break;
      case '5': // Activity
        router.push('/log/activity' as any);
        break;
      default:
        console.log('Unknown category');
    }
  };

  const renderIcon = (category: CategoryCard) => {
    if (category.iconType === 'material') {
      return <MaterialIcons name={category.icon as any} size={32} color={category.color} />;
    }
    return <Ionicons name={category.icon as any} size={32} color={category.color} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#60A5FA' : '#2196F3'}
            colors={[isDarkMode ? '#60A5FA' : '#2196F3']}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={gradients.log as [string, string, ...string[]]}
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
                <Text style={styles.heroGreeting}>Your Health Journey 📊</Text>
                <Text style={styles.heroTitle}>Track & Improve</Text>
              </View>
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>28</Text>
                <Text style={styles.statLabel}>Logs Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>92%</Text>
                <Text style={styles.statLabel}>On Track</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
        {/* Health Metrics Grid */}
        <View style={styles.metricsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Metrics</Text>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                style={[
                  styles.metricCardWrapper,
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
                  style={[styles.metricCard, { backgroundColor: colors.surface }]}
                  onPress={() => handleCategoryPress(category, category.id)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.metricIconWrapper, { backgroundColor: `${category.color}20` }]}>
                    {renderIcon(category)}
                  </View>
                  <Text style={[styles.metricTitle, { color: colors.text }]} numberOfLines={2}>{category.title}</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{category.lastReading}</Text>
                  <View style={styles.metricStatus}>
                    <View style={[styles.statusDot, { backgroundColor: category.color }]} />
                    <Text style={[styles.metricStatusText, { color: colors.textSecondary }]} numberOfLines={1}>{category.status.split('•')[0].trim()}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Insights Card */}
        <View style={styles.insightsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Insights</Text>
          <TouchableOpacity
            style={styles.insightCard}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.9}
          >
            <View style={[styles.insightGradient, { backgroundColor: colors.surface }]}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIconWrapper}>
                  <Ionicons name="trending-up" size={28} color="#4CAF50" />
                </View>
                <View style={styles.insightBadge}>
                  <Text style={styles.insightBadgeText}>Great!</Text>
                </View>
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>You're doing amazing!</Text>
              <Text style={[styles.insightText, { color: colors.textSecondary }]}>Your consistency is 92% this week. Keep up the great work tracking your health metrics.</Text>
              <View style={styles.insightFooter}>
                <Text style={styles.insightLink}>View detailed report</Text>
                <Ionicons name="arrow-forward" size={16} color="#2196F3" />
              </View>
            </View>
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
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Metrics Section
  metricsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCardWrapper: {
    width: (SCREEN_WIDTH - 52) / 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    minHeight: 36,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricStatusText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  // Insights Section
  insightsSection: {
    paddingHorizontal: 20,
  },
  insightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  insightBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
});
