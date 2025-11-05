import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { AuthService } from '../../../services/supabase/auth';

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'enter-phone' | 'enter-code'>('enter-phone');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendCode = async () => {
    if (!phone.trim()) {
      Alert.alert('Phone required', 'Enter your phone number including country code, e.g. +15551234567');
      return;
    }
    try {
      setIsSending(true);
      await AuthService.signInWithPhone(phone.trim());
      setStep('enter-code');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Code sent', 'We sent a verification code via SMS. Enter it below.');
    } catch (e: any) {
      Alert.alert('Failed to send code', e?.message || 'Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) return;
    try {
      setIsVerifying(true);
      const res = await AuthService.verifyPhoneOtp(phone.trim(), code.trim());
      // If verification succeeds, Supabase signs the user in and returns a session
      if (res?.session) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Verification', 'Verification succeeded. If you are not redirected, please try signing in.');
      }
    } catch (e: any) {
      Alert.alert('Invalid code', e?.message || 'Please check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ExpoLinearGradient colors={[ '#2196F3', '#4CAF50' ] as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', inset: 0 as any }} />

      <View style={{ paddingTop: 56, paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 56, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }}>
            <Ionicons name="call" size={36} color="#4CAF50" />
          </View>
          <Text style={{ color: 'white', marginTop: 12, fontWeight: '800', fontSize: 18 }}>Phone Verification</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>Sign up or sign in with your phone</Text>
        </View>
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        {step === 'enter-phone' ? (
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>Phone Number</Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="call" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. +15551234567"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                autoCapitalize="none"
                style={{ color: 'white', flex: 1 }}
              />
            </View>

            <TouchableOpacity disabled={!phone.trim() || isSending} onPress={sendCode} style={{ backgroundColor: 'white', paddingVertical: 14, borderRadius: 9999, marginTop: 16, opacity: !phone.trim() || isSending ? 0.7 : 1 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#111827' }}>{isSending ? 'Sending...' : 'Send Code'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>Enter Verification Code</Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="key" size={18} color="rgba(255,255,255,0.9)" style={{ marginRight: 8 }} />
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="6-digit code"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="number-pad"
                autoCapitalize="none"
                style={{ color: 'white', flex: 1, letterSpacing: 4 }}
                maxLength={6}
              />
            </View>

            <TouchableOpacity disabled={!code.trim() || isVerifying} onPress={verifyCode} style={{ backgroundColor: 'white', paddingVertical: 14, borderRadius: 9999, marginTop: 16, opacity: !code.trim() || isVerifying ? 0.7 : 1 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#111827' }}>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('enter-phone')} style={{ alignSelf: 'center', marginTop: 12 }}>
              <Text style={{ color: 'white', textDecorationLine: 'underline' }}>Use a different phone number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
