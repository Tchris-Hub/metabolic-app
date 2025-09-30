import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: W, height: H } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const logoBreath = useRef(new Animated.Value(0)).current;
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  const isValidEmail = (email: string) => /.+@.+\..+/.test(email);
  const isValidPhone = (phone: string) => phone.length >= 10;

  const handleSendReset = async () => {
    if (selectedMethod === 'email' && !isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (selectedMethod === 'sms' && !isValidPhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to code screen with the email/phone
      const contact = selectedMethod === 'email' ? email : phone;
      router.replace({ pathname: '/screens/auth/code', params: { method: selectedMethod, contact } });
    }, 2000);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
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
  };

  const RecoveryMethodCard = ({ 
    method, 
    title, 
    description, 
    icon, 
    color, 
    isAvailable = true 
  }: {
    method: 'email' | 'sms';
    title: string;
    description: string;
    icon: string;
    color: string;
    isAvailable?: boolean;
  }) => (
    <TouchableOpacity
      onPress={() => isAvailable && press(() => setSelectedMethod(method))}
      disabled={!isAvailable}
      style={{
        backgroundColor: selectedMethod === method ? 'white' : 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: selectedMethod === method ? color : 'transparent',
        opacity: isAvailable ? 1 : 0.5,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: selectedMethod === method ? '#1F2937' : 'white',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4,
          }}>
            {title}
          </Text>
          <Text style={{
            color: selectedMethod === method ? '#6B7280' : 'rgba(255,255,255,0.8)',
            fontSize: 14,
          }}>
            {description}
          </Text>
        </View>
        {selectedMethod === method && (
          <Ionicons name="checkmark-circle" size={24} color={color} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (emailSent) {
    return (
      <View className="flex-1">
        <StatusBar style="light" />
        <ExpoLinearGradient
          colors={['#4CAF50', '#2E7D32'] as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', inset: 0 as any }}
        />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => press(() => router.replace('/screens/auth/login'))}
          style={{ position: 'absolute', left: 20, top: H * 0.06, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Success content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Animated.View style={[{ 
            width: 120, 
            height: 120, 
            borderRadius: 60, 
            backgroundColor: 'white', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 32,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }, Breath(logoBreath)]}>
            <Ionicons name="checkmark" size={60} color="#4CAF50" />
          </Animated.View>

          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
            Email Sent!
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginBottom: 8 }}>
            Check your inbox for password reset instructions
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
            Don't see it? Check your spam folder
          </Text>

          <TouchableOpacity
            onPress={handleResend}
            disabled={resendCooldown > 0}
            style={{
              backgroundColor: resendCooldown > 0 ? 'rgba(255,255,255,0.3)' : 'white',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 25,
              marginBottom: 20,
            }}
          >
            <Text style={{
              color: resendCooldown > 0 ? 'rgba(255,255,255,0.7)' : '#1F2937',
              fontWeight: '600',
            }}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => press(() => router.push('/screens/auth/login'))}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          onPress={() => press(() => router.replace('/screens/auth/login'))}
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
            <Ionicons name="shield-checkmark" size={36} color="#4CAF50" />
          </Animated.View>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            Reset Your Password
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
            We'll help you get back to managing your health securely
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
            <Ionicons name="lock-closed" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8, fontWeight: '500' }}>
              Your account security is our priority
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 32 }}>
        {/* Recovery Methods */}
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
          Choose Recovery Method
        </Text>

        <RecoveryMethodCard
          method="email"
          title="Email Recovery"
          description="Send verification code to your registered email"
          icon="mail"
          color="#4CAF50"
        />

        <RecoveryMethodCard
          method="sms"
          title="SMS Recovery"
          description="Get verification code via text message"
          icon="phone-portrait"
          color="#2196F3"
        />

        {/* Input Section */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
            {selectedMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons 
              name={selectedMethod === 'email' ? 'mail' : 'phone-portrait'} 
              size={20} 
              color="rgba(255,255,255,0.9)" 
              style={{ marginRight: 12 }} 
            />
            <TextInput
              value={selectedMethod === 'email' ? email : phone}
              onChangeText={selectedMethod === 'email' ? setEmail : setPhone}
              placeholder={selectedMethod === 'email' ? 'Enter your email address' : 'Enter your phone number'}
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType={selectedMethod === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              style={{ color: 'white', flex: 1, fontSize: 16 }}
            />
            {(selectedMethod === 'email' && isValidEmail(email)) || (selectedMethod === 'sms' && isValidPhone(phone)) ? (
              <Ionicons name="checkmark-circle" size={20} color="#A7F3D0" />
            ) : null}
          </View>
        </View>

        {/* Security Info */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          marginTop: 24,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="shield-checkmark" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8, fontWeight: '500' }}>
              Secure password reset process
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="time" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              Reset links expire in 15 minutes for your security
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="lock-closed" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              Your health data remains encrypted and protected
            </Text>
          </View>
        </View>

        {/* Help Section */}
        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
            Need Help?
          </Text>
          <TouchableOpacity style={{ marginBottom: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecorationLine: 'underline' }}>
              Can't access email or phone?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginBottom: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecorationLine: 'underline' }}>
              Contact Support
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textDecorationLine: 'underline' }}>
              Common Issues & FAQ
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Send Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={handleSendReset}
          disabled={isLoading || (selectedMethod === 'email' && !isValidEmail(email)) || (selectedMethod === 'sms' && !isValidPhone(phone))}
          style={{
            backgroundColor: (selectedMethod === 'email' && isValidEmail(email)) || (selectedMethod === 'sms' && isValidPhone(phone)) ? 'white' : 'rgba(255,255,255,0.4)',
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {isLoading && (
            <Animated.View style={{ marginRight: 8 }}>
              <Ionicons name="refresh" size={20} color="#1F2937" />
            </Animated.View>
          )}
          <Text style={{
            color: (selectedMethod === 'email' && isValidEmail(email)) || (selectedMethod === 'sms' && isValidPhone(phone)) ? '#1F2937' : 'rgba(255,255,255,0.7)',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            {isLoading ? 'Sending...' : (selectedMethod === 'email' ? 'Send Verification Code' : 'Send SMS Code')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
