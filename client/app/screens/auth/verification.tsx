import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import SuccessScreen from '../../../component/ui/successscreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: W, height: H } = Dimensions.get('window');

export default function VerificationScreen() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams();
  const displayEmail = typeof email === 'string' ? email : 'your email';
  const [isVerified, setIsVerified] = useState(false);

  const logoBreath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [logoBreath]);
  const Breath = (v: Animated.Value) => ({ transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] });

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];
  const codeStr = useMemo(() => code.join(''), [code]);
  const isValid = codeStr.length === 6 && /^\d{6}$/.test(codeStr);

  const [cooldown, setCooldown] = useState(30);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, '');
    const next = [...code];
    next[idx] = v.slice(-1);
    setCode(next);
    if (v && idx < 5) inputs[idx + 1].current?.focus();
  };

  const handleKey = (idx: number, key: string) => {
    if (key === 'Backspace' && !code[idx] && idx > 0) {
      inputs[idx - 1].current?.focus();
    }
  };

  const resend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    // TODO: trigger resend via backend
  };

  const verify = () => {
    if (!isValid) return;
    // TODO: verify via backend, then show success
    setIsVerified(true);
  };

  const goToProfile = () => {
    router.replace('/screens/auth/profile');
  };

  const goBackToSignup = () => {
    router.replace('/screens/auth/signup/step1');
  };

  // Show success screen after verification
  if (isVerified) {
    return (
      <SuccessScreen
        title="Email Verified!"
        subtitle="Your email has been successfully verified. You can now complete your profile setup."
        buttonText="Continue to Profile"
        onButtonPress={goToProfile}
        showBackButton={true}
        backButtonText="Back to Signup"
        onBackPress={goBackToSignup}
      />
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ExpoLinearGradient
        colors={[ '#2196F3', '#4CAF50' ] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Header with centered logo */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => press(() => router.back())} style={{ position: 'absolute', left: 16, top: insets.top + 16, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={[{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }, Breath(logoBreath)]}>
            <Ionicons name="medical" size={36} color="#4CAF50" />
          </Animated.View>
          <Text className="text-white text-xl font-extrabold mt-4">Verify your email</Text>
          <Text className="text-white/85 text-sm mt-1">We sent a code to {String(displayEmail)}</Text>
        </View>
      </View>

      {/* Code Inputs */}
      <View style={{ marginTop: 28, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {code.map((c, i) => (
            <View key={i} style={{ width: 48, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <TextInput
                ref={inputs[i]}
                value={c}
                onChangeText={(t) => handleChange(i, t)}
                onKeyPress={({ nativeEvent }) => handleKey(i, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                style={{ color: 'white', fontSize: 20, textAlign: 'center', width: '100%' }}
              />
            </View>
          ))}
        </View>
        <Text className="text-white/80 text-xs mt-2">Enter the 6‑digit code</Text>
      </View>

      {/* Actions */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <TouchableOpacity onPress={resend} disabled={cooldown > 0}>
            <Text className={`underline ${cooldown > 0 ? 'text-white/60' : 'text-white'}`}>Resend code{cooldown > 0 ? ` (${cooldown}s)` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => press(() => router.back())}>
            <Text className="text-white underline">Change email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Verify CTA */}
      <View style={{ marginTop: 'auto', paddingHorizontal: 20, paddingBottom: 24 }}>
        <TouchableOpacity disabled={!isValid} onPress={verify} className="rounded-full" style={{ backgroundColor: isValid ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}>
          <Text className="text-center font-bold" style={{ color: isValid ? '#111827' : '#374151' }}>Verify & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


