 import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AuthService } from '../../../services/supabase/auth';

const { width: W, height: H } = Dimensions.get('window');

export default function EmailConfirmationScreen() {
  const { email } = useLocalSearchParams();
  const displayEmail = typeof email === 'string' ? email : '';
  const [isResending, setIsResending] = useState(false);

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const resendEmail = async () => {
    if (!displayEmail) {
      Alert.alert('Error', 'Email address not found');
      return;
    }

    try {
      setIsResending(true);
      await AuthService.resendConfirmationEmail(displayEmail);
      Alert.alert('Success', 'Confirmation email sent! Please check your inbox.');
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const goToLogin = () => {
    router.replace('/screens/auth/login');
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ExpoLinearGradient
        colors={['#2196F3', '#4CAF50'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {/* Email Icon */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <Ionicons name="mail-outline" size={60} color="white" />
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Check Your Email
        </Text>

        {/* Message */}
        <Text
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: 8,
            lineHeight: 24,
          }}
        >
          We've sent a confirmation link to:
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {displayEmail}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 22,
            paddingHorizontal: 20,
          }}
        >
          Click the link in the email to verify your account. After verification, you can log in and start using the app.
        </Text>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={() => press(resendEmail)}
          disabled={isResending}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 25,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Text>
        </TouchableOpacity>

        {/* Go to Login */}
        <TouchableOpacity
          onPress={() => press(goToLogin)}
          style={{
            backgroundColor: 'white',
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              color: '#1F2937',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Go to Login
          </Text>
        </TouchableOpacity>

        {/* Help Text */}
        <Text
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            marginTop: 40,
            lineHeight: 18,
          }}
        >
          Didn't receive the email? Check your spam folder or click "Resend Email"
        </Text>
      </View>
    </View>
  );
}
