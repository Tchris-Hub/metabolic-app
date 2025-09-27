import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width: W } = Dimensions.get('window');

export default function LoginScreen() {
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const canSignIn = emailValid && password.length >= 1;

  const signIn = () => {
    if (!canSignIn) return;
    // TODO: call auth backend, then navigate
    router.replace('/');
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
          <Text className="text-white text-lg font-extrabold mt-4">Welcome back</Text>
          <Text className="text-white/80 text-xs mt-1">Sign in to continue</Text>
        </View>
      </View>

      {/* Form */}
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
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

        <Text className="text-white/90 mb-2 mt-5">Password</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="lock-closed" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={!showPw}
            autoCapitalize="none"
            style={{ color: 'white', flex: 1 }}
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mt-3">
          <TouchableOpacity onPress={() => router.push('/screens/auth/signup/step1')}>
            <Text className="text-white/80 underline">Create account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('./screens/auth/forgot-password')}>
            <Text className="text-white underline">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity disabled={!canSignIn} onPress={signIn} className="rounded-full mt-6" style={{ backgroundColor: canSignIn ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}>
          <Text className="text-center font-bold" style={{ color: canSignIn ? '#111827' : '#374151' }}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


