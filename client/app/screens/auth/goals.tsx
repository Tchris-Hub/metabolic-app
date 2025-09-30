import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import SuccessScreen from '../../../component/ui/successscreen';

const { width: W, height: H } = Dimensions.get('window');

const HEALTH_GOALS = [
  {
    id: 'blood_sugar',
    title: 'Better Blood Sugar Control',
    description: 'Manage diabetes and maintain healthy glucose levels',
    icon: 'water',
    color: '#4CAF50',
  },
  {
    id: 'blood_pressure',
    title: 'Lower Blood Pressure',
    description: 'Reduce hypertension and improve cardiovascular health',
    icon: 'heart',
    color: '#F44336',
  },
  {
    id: 'weight_loss',
    title: 'Lose Weight',
    description: 'Achieve and maintain a healthy weight',
    icon: 'fitness',
    color: '#FF9800',
  },
  {
    id: 'weight_maintain',
    title: 'Maintain Weight',
    description: 'Keep current weight and stay healthy',
    icon: 'scale',
    color: '#2196F3',
  },
  {
    id: 'activity',
    title: 'Increase Physical Activity',
    description: 'Build healthy exercise habits and stay active',
    icon: 'walk',
    color: '#9C27B0',
  },
  {
    id: 'medication',
    title: 'Better Medication Adherence',
    description: 'Remember to take medications on time',
    icon: 'medical',
    color: '#607D8B',
  },
  {
    id: 'nutrition',
    title: 'Improve Nutrition',
    description: 'Eat healthier and make better food choices',
    icon: 'nutrition',
    color: '#795548',
  },
  {
    id: 'sleep',
    title: 'Better Sleep',
    description: 'Improve sleep quality and establish routines',
    icon: 'moon',
    color: '#3F51B5',
  },
  {
    id: 'stress',
    title: 'Reduce Stress',
    description: 'Manage stress levels and improve mental health',
    icon: 'leaf',
    color: '#8BC34A',
  },
  {
    id: 'general',
    title: 'General Health Tracking',
    description: 'Just track my health numbers and stay informed',
    icon: 'analytics',
    color: '#00BCD4',
  },
];

export default function GoalsScreen() {
  const logoBreath = useRef(new Animated.Value(0)).current;
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [logoBreath]);

  const Breath = (v: Animated.Value) => ({ 
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] 
  });

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const canContinue = selectedGoals.length > 0;

  const continueToApp = () => {
    if (!canContinue) return;
    // TODO: Save goals to user profile
    setIsCompleted(true);
  };

  const skipGoals = () => {
    // Navigate to main app without goals
    setIsCompleted(true);
  };

  const goToMainApp = () => {
    router.replace('/');
  };

  const goBackToProfile = () => {
    router.replace('/screens/auth/profile');
  };

  // Show success screen after completion
  if (isCompleted) {
    return (
      <SuccessScreen
        title="Setup Complete!"
        subtitle="Your health profile is ready! You can now start tracking your health and achieving your goals."
        buttonText="Start Using App"
        onButtonPress={goToMainApp}
        showBackButton={true}
        backButtonText="Back to Profile"
        onBackPress={goBackToProfile}
      />
    );
  }

  const renderGoals = () => (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
          What are your health goals?
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
          Select all that apply. You can change these anytime in settings.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12, marginBottom: 20 }}>
          {HEALTH_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => press(() => toggleGoal(goal.id))}
                style={{
                  backgroundColor: isSelected ? 'white' : 'rgba(255,255,255,0.15)',
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: isSelected ? goal.color : 'transparent',
                }}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isSelected ? goal.color + '20' : 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons 
                    name={goal.icon as any} 
                    size={24} 
                    color={isSelected ? goal.color : 'rgba(255,255,255,0.9)'} 
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: isSelected ? '#1F2937' : 'white',
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}>
                    {goal.title}
                  </Text>
                  <Text style={{
                    color: isSelected ? '#6B7280' : 'rgba(255,255,255,0.8)',
                    fontSize: 14,
                    lineHeight: 18,
                  }}>
                    {goal.description}
                  </Text>
                </View>
                
                {isSelected && (
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: goal.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Privacy Notice */}
      <View style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="shield-checkmark" size={16} color="#A7F3D0" />
          <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8, fontWeight: '500' }}>
            Personalized Experience
          </Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 16 }}>
          Your goals help us customize meal plans, exercise recommendations, and health tips 
          specifically for you. You can update these anytime.
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ExpoLinearGradient
        colors={['#2196F3', '#4CAF50'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Header */}
      <View style={{ paddingTop: H * 0.06, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={() => press(() => router.replace('/screens/auth/profile'))}
          style={{ position: 'absolute', left: 20, top: H * 0.06, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Animated.View style={[{ 
            width: 72, 
            height: 72, 
            borderRadius: 20, 
            backgroundColor: 'white', 
            alignItems: 'center', 
            justifyContent: 'center', 
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 8,
          }, Breath(logoBreath)]}>
            <Ionicons name="flag" size={36} color="#4CAF50" />
          </Animated.View>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            Set Your Health Goals
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
            This helps us personalize your experience
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {renderGoals()}
      </ScrollView>

      {/* Navigation */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => press(skipGoals)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Skip for Now
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => press(continueToApp)}
            disabled={!canContinue}
            style={{
              flex: 1,
              backgroundColor: canContinue ? 'white' : 'rgba(255,255,255,0.4)',
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: canContinue ? '#1F2937' : 'rgba(255,255,255,0.7)',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              Continue to App
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedGoals.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            {selectedGoals.length} goal{selectedGoals.length > 1 ? 's' : ''} selected
          </Text>
        )}
      </View>
    </View>
  );
}
