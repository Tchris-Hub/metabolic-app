import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  Animated,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../contexts/AuthContext';
import { HealthReadingsRepository } from '../../services/supabase/repositories/HealthReadingsRepository';
import { UserProfileRepository } from '../../services/supabase/repositories/UserProfileRepository';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getRandomRecipesOnline } from '../../store/slices/mealSlice';
import { router } from 'expo-router';
import { lowCarbRecipes } from '../../data/recipes/lowCarbRecipes';

// Import modals
import BloodSugarModal from '../../component/modals/BloodSugarModal';
import BloodPressureModal from '../../component/modals/BloodPressureModal';
import WeightModal from '../../component/modals/WeightModal';
import MedicationModal from '../../component/modals/MedicationModal';
import { MedicationRepository, MedicationRecord } from '../../services/supabase/repositories/MedicationRepository';
import LoadingScreen from '../../component/common/LoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 16px padding + 16px gap

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDarkMode, colors, gradients } = useTheme();
  const dispatch = useDispatch();
  const { onlineRecipes, apiLoading } = useSelector((state: RootState) => state.meal);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [healthStats, setHealthStats] = useState({
    totalReadings: 0,
    thisWeekReadings: 0,
    bloodSugarInRange: 0,
  });
  const [personalizedTip, setPersonalizedTip] = useState('');
  const [lastReadings, setLastReadings] = useState({
    bloodSugar: { value: '--', time: 'No data', status: 'normal' },
    bloodPressure: { value: '--', time: 'No data', status: 'normal' },
    weight: { value: '--', time: 'No data', status: 'stable' },
    medication: { taken: 0, total: 0, next: 'No data' }
  });

  // Modal states
  const [bloodSugarModalVisible, setBloodSugarModalVisible] = useState(false);
  const [bloodPressureModalVisible, setBloodPressureModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [medications, setMedications] = useState<MedicationRecord[]>([]);
  
  const breathAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const tipFloatAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
    loadMealRecommendations();
  }, [user]);

  useEffect(() => {
    // Start animations after component mounts
    startAnimations();
  }, []);

  useEffect(() => {
    console.log('🍽️ Online recipes updated:', onlineRecipes.length);
    console.log('📊 API Loading:', apiLoading);
  }, [onlineRecipes, apiLoading]);

  const loadMealRecommendations = async () => {
    try {
      console.log('📱 Loading meal recommendations...');
      console.log('Local recipes available:', lowCarbRecipes.length);
      // Fetch 6 random healthy recipes for the home screen
      await dispatch(getRandomRecipesOnline({ 
        count: 6, 
        tags: ['healthy'] 
      }) as any);
      console.log('✅ Meal recommendations loaded');
    } catch (error) {
      console.error('❌ Failed to load meal recommendations:', error);
    }
  };

  const loadUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Set username from user email
      setUserName(user.email?.split('@')[0] || 'User');

      // Try to load user profile (optional)
      try {
        const profile = await UserProfileRepository.getProfileByUserId(user.id);
        if (profile?.display_name) {
          setUserName(profile.display_name);
        }
      } catch (profileError) {
        console.warn('Profile loading failed (non-critical):', profileError);
      }

      // Load health stats
      try {
        const stats = await HealthReadingsRepository.getHealthStats(user.id);
        setHealthStats(stats);
        
        // Calculate health score
        const score = calculateHealthScore(stats);
        setHealthScore(score);
        
        // Update last readings display
        updateLastReadingsDisplay(stats);
      } catch (statsError) {
        console.warn('Health stats loading failed (non-critical):', statsError);
      }

      // Load medications
      try {
        const meds = await MedicationRepository.getMedications(user.id);
        setMedications(meds);
      } catch (medsError) {
        console.warn('Medications loading failed (non-critical):', medsError);
      }

      // Load personalized tip
      try {
        const recommendations = await UserProfileRepository.getPersonalizedRecommendations(user.id);
        if (recommendations?.length > 0) {
          setPersonalizedTip(recommendations[0]);
        }
      } catch (tipError) {
        console.warn('Recommendations loading failed (non-critical):', tipError);
      }

      setLoading(false);
    } catch (error) {
      console.error('Critical error loading user data:', error);
      setLoading(false);
    }
  };

  const calculateHealthScore = (stats: any): number => {
    let score = 50; // Base score

    // Add points for tracking consistency
    if (stats.thisWeekReadings >= 7) score += 20;
    else if (stats.thisWeekReadings >= 3) score += 10;

    // Add points for blood sugar in range
    if (stats.bloodSugarInRange >= 80) score += 20;
    else if (stats.bloodSugarInRange >= 60) score += 10;

    // Add points for having recent readings
    if (stats.lastBloodSugar) score += 5;
    if (stats.lastWeight) score += 5;

    return Math.min(100, score);
  };

  const updateLastReadingsDisplay = (stats: any) => {
    const updated: any = { ...lastReadings };

    if (stats.lastBloodSugar) {
      updated.bloodSugar = {
        value: `${stats.lastBloodSugar} mg/dL`,
        time: 'Recent',
        status: stats.lastBloodSugar >= 70 && stats.lastBloodSugar <= 140 ? 'normal' : 'warning',
      };
    }

    if (stats.lastBloodPressure) {
      updated.bloodPressure = {
        value: `${stats.lastBloodPressure.systolic}/${stats.lastBloodPressure.diastolic}`,
        time: 'Recent',
        status: 'normal',
      };
    }

    if (stats.lastWeight) {
      updated.weight = {
        value: `${stats.lastWeight} kg`,
        time: 'Recent',
        status: 'stable',
      };
    }

    setLastReadings(updated);
  };

  const startAnimations = () => {

    // Breathing animation for health score
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Staggered entrance animations
    const entranceSequence = Animated.sequence([
      // Header fade in and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true })
      ]),
      
      // Cards animate in with stagger
      Animated.stagger(150, cardAnimations.map(anim => 
        Animated.spring(anim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true })
      )),
      
      // Progress bar animation
      Animated.timing(progressAnim, { toValue: 1, duration: 1000, useNativeDriver: false })
    ]);

    entranceSequence.start();

    // Floating animation for tip icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(tipFloatAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(tipFloatAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Hello';
  };

  const getDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 75) return '#4CAF50';
    if (score >= 50) return '#FFC107';
    return '#F44336';
  };

  // Weekly progress computed from this week's readings against a 7-day target
  const weeklyTarget = 7;
  const weeklyProgressPercent = Math.min(100, Math.round((healthStats.thisWeekReadings / weeklyTarget) * 100));

  const handleQuickLog = async (type: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Card press animation
    const cardIndex = ['bloodSugar', 'bloodPressure', 'weight', 'medication'].indexOf(type);
    if (cardIndex !== -1) {
      Animated.sequence([
        Animated.timing(cardAnimations[cardIndex], { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.spring(cardAnimations[cardIndex], { toValue: 1, tension: 300, friction: 10, useNativeDriver: true })
      ]).start();
    }
    
    // Open appropriate modal
    switch (type) {
      case 'bloodSugar':
        setBloodSugarModalVisible(true);
        break;
      case 'bloodPressure':
        setBloodPressureModalVisible(true);
        break;
      case 'weight':
        setWeightModalVisible(true);
        break;
      case 'medication':
        setMedicationModalVisible(true);
        break;
    }
  };

  const handleProfilePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Profile pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true })
    ]).start();
  };

  const handleHealthScorePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Health score celebration animation
    Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.spring(breathAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true })
    ]).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    await loadUserData();
    
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Modal save handlers
  const handleBloodSugarSave = async (data: any) => {
    if (!user) return;

    try {
      await HealthReadingsRepository.saveBloodSugarReading({
        user_id: user.id,
        value: parseFloat(data.value),
        unit: data.unit || 'mg/dL',
        meal_context: data.mealContext,
        notes: data.notes,
      });

      // Update UI
      setLastReadings(prev => ({
        ...prev,
        bloodSugar: {
          value: `${data.value} ${data.unit || 'mg/dL'}`,
          time: 'Just now',
          status: 'normal'
        }
      }));

      // Refresh stats
      await loadUserData();
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to save blood sugar:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBloodPressureSave = async (data: any) => {
    if (!user) return;

    try {
      await HealthReadingsRepository.saveBloodPressureReading({
        user_id: user.id,
        systolic: parseInt(data.systolic),
        diastolic: parseInt(data.diastolic),
        heart_rate: data.heartRate ? parseInt(data.heartRate) : undefined,
        notes: data.notes,
      });

      setLastReadings(prev => ({
        ...prev,
        bloodPressure: {
          value: `${data.systolic}/${data.diastolic}`,
          time: 'Just now',
          status: 'normal'
        }
      }));

      await loadUserData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to save blood pressure:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleWeightSave = async (data: any) => {
    if (!user) return;

    try {
      await HealthReadingsRepository.saveWeightReading({
        user_id: user.id,
        weight: parseFloat(data.weight),
        unit: data.unit || 'kg',
        body_fat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
        notes: data.notes,
      });

      setLastReadings(prev => ({
        ...prev,
        weight: {
          value: `${data.weight} ${data.unit}`,
          time: 'Just now',
          status: 'stable'
        }
      }));

      await loadUserData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to save weight:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleMedicationSave = async (data: {
    medications: { id: string; taken: boolean; time: Date }[];
    time: Date;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      await HealthReadingsRepository.saveMedicationLog(user.id, data.medications, data.notes);

      setLastReadings(prev => ({
        ...prev,
        medication: {
          ...prev.medication,
          taken: prev.medication.taken + data.medications.length,
          next: 'In 8 hours'
        }
      }));

      await loadUserData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to save medication:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return <LoadingScreen message="Loading your health data..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header Section */}
      <LinearGradient
        colors={gradients.home as [string, string, ...string[]]}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* User Profile */}
          <TouchableOpacity 
            style={styles.profileContainer}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={[
                styles.profileImage,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Ionicons name="person" size={24} color="#2196F3" />
            </Animated.View>
            <Animated.View 
              style={[
                styles.onlineIndicator,
                {
                  transform: [{
                    scale: breathAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2]
                    })
                  }]
                }
              ]}
            />
          </TouchableOpacity>

          {/* Greeting & Date */}
          <Animated.View 
            style={[
              styles.greetingContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
            <Text style={styles.date}>{getDate()}</Text>
          </Animated.View>

          {/* Health Score Badge */}
          <TouchableOpacity 
            style={styles.healthScoreContainer}
            onPress={handleHealthScorePress}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={[
                styles.healthScoreBadge,
                {
                  transform: [{
                    scale: breathAnim.interpolate({
                      inputRange: [0, 1, 1.2],
                      outputRange: [1, 1.05, 1.15]
                    })
                  }]
                }
              ]}
            >
              <Text style={[styles.healthScoreText, { color: getHealthScoreColor(healthScore) }]}>
                {healthScore}
              </Text>
              <Text style={styles.healthScoreLabel}>Score</Text>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={[styles.promoBanner, { backgroundColor: colors.surface }]}>
          <View style={styles.promoLeft}>
            <Text style={[styles.promoHeadline, { color: colors.text }]}>Get 30% OFF on Swimwear!</Text>
            <Text style={[styles.promoSubheadline, { color: colors.textSecondary }]}>Limited time offer. Shop now!</Text>
            <TouchableOpacity
              onPress={() => router.push('/meal')}
              activeOpacity={0.85}
              style={[styles.promoButton, { backgroundColor: colors.warning }]}
            >
              <MaterialIcons name="local-offer" size={18} color={isDarkMode ? '#0F172A' : '#1F2937'} style={{ marginRight: 8 }} />
              <Text style={[styles.promoButtonText, { color: isDarkMode ? '#0F172A' : '#1F2937' }]}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&auto=format&fit=crop&q=60' }}
            style={styles.promoRightImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.promoDotsContainer}>
          <View style={[styles.promoDot, { backgroundColor: colors.border }]} />
          <View style={[styles.promoDotActive, { backgroundColor: colors.info }]} />
          <View style={[styles.promoDot, { backgroundColor: colors.border }]} />
        </View>

        {/* Quick Log Section */}
        <View style={styles.quickLogSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Log</Text>
          
          <View style={styles.quickLogGrid}>
            {/* Blood Sugar Card */}
            <Animated.View
              style={{
                transform: [{ scale: cardAnimations[0] }],
                opacity: cardAnimations[0]
              }}
            >
              <TouchableOpacity 
                style={[styles.quickLogCard, { borderColor: isDarkMode ? colors.border : 'rgba(233, 30, 99, 0.1)', backgroundColor: colors.surface }]}
                onPress={() => handleQuickLog('bloodSugar')}
                activeOpacity={0.8}
              >
                <View style={styles.cardGradient}>
                  <Ionicons name="water" size={48} color="#E91E63" />
                  <Text style={[styles.cardLabel, { color: colors.text }]}>Blood Sugar</Text>
                  <Text style={[styles.cardReading, { color: colors.text }]}>{lastReadings.bloodSugar.value}</Text>
                  <Text style={[styles.cardTime, { color: colors.textSecondary }]}>{lastReadings.bloodSugar.time}</Text>
                  <Animated.View 
                    style={[
                      styles.statusDot, 
                      { 
                        backgroundColor: '#4CAF50',
                        transform: [{
                          scale: breathAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.3]
                          })
                        }]
                      }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Blood Pressure Card */}
            <Animated.View
              style={{
                transform: [{ scale: cardAnimations[1] }],
                opacity: cardAnimations[1]
              }}
            >
              <TouchableOpacity 
                style={[styles.quickLogCard, { borderColor: isDarkMode ? colors.border : 'rgba(33, 150, 243, 0.1)', backgroundColor: colors.surface }]}
                onPress={() => handleQuickLog('bloodPressure')}
                activeOpacity={0.8}
              >
                <View style={styles.cardGradient}>
                  <Animated.View
                    style={{
                      transform: [{
                        scale: breathAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.1]
                        })
                      }]
                    }}
                  >
                    <Ionicons name="heart" size={48} color="#2196F3" />
                  </Animated.View>
                  <Text style={[styles.cardLabel, { color: colors.text }]}>Blood Pressure</Text>
                  <Text style={[styles.cardReading, { color: colors.text }]}>{lastReadings.bloodPressure.value}</Text>
                  <Text style={[styles.cardTime, { color: colors.textSecondary }]}>{lastReadings.bloodPressure.time}</Text>
                  <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Weight Card */}
            <Animated.View
              style={{
                transform: [{ scale: cardAnimations[2] }],
                opacity: cardAnimations[2]
              }}
            >
              <TouchableOpacity 
                style={[styles.quickLogCard, { borderColor: isDarkMode ? colors.border : 'rgba(76, 175, 80, 0.1)', backgroundColor: colors.surface }]}
                onPress={() => handleQuickLog('weight')}
                activeOpacity={0.8}
              >
                <View style={styles.cardGradient}>
                  <MaterialIcons name="monitor-weight" size={48} color="#4CAF50" />
                  <Text style={[styles.cardLabel, { color: colors.text }]}>Weight</Text>
                  <Text style={[styles.cardReading, { color: colors.text }]}>{lastReadings.weight.value}</Text>
                  <Text style={[styles.cardTime, { color: colors.textSecondary }]}>{lastReadings.weight.time}</Text>
                  <Animated.View 
                    style={[
                      styles.trendIcon,
                      {
                        transform: [{
                          translateY: tipFloatAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -3]
                          })
                        }]
                      }
                    ]}
                  >
                    <Ionicons name="trending-up" size={16} color="#4CAF50" />
                  </Animated.View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Medication Card */}
            <Animated.View
              style={{
                transform: [{ scale: cardAnimations[3] }],
                opacity: cardAnimations[3]
              }}
            >
              <TouchableOpacity 
                style={[styles.quickLogCard, { borderColor: isDarkMode ? colors.border : 'rgba(255, 152, 0, 0.1)', backgroundColor: colors.surface }]}
                onPress={() => handleQuickLog('medication')}
                activeOpacity={0.8}
              >
                <View style={styles.cardGradient}>
                  <Ionicons name="medical" size={48} color="#FF9800" />
                  <Text style={[styles.cardLabel, { color: colors.text }]}>Medication</Text>
                  <Text style={[styles.cardReading, { color: colors.text }]}>
                    {lastReadings.medication.taken} of {lastReadings.medication.total} taken
                  </Text>
                  <Text style={[styles.cardTime, { color: colors.textSecondary }]}>Next: {lastReadings.medication.next}</Text>
                  {lastReadings.medication.taken < lastReadings.medication.total && (
                    <Animated.View 
                      style={[
                        styles.alertBadge,
                        {
                          transform: [{
                            scale: breathAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.2]
                            })
                          }]
                        }
                      ]}
                    >
                      <Text style={styles.alertText}>!</Text>
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Today's Summary Card */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryHeader}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>This Week's Progress</Text>
              <Text style={[styles.summaryProgress, { color: colors.textSecondary }]}>{healthStats.thisWeekReadings} readings logged</Text>
            </View>
            
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${weeklyProgressPercent}%`]
                    })
                  }
                ]} 
              />
            </View>
            
            <View style={styles.checksRow}>
              {/* Blood Sugar completion based on existence of last reading */}
              <View style={[styles.checkItem, lastReadings.bloodSugar.value !== '--' ? styles.checkCompleted : styles.checkPending]}>
                {lastReadings.bloodSugar.value !== '--' ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                )}
                <Text style={styles.checkLabel}>Blood Sugar</Text>
              </View>

              {/* BP completion based on existence of last reading */}
              <View style={[styles.checkItem, lastReadings.bloodPressure.value !== '--' ? styles.checkCompleted : styles.checkPending]}>
                {lastReadings.bloodPressure.value !== '--' ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                )}
                <Text style={styles.checkLabel}>BP</Text>
              </View>

              {/* Weight completion based on existence of last reading */}
              <View style={[styles.checkItem, lastReadings.weight.value !== '--' ? styles.checkCompleted : styles.checkPending]}>
                {lastReadings.weight.value !== '--' ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                )}
                <Text style={styles.checkLabel}>Weight</Text>
              </View>

              {/* Meds completion based on taken vs total */}
              <View style={[styles.checkItem, lastReadings.medication.taken > 0 ? styles.checkCompleted : styles.checkPending]}>
                {lastReadings.medication.taken > 0 ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                )}
                <Text style={styles.checkLabel}>Meds</Text>
              </View>
            </View>
            
            <Text style={styles.motivationalText}>Great start! Keep it up.</Text>
          </View>
        </View>

        {/* Daily Health Tip */}
        <View style={styles.tipSection}>
          <Animated.View 
            style={[
              styles.tipCard,
              {
                transform: [{
                  translateY: tipFloatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5]
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['#E3F2FD', '#FFFFFF']}
              style={styles.tipGradient}
            >
              <Animated.View 
                style={[
                  styles.tipIcon,
                  {
                    transform: [{
                      rotate: tipFloatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '5deg']
                      })
                    }]
                  }
                ]}
              >
                <Ionicons name="bulb" size={64} color="#2196F3" />
              </Animated.View>
              <View style={styles.tipContent}>
                <Animated.View 
                  style={[
                    styles.tipBadge,
                    {
                      transform: [{
                        scale: breathAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.05]
                        })
                      }]
                    }
                  ]}
                >
                  <Text style={styles.tipBadgeText}>Nutrition Tip</Text>
                </Animated.View>
                <Text style={styles.tipHeadline}>Health Tip for You</Text>
                <Text style={styles.tipText}>
                  {personalizedTip || 'Eat protein at breakfast to stabilize blood sugar throughout the morning. Aim for 20-30g from eggs, Greek yogurt, or nuts.'}
                </Text>
                <Text style={styles.tipSource}>Personalized for your health goals</Text>
                <View style={styles.tipActions}>
                  <TouchableOpacity 
                    style={styles.tipButton}
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.tipButtonText}>Learn More</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.tipButton}
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.tipButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Meal Recommendations - API Driven with Local Fallback */}
        <View style={styles.mealSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Meals</Text>
            <TouchableOpacity 
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/meal');
              }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {(onlineRecipes.length > 0 ? onlineRecipes : lowCarbRecipes).slice(0, 6).map((recipe: any, index) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.mealCard}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/(tabs)/meal`);
                  }}
                  activeOpacity={0.9}
                >
                  {(recipe.image || recipe.imageUrl) ? (
                    <Image 
                      source={{ uri: recipe.image || recipe.imageUrl }}
                      style={styles.mealImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.mealImage, { backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' }]}>
                      <Ionicons name="restaurant" size={40} color="#999" />
                    </View>
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.mealGradient}
                  >
                    <Text style={styles.mealTitle} numberOfLines={2}>
                      {recipe.title || recipe.name}
                    </Text>
                    <View style={styles.mealMeta}>
                      {recipe.readyInMinutes && (
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={14} color="#FFF" />
                          <Text style={styles.metaText}>{recipe.readyInMinutes}m</Text>
                        </View>
                      )}
                      {recipe.healthScore && (
                        <View style={styles.metaItem}>
                          <Ionicons name="heart-outline" size={14} color="#FFF" />
                          <Text style={styles.metaText}>{recipe.healthScore}</Text>
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>

        {apiLoading && onlineRecipes.length === 0 && (
          <View style={styles.mealSection}>
            <Text style={styles.sectionTitle}>Loading Meal Recommendations...</Text>
            <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals */}
      <BloodSugarModal
        visible={bloodSugarModalVisible}
        onClose={() => setBloodSugarModalVisible(false)}
        onSave={handleBloodSugarSave}
      />

      <BloodPressureModal
        visible={bloodPressureModalVisible}
        onClose={() => setBloodPressureModalVisible(false)}
        onSave={handleBloodPressureSave}
      />

      <WeightModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        onSave={handleWeightSave}
      />

      <MedicationModal
        visible={medicationModalVisible}
        onClose={() => setMedicationModalVisible(false)}
        medications={medications}
        onSave={handleMedicationSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  healthScoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthScoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  // Promotional Banner Styles
  promoBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  promoLeft: {
    flex: 1,
    paddingRight: 12,
  },
  promoHeadline: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  promoSubheadline: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  promoRightImage: {
    width: 120,
    height: 90,
  },
  promoDotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 8,
  },
  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  promoDotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
  },

  // Quick Log Section
  quickLogSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickLogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickLogCard: {
    width: CARD_WIDTH,
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  cardReading: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center',
  },
  cardTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  statusDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  alertBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  // Summary Section
  summarySection: {
    padding: 16,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryHeader: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryProgress: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  checksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkItem: {
    alignItems: 'center',
    flex: 1,
  },
  checkCompleted: {
    opacity: 1,
  },
  checkPending: {
    opacity: 0.5,
  },
  checkLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Tip Section
  tipSection: {
    padding: 16,
    paddingTop: 0,
  },
  tipCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tipGradient: {
    flexDirection: 'row',
    padding: 20,
  },
  tipIcon: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tipBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  tipHeadline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  tipSource: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  tipActions: {
    flexDirection: 'row',
    gap: 12,
  },
  tipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  tipButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  // Meal Section Styles
  mealSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  mealCard: {
    width: 180,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    justifyContent: 'flex-end',
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
