import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../../contexts/AuthContext';
import * as WebBrowser from 'expo-web-browser';

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
  const { signup, isLoading, googleSignIn } = useAuth();
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

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const pwValid = useMemo(() => password.length >= 8 && strength >= 3, [password, strength]);
  const match = password.length > 0 && password === confirm;
  const canContinue = emailValid && pwValid && match;

  const goNext = async () => {
    if (!canContinue) return;
    try {
      await signup(email, password, email.split('@')[0]);
      
      // Always go to profile setup after signup
      router.replace('/screens/auth/profile');
    } catch (error) {
      console.error('Signup failed:', error);
      
      // Show user-friendly error message
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'Too many signup attempts. Please wait a few minutes and try again.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please log in instead.';
        } else if (error.message.includes('invalid') || error.message.includes('Invalid')) {
          errorMessage = 'Invalid email address. Please check for typos (e.g., use gmail.com not gail.com)';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password must be at least 8 characters with letters, numbers, and symbols.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Signup Failed', errorMessage, [{ text: 'OK' }]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
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
            <TouchableOpacity onPress={() => press(() => router.replace('/screens/auth/welcome-screen'))} style={{ position: 'absolute', left: 16, top: 56, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Animated.View style={[{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }, Breath(logoBreath)]}>
                <Ionicons name="medical" size={36} color="#4CAF50" />
              </Animated.View>
              <Text className="text-white text-lg font-extrabold mt-4">Create your secure account</Text>
            </View>
          </View>

          <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
              {/* OAuth options */}
              <TouchableOpacity
                onPress={async () => {
                  press(async () => {
                    try {
                      const url = await googleSignIn();
                      if (url) {
                        const result = await WebBrowser.openAuthSessionAsync(url, 'client://auth/callback');
                        if (result.type !== 'success') {
                          console.log('Google sign-in cancelled or dismissed', result);
                        }
                      } else {
                        Alert.alert('Google Sign-Up', 'Unable to start Google sign-in flow.');
                      }
                    } catch (e) {
                      console.error(e);
                      Alert.alert('Google Sign-In Failed', 'Please try again.');
                    }
                  });
                }}
                style={{ backgroundColor: 'white', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 8 }} />
                <Text style={{ color: '#111827', fontWeight: '600' }}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={{ height: 16 }} />
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
              <TouchableOpacity 
                disabled={!canContinue || isLoading} 
                onPress={() => press(goNext)} 
                className="rounded-full mt-6" 
                style={{ backgroundColor: canContinue ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}
              >
                <Text className="text-center font-bold" style={{ color: canContinue ? '#111827' : '#374151' }}>
                  {isLoading ? 'Creating Account...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


