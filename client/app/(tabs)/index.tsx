import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  Animated,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import modals
import BloodSugarModal from '../../component/modals/BloodSugarModal';
import BloodPressureModal from '../../component/modals/BloodPressureModal';
import WeightModal from '../../component/modals/WeightModal';
import MedicationModal from '../../component/modals/MedicationModal';
import LoadingScreen from '../../component/common/LoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 16px padding + 16px gap

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthScore] = useState(78);
  const [userName] = useState('Sarah');
  const [lastReadings, setLastReadings] = useState({
    bloodSugar: { value: '124 mg/dL', time: '2h ago', status: 'normal' },
    bloodPressure: { value: '120/80', time: 'This morning', status: 'normal' },
    weight: { value: '165 lbs', time: 'Yesterday', status: 'stable' },
    medication: { taken: 3, total: 4, next: 'In 2 hours' }
  });

  // Modal states
  const [bloodSugarModalVisible, setBloodSugarModalVisible] = useState(false);
  const [bloodPressureModalVisible, setBloodPressureModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  
  const breathAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);
  const cardAnimations = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ];
  const tipFloatAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      // Simulate API call or data fetching
      await new Promise(resolve => setTimeout(resolve, 5000));
      setLoading(false);
    };

    loadData();

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
  }, []);

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
    
    // Simulate fetching fresh data
    setTimeout(() => {
      // Update readings with fresh data
      setLastReadings({
        bloodSugar: { value: '118 mg/dL', time: 'Just now', status: 'normal' },
        bloodPressure: { value: '120/80', time: 'Just now', status: 'normal' },
        weight: { value: '165 lbs', time: 'Just now', status: 'stable' },
        medication: { taken: 3, total: 4, next: 'In 2 hours' }
      });
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  // Modal save handlers
  const handleBloodSugarSave = (data: any) => {
    console.log('Blood Sugar saved:', data);
    // Update last readings
    setLastReadings(prev => ({
      ...prev,
      bloodSugar: {
        value: `${data.value} mg/dL`,
        time: 'Just now',
        status: 'normal'
      }
    }));
    // TODO: Save to database
  };

  const handleBloodPressureSave = (data: any) => {
    console.log('Blood Pressure saved:', data);
    setLastReadings(prev => ({
      ...prev,
      bloodPressure: {
        value: `${data.systolic}/${data.diastolic}`,
        time: 'Just now',
        status: 'normal'
      }
    }));
    // TODO: Save to database
  };

  const handleWeightSave = (data: any) => {
    console.log('Weight saved:', data);
    setLastReadings(prev => ({
      ...prev,
      weight: {
        value: `${data.weight} ${data.unit}`,
        time: 'Just now',
        status: 'stable'
      }
    }));
    // TODO: Save to database
  };

  const handleMedicationSave = (data: any) => {
    console.log('Medication saved:', data);
    setLastReadings(prev => ({
      ...prev,
      medication: {
        ...prev.medication,
        taken: prev.medication.taken + data.medications.length,
        next: 'In 8 hours'
      }
    }));
    // TODO: Save to database
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return <LoadingScreen message="Loading your health data..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#E3F2FD', '#FFFFFF']}
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
        {/* Quick Log Section */}
        <View style={styles.quickLogSection}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          
          <View style={styles.quickLogGrid}>
            {/* Blood Sugar Card */}
            <Animated.View
              style={{
                transform: [{ scale: cardAnimations[0] }],
                opacity: cardAnimations[0]
              }}
            >
              <TouchableOpacity 
                style={[styles.quickLogCard, { borderColor: 'rgba(233, 30, 99, 0.1)' }]}
                onPress={() => handleQuickLog('bloodSugar')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FCE4EC', '#FFFFFF']}
                  style={styles.cardGradient}
                >
                  <Ionicons name="water" size={48} color="#E91E63" />
                  <Text style={styles.cardLabel}>Blood Sugar</Text>
                  <Text style={styles.cardReading}>{lastReadings.bloodSugar.value}</Text>
                  <Text style={styles.cardTime}>{lastReadings.bloodSugar.time}</Text>
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
                </LinearGradient>
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
                style={[styles.quickLogCard, { borderColor: 'rgba(33, 150, 243, 0.1)' }]}
                onPress={() => handleQuickLog('bloodPressure')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E3F2FD', '#FFFFFF']}
                  style={styles.cardGradient}
                >
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
                  <Text style={styles.cardLabel}>Blood Pressure</Text>
                  <Text style={styles.cardReading}>{lastReadings.bloodPressure.value}</Text>
                  <Text style={styles.cardTime}>{lastReadings.bloodPressure.time}</Text>
                  <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                </LinearGradient>
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
                style={[styles.quickLogCard, { borderColor: 'rgba(76, 175, 80, 0.1)' }]}
                onPress={() => handleQuickLog('weight')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E8F5E8', '#FFFFFF']}
                  style={styles.cardGradient}
                >
                  <MaterialIcons name="monitor-weight" size={48} color="#4CAF50" />
                  <Text style={styles.cardLabel}>Weight</Text>
                  <Text style={styles.cardReading}>{lastReadings.weight.value}</Text>
                  <Text style={styles.cardTime}>{lastReadings.weight.time}</Text>
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
                </LinearGradient>
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
                style={[styles.quickLogCard, { borderColor: 'rgba(255, 152, 0, 0.1)' }]}
                onPress={() => handleQuickLog('medication')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FFF3E0', '#FFFFFF']}
                  style={styles.cardGradient}
                >
                  <Ionicons name="medical" size={48} color="#FF9800" />
                  <Text style={styles.cardLabel}>Medication</Text>
                  <Text style={styles.cardReading}>
                    {lastReadings.medication.taken} of {lastReadings.medication.total} taken
                  </Text>
                  <Text style={styles.cardTime}>Next: {lastReadings.medication.next}</Text>
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
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Today's Summary Card */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Today's Progress</Text>
              <Text style={styles.summaryProgress}>2 of 4 checks completed</Text>
            </View>
            
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '50%']
                    })
                  }
                ]} 
              />
            </View>
            
            <View style={styles.checksRow}>
              <View style={[styles.checkItem, styles.checkCompleted]}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.checkLabel}>Blood Sugar</Text>
              </View>
              <View style={[styles.checkItem, styles.checkCompleted]}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.checkLabel}>BP</Text>
              </View>
              <View style={[styles.checkItem, styles.checkPending]}>
                <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                <Text style={styles.checkLabel}>Weight</Text>
              </View>
              <View style={[styles.checkItem, styles.checkPending]}>
                <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
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
                <Text style={styles.tipHeadline}>Morning Protein Power</Text>
                <Text style={styles.tipText}>
                  Eat protein at breakfast to stabilize blood sugar throughout the morning. 
                  Aim for 20-30g from eggs, Greek yogurt, or nuts.
                </Text>
                <Text style={styles.tipSource}>Based on ADA guidelines</Text>
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
});
