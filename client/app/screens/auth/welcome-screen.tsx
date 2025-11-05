import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

const { width: W, height: H } = Dimensions.get('window');

export default function WelcomeScreen() {
  const logoBreath = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ])
    ).start();

    const startFloat = (val: Animated.Value, delay: number) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: 1, duration: 2200, useNativeDriver: true }),
            Animated.timing(val, { toValue: 0, duration: 2200, useNativeDriver: true }),
          ])
        ).start();
      }, delay);
    };
    startFloat(float1, 0);
    startFloat(float2, 600);
  }, [logoBreath, float1, float2]);

  const Breath = (v: Animated.Value) => ({ transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] });
  const FloatY = (v: Animated.Value, amp = 10) => ({ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -amp] }) }] });

  const press = async (cb?: () => void) => {
    try { await Haptics.selectionAsync(); } catch {}
    cb && cb();
  };
  const onContinueEmail = () => press(() => router.push('/screens/auth/signup/step1'));
  const onSignin = () => press(() => router.push('/screens/auth/login'));
  const onLearnMore = () => press();

  return (
    <View className="flex-1">
      <StatusBar style="light" />

      {/* Background gradient */}
      <ExpoLinearGradient
        colors={[ '#2196F3', '#4CAF50' ] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Subtle floating medical icons */}
      <Animated.View style={[{ position: 'absolute', top: H * 0.18, left: W * 0.14 }, FloatY(float1, 12)]}>
        <Ionicons name="heart" size={18} color="rgba(255,255,255,0.75)" />
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', top: H * 0.24, right: W * 0.16 }, FloatY(float2, 10)]}>
        <MaterialIcons name="medication" size={16} color="rgba(255,255,255,0.6)" />
      </Animated.View>

      {/* Top: logo & branding */}
      <View style={{ alignItems: 'center', marginTop: H * 0.10 }}>
        {/* Back button to Disclaimer */}
        <TouchableOpacity
          onPress={() => press(() => router.replace('/screens/auth/disclaimer-consent'))}
          style={{ position: 'absolute', left: 20, top: -8, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Animated.View style={[{ width: 84, height: 84, borderRadius: 24, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }, Breath(logoBreath)]}>
          <Ionicons name="medical" size={44} color="#4CAF50" />
        </Animated.View>
        <Text className="text-white text-2xl font-extrabold mt-4">Metabolic Health Assistant</Text>
        <Text className="text-white/90 mt-1">Your Secure Health Companion</Text>
        <View className="flex-row mt-3" style={{ gap: 8 }}>
          <Text className="text-white/90 text-xs">🔒 Secure</Text>
          <Text className="text-white/90 text-xs">🔐 Private</Text>
          <Text className="text-white/90 text-xs">⚕️ HIPAA‑Compliant</Text>
        </View>
      </View>

      {/* Middle: value propositions */}
      <View style={{ marginTop: H * 0.04, paddingHorizontal: 24 }}>
        <Text className="text-white text-xl font-bold text-center">Take Control of Your Health Journey</Text>
        <Text className="text-white/90 text-center mt-1">Track, Monitor, and Improve Your Wellbeing</Text>
        <Text className="text-white/90 text-center mt-1">Join 50,000+ Users Managing Their Health Successfully</Text>

        <View style={{ marginTop: 16, alignItems: 'center' }}>
          {[ { icon: '📊', t: 'Smart Health Tracking • Glucose, BP, Weight' },
             { icon: '🍎', t: 'Personalized Nutrition • Tailored meal plans' },
             { icon: '🎯', t: 'Achievement System • Goals and badges' },
             { icon: '📱', t: 'Always With You • Secure cloud sync' },
          ].map((it, i) => (
            <View key={i} className="flex-row items-center mb-2" style={{ gap: 10, maxWidth: 360, justifyContent: 'center' }}>
              <Text className="text-white text-base">{it.icon}</Text>
              <Text className="text-white/90 text-sm text-center">{it.t}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row justify-center mt-2" style={{ gap: 12 }}>
          <Text className="text-white/90 text-xs">⭐ 4.8/5</Text>
          <Text className="text-white/90 text-xs">Recommended by Healthcare Professionals</Text>
        </View>
      </View>

      {/* Bottom: authentication */}
      <View style={{ marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* Auth primary actions */}
        <TouchableOpacity onPress={() => press(() => router.push('/screens/auth/signup/step1'))} className="rounded-full flex-row items-center justify-center" style={{ backgroundColor: '#2196F3', paddingVertical: 14 }}>
          <Ionicons name="person-add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-center">Create an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => press(() => router.push('/screens/auth/login'))} className="rounded-full flex-row items-center justify-center mt-3" style={{ paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' }}>
          <Ionicons name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-center">Sign In</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center justify-center mt-4 mb-2" style={{ gap: 10 }}>
          <View style={{ height: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <Text className="text-white/80 text-xs">or continue with</Text>
          <View style={{ height: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </View>

        {/* Identity providers */}
        <TouchableOpacity onPress={onContinueEmail} className="rounded-full flex-row items-center justify-center" style={{ backgroundColor: 'white', paddingVertical: 14 }}>
          <MaterialIcons name="email" size={20} color="#1F2937" style={{ marginRight: 8 }} />
          <Text className="text-gray-900 font-bold text-center">Continue with Email</Text>
        </TouchableOpacity>


        {/* Secondary links */}
        <View className="flex-row justify-center mt-3" style={{ gap: 12 }}>
          <TouchableOpacity onPress={onLearnMore}><Text className="text-white/80 underline">Learn More</Text></TouchableOpacity>
        </View>

        <View className="items-center mt-4">
          <Text className="text-white/80 text-xs text-center">Terms • Privacy • Medical Disclaimer • Help Center</Text>
          <Text className="text-white/70 text-xs mt-1 text-center">By continuing, you agree to our Terms and acknowledge our Privacy Policy</Text>
          <Text className="text-white/60 text-xs mt-1">Version 1.0 • Last updated {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );
}


