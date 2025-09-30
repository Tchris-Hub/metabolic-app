import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

const { width: W, height: H } = Dimensions.get('window');

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonPress: () => void;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackPress?: () => void;
}

export default function SuccessScreen({
  title,
  subtitle,
  buttonText,
  onButtonPress,
  showBackButton = false,
  backButtonText = "Back",
  onBackPress
}: SuccessScreenProps) {
  const logoBreath = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Breathing animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    
    // Slide up animation
    Animated.timing(slideUp, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  }, [logoBreath, fadeIn, slideUp]);

  const Breath = (v: Animated.Value) => ({ 
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] 
  });

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ExpoLinearGradient
        colors={['#4CAF50', '#2E7D32'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={() => press(onBackPress || (() => router.back()))}
          style={{ position: 'absolute', left: 20, top: H * 0.06, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* Lottie Animation */}
        <Animated.View style={[{ 
          marginBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        }, Breath(logoBreath)]}>
          <LottieView
            source={require('../../assets/lottie/5sGScOsR0j.json')}
            autoPlay
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        </Animated.View>

        {/* Success Content */}
        <Animated.View style={[
          { 
            alignItems: 'center',
            opacity: fadeIn,
            transform: [{ translateY: slideUp }]
          }
        ]}>
          <Text style={{ 
            color: 'white', 
            fontSize: 32, 
            fontWeight: '800', 
            textAlign: 'center',
            marginBottom: 16,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            {title}
          </Text>
          
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: 18, 
            textAlign: 'center',
            lineHeight: 26,
            marginBottom: 40,
            textShadowColor: 'rgba(0,0,0,0.2)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}>
            {subtitle}
          </Text>

          {/* Security Confirmation */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: 20,
            marginBottom: 40,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
              </View>
              <Text style={{ color: '#A7F3D0', fontSize: 16, fontWeight: '700' }}>
                Secure & Verified
              </Text>
            </View>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: 14, 
              textAlign: 'center',
              lineHeight: 20 
            }}>
              Your information is secure and your account is ready to use
            </Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            onPress={() => press(onButtonPress)}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 40,
              paddingVertical: 18,
              borderRadius: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              minWidth: 200,
            }}
          >
            <Text style={{ 
              color: '#1F2937', 
              fontSize: 18, 
              fontWeight: 'bold', 
              textAlign: 'center' 
            }}>
              {buttonText}
            </Text>
          </TouchableOpacity>

          {/* Secondary Action */}
          {showBackButton && (
            <TouchableOpacity
              onPress={() => press(onBackPress || (() => router.back()))}
              style={{
                marginTop: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
            >
              <Text style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: 16, 
                textAlign: 'center',
                textDecorationLine: 'underline'
              }}>
                {backButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

