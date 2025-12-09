import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Switch, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import FormInput from '../../../component/ui/FormInput';
import Button from '../../../component/ui/Button';
import { ValidationResult } from '../../../utils/validationUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login, isLoading, isGoogleSignInLoading, googleSignIn } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
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
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValidation, setEmailValidation] = useState<ValidationResult>({ isValid: false });

  // Form is valid when email is valid and password has content
  const canSignIn = emailValidation.isValid && password.length >= 1;

  // Validation handler for email
  const handleEmailValidation = useCallback((result: ValidationResult) => {
    setEmailValidation(result);
  }, []);

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

      showToast({ type: 'error', message: errorMessage });
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
            colors={['#2196F3', '#4CAF50'] as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', inset: 0 as any }}
          />

          {/* Header with centered logo */}
          <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => press(() => router.replace('/screens/auth/welcome-screen'))} style={{ position: 'absolute', left: 16, top: insets.top + 16, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
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
                disabled={isGoogleSignInLoading}
                onPress={async () => {
                  press(async () => {
                    try {
                      // googleSignIn() handles the entire OAuth flow internally
                      // (opens browser, extracts tokens, sets session)
                      await googleSignIn();
                      // If we get here, sign-in was successful - navigate to main app
                      router.replace('/(tabs)');
                    } catch (e: any) {
                      console.error('Google sign-in error:', e);
                      // Map errors to user-friendly messages
                      let errorMessage = 'Please try again.';
                      if (e?.message?.includes('cancelled')) {
                        // User cancelled - handle silently
                        console.log('Google sign-in cancelled by user');
                        return;
                      } else if (e?.message?.includes('network') || e?.message?.includes('fetch')) {
                        errorMessage = 'Network error. Please check your internet connection.';
                      } else if (e?.message?.includes('configuration') || e?.message?.includes('redirect')) {
                        errorMessage = 'Authentication configuration error. Please contact support.';
                      } else if (e?.message?.includes('Missing tokens')) {
                        errorMessage = 'Authentication failed. Please try again.';
                      } else if (e?.message) {
                        errorMessage = e.message;
                      }
                      showToast({ type: 'error', message: errorMessage });
                    }
                  });
                }}
                style={{
                  backgroundColor: isGoogleSignInLoading ? 'rgba(255,255,255,0.7)' : 'white',
                  paddingVertical: 12,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ionicons
                  name={isGoogleSignInLoading ? 'hourglass-outline' : 'logo-google'}
                  size={18}
                  color={isGoogleSignInLoading ? '#666' : '#DB4437'}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: isGoogleSignInLoading ? '#666' : '#111827', fontWeight: '600' }}>
                  {isGoogleSignInLoading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              <View style={{ height: 16 }} />

              {/* Email Input with validation */}
              <FormInput
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon="mail"
                validationType="email"
                onValidationChange={handleEmailValidation}
                validateOnChange={true}
                validateOnBlur={true}
                accessibilityHint="Enter your email address to sign in"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                }}
                inputStyle={{ color: 'white' }}
              />

              {/* Password Input with validation */}
              <FormInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                icon="lock-closed"
                validationType="none"
                accessibilityHint="Enter your password to sign in"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                }}
                inputStyle={{ color: 'white' }}
              />

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

              {/* Sign In button - using accessible Button component */}
              <View style={{ marginTop: 24 }}>
                <Button
                  title={isLoading ? 'Signing In...' : 'Sign In'}
                  onPress={() => press(signIn)}
                  disabled={!canSignIn}
                  loading={isLoading}
                  variant="primary"
                  size="large"
                  fullWidth
                  accessibilityHint="Tap to sign in to your account"
                  style={{
                    backgroundColor: canSignIn ? 'white' : 'rgba(255,255,255,0.4)',
                    borderRadius: 24,
                  }}
                  textStyle={{ color: canSignIn ? '#111827' : '#374151' }}
                />
              </View>



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


