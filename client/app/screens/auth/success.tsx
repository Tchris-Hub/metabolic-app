import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

const { width: W, height: H } = Dimensions.get('window');

export default function PasswordResetSuccessScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showContent, setShowContent] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    // Start content reveal sequence
    const timer1 = setTimeout(() => {
      setShowContent(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);

    const timer2 = setTimeout(() => {
      setShowSecondary(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 3000);

    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    fn();
  };

  const continueToDashboard = () => {
    press(() => {
      // TODO: Navigate to main app dashboard
      router.replace('/');
    });
  };

  const updateSecuritySettings = () => {
    press(() => {
      // TODO: Navigate to security settings
      console.log('Navigate to security settings');
    });
  };

  const contactSupport = () => {
    press(() => {
      // TODO: Navigate to support
      console.log('Navigate to support');
    });
  };

  const SecurityBadge = ({ icon, text, delay = 0 }: { icon: string; text: string; delay?: number }) => {
    const badgeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (showContent) {
        setTimeout(() => {
          Animated.timing(badgeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, delay);
      }
    }, [showContent, delay]);

    return (
      <Animated.View
        style={{
          opacity: badgeAnim,
          transform: [{ translateY: badgeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}
        className="flex-row items-center mb-3"
      >
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, flex: 1 }}>{text}</Text>
      </Animated.View>
    );
  };

  const QuickActionCard = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <Text style={{ color: 'white', fontSize: 14, fontWeight: '500', flex: 1 }}>{title}</Text>
      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      
      {/* Background with security pattern */}
      <ExpoLinearGradient
        colors={['#2196F3', '#4CAF50'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Subtle security pattern overlay */}
      <View style={{ position: 'absolute', inset: 0 as any, opacity: 0.05 }}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: Math.random() * W,
              top: Math.random() * H,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: 'white',
            }}
          />
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
        {/* Lottie Animation */}
        <View style={{ alignItems: 'center', marginTop: H * 0.08, marginBottom: 40 }}>
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LottieView
                source={require('../../../assets/lottie/5sGScOsR0j.json')}
                autoPlay
                loop={true}
                style={{ width: 180, height: 180 }}
              />
            </View>
          </Animated.View>
        </View>

        {/* Success Content */}
        {showContent && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Primary Success Message */}
            <Text
              style={{
                color: 'white',
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 16,
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Password Reset Successfully!
            </Text>

            {/* Security Confirmation */}
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 18,
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Your account is now secure with your new password
            </Text>

            {/* Trust Reinforcement */}
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 32,
              }}
            >
              <View className="flex-row items-center justify-center mb-4">
                <Ionicons name="shield-checkmark" size={20} color="#A7F3D0" />
                <Text style={{ color: '#A7F3D0', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                  Account Secured
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' }}>
                You've been automatically signed in
              </Text>
            </View>

            {/* Security Indicators */}
            <View style={{ marginBottom: 32 }}>
              <SecurityBadge icon="🛡️" text="Password encrypted and stored securely" delay={0} />
              <SecurityBadge icon="📧" text="Security confirmation sent to your email" delay={100} />
              <SecurityBadge icon="🔐" text="All devices logged out for your protection" delay={200} />
              <SecurityBadge icon="⚡" text="Auto-login enabled on this device" delay={300} />
            </View>

            {/* Medical Data Protection Notice */}
            <View
              style={{
                backgroundColor: 'rgba(76,175,80,0.2)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 32,
                borderWidth: 1,
                borderColor: 'rgba(76,175,80,0.3)',
              }}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="medical" size={18} color="#A7F3D0" />
                <Text style={{ color: '#A7F3D0', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                  Health Data Protected
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20 }}>
                Your health information remains encrypted and secure. No health data was affected by this password change.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Secondary Actions */}
        {showSecondary && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            {/* Primary CTA */}
            <TouchableOpacity
              onPress={continueToDashboard}
              style={{
                backgroundColor: 'white',
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                marginBottom: 24,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Text style={{ color: '#4CAF50', fontSize: 18, fontWeight: 'bold' }}>
                Continue to Your Dashboard
              </Text>
            </TouchableOpacity>

            {/* Secondary Actions */}
            <View className="flex-row justify-center mb-6" style={{ gap: 20 }}>
              <TouchableOpacity onPress={updateSecuritySettings}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecorationLine: 'underline' }}>
                  Update Security Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={contactSupport}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecorationLine: 'underline' }}>
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
                Quick Actions:
              </Text>
              <QuickActionCard
                icon="📊"
                title="View Health Dashboard"
                onPress={() => press(() => console.log('View dashboard'))}
              />
              <QuickActionCard
                icon="💊"
                title="Check Medication Reminders"
                onPress={() => press(() => console.log('Check reminders'))}
              />
              <QuickActionCard
                icon="📱"
                title="Set Up Biometric Login"
                onPress={() => press(() => console.log('Setup biometric'))}
              />
              <QuickActionCard
                icon="⚙️"
                title="Review Account Settings"
                onPress={() => press(() => console.log('Review settings'))}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
