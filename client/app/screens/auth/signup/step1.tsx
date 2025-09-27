import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: W } = Dimensions.get('window');

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}

export default function SignUpStep1() {
  const logoBreath = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [logoBreath]);
  const Breath = (v: Animated.Value) => ({ transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = getStrength(password);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const pwValid = useMemo(() => password.length >= 8 && strength >= 3, [password, strength]);
  const match = password.length > 0 && password === confirm;
  const canContinue = emailValid && pwValid && match;

  const goNext = () => {
    if (!canContinue) return;
    router.push({ pathname: '/screens/auth/signup/step2', params: { email } });
  };

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
      <View style={{ paddingTop: 56, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => router.replace('/screens/auth/welcome-screen')} style={{ position: 'absolute', left: 16, top: 56, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={[{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }, Breath(logoBreath)]}>
            <Ionicons name="medical" size={36} color="#4CAF50" />
          </Animated.View>
          <Text className="text-white text-lg font-extrabold mt-4">Create your secure account</Text>
          <Text className="text-white/80 text-xs mt-1">Step 1 of 2</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row justify-center mt-4" style={{ gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' }} />
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.5)' }} />
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        {/* Email */}
        <Text className="text-white/90 mb-2">Email address</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="mail" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="rgba(255,255,255,0.6)"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ color: 'white', flex: 1 }}
          />
          {emailValid && <Ionicons name="checkmark-circle" size={18} color="#A7F3D0" />}
        </View>
        <Text className="text-white/70 text-xs mt-1">Use a valid email you can access.</Text>

        {/* Password */}
        <Text className="text-white/90 mb-2 mt-5">Password</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 8 characters, mix letters & numbers"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={!showPw}
            autoCapitalize="none"
            style={{ color: 'white', flex: 1 }}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
        {/* Strength meter */}
        <View style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
          <View style={{ width: (W - 40) * (strength / 4), height: 6, backgroundColor: strength >= 3 ? '#4CAF50' : '#FFC107' }} />
        </View>
        <Text className="text-white/70 text-xs mt-1">Use 8+ chars with letters, numbers, symbols.</Text>

        {/* Confirm */}
        <Text className="text-white/90 mb-2 mt-5">Confirm password</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="shield-checkmark" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
            style={{ color: 'white', flex: 1 }}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
        <Text className="text-white/70 text-xs mt-1">{match || confirm.length === 0 ? ' ' : 'Passwords do not match.'}</Text>

        {/* Continue */}
        <TouchableOpacity disabled={!canContinue} onPress={goNext} className="rounded-full mt-6" style={{ backgroundColor: canContinue ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}>
          <Text className="text-center font-bold" style={{ color: canContinue ? '#111827' : '#374151' }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


