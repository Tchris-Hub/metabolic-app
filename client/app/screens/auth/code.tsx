import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: W, height: H } = Dimensions.get('window');

export default function CodeScreen() {
  const { method, contact } = useLocalSearchParams<{ method: string; contact: string }>();
  const logoBreath = useRef(new Animated.Value(0)).current;
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputs = useRef<TextInput[]>(Array(6).fill(null));
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBreath, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(logoBreath, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [logoBreath]);

  const Breath = (v: Animated.Value) => ({ 
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.05] }) }] 
  });

  const press = (fn: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Check if all digits are entered
    if (newCode.every(digit => digit !== '') && !isVerifying) {
      verifyCode();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      // Navigate to reset screen for password update
      router.replace({ pathname: '/screens/auth/reset', params: { method, contact, code: fullCode } });
    }, 2000);
  };

  const resendCode = () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(30);
    // Start cooldown timer
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // TODO: Call API to resend code
    console.log('Resending code...');
  };

  const goBack = () => {
    press(() => router.replace('/screens/auth/forgottenpassword'));
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ExpoLinearGradient
        colors={['#2196F3', '#4CAF50'] as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 as any }}
      />

      {/* Header */}
      <View style={{ paddingTop: H * 0.06, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={goBack}
          style={{ position: 'absolute', left: 20, top: H * 0.06, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Animated.View style={[{ 
            width: 72, 
            height: 72, 
            borderRadius: 20, 
            backgroundColor: 'white', 
            alignItems: 'center', 
            justifyContent: 'center', 
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 8,
          }, Breath(logoBreath)]}>
            <Ionicons name="key" size={36} color="#4CAF50" />
          </Animated.View>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            Enter Verification Code
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }}>
            We sent a 6-digit code to {method === 'email' ? 'your email' : 'your phone'}
          </Text>
          
          <Text style={{ color: '#A7F3D0', fontSize: 14, marginTop: 4, fontWeight: '500' }}>
            {contact}
          </Text>
        </View>
      </View>

      {/* Code Input */}
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <View className="flex-row justify-center" style={{ gap: 12, marginBottom: 32 }}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => { inputs.current[i] = el!; }}
              className="w-12 h-12 bg-white/20 text-white text-xl font-bold text-center rounded-lg"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleCodeChange(val, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              caretHidden={true}
              selectionColor="transparent"
              style={{
                borderWidth: 2,
                borderColor: digit ? '#4CAF50' : 'rgba(255,255,255,0.3)',
                backgroundColor: digit ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </View>

        {/* Resend Code */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <TouchableOpacity onPress={resendCode} disabled={resendCooldown > 0}>
            <Text style={{ 
              color: resendCooldown > 0 ? 'rgba(255,255,255,0.5)' : 'white', 
              fontSize: 16, 
              textDecorationLine: 'underline',
              fontWeight: '500'
            }}>
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="shield-checkmark" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8, fontWeight: '500' }}>
              Secure verification process
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="time" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              Code expires in 15 minutes
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="lock-closed" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              Your account remains secure
            </Text>
          </View>
        </View>
      </View>

      {/* Verify Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={verifyCode}
          disabled={!isCodeComplete || isVerifying}
          style={{
            backgroundColor: isCodeComplete && !isVerifying ? 'white' : 'rgba(255,255,255,0.4)',
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {isVerifying && (
            <Animated.View style={{ marginRight: 8 }}>
              <Ionicons name="refresh" size={20} color="#1F2937" />
            </Animated.View>
          )}
          <Text style={{
            color: isCodeComplete && !isVerifying ? '#1F2937' : 'rgba(255,255,255,0.7)',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
