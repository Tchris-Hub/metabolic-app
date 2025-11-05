import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, Switch, Alert, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../contexts/AuthContext';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const { width: W } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, isLoading, googleSignIn } = useAuth();
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
  const [rememberMe, setRememberMe] = useState(false);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const canSignIn = emailValid && password.length >= 1;

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const signIn = async () => {
    if (!canSignIn) return;
    try {
      await login(email, password);
      // Login successful, navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in. Check your inbox for the confirmation link.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
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
              <Text className="text-white text-lg font-extrabold mt-4">Welcome back</Text>
              <Text className="text-white/80 text-xs mt-1">Sign in to continue</Text>
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
                          // User cancelled or dismissed
                          console.log('Google sign-in cancelled or dismissed', result);
                        }
                      } else {
                        Alert.alert('Google Sign-In', 'Unable to start Google sign-in flow.');
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

        {/* Remember me */}
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#4CAF50' }}
              thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Text className="text-white/90 ml-2 text-sm">Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => press(() => router.push('/screens/auth/forgottenpassword'))}>
            <Text className="text-white underline text-sm">Forgot password?</Text>
          </TouchableOpacity>
        </View>

              {/* Sign In button */}
              <TouchableOpacity 
                disabled={!canSignIn || isLoading} 
                onPress={() => press(signIn)} 
                className="rounded-full mt-6" 
                style={{ backgroundColor: canSignIn ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}
              >
                <Text className="text-center font-bold" style={{ color: canSignIn ? '#111827' : '#374151' }}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>



              {/* Create account link */}
              <View className="flex-row justify-center">
                <Text className="text-white/80 text-sm">Don't have an account? </Text>
                <TouchableOpacity onPress={() => press(() => router.push('/screens/auth/signup/step1'))}>
                  <Text className="text-white underline text-sm font-semibold">Create one</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


