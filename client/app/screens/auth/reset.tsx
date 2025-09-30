import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: W, height: H } = Dimensions.get('window');

export default function ResetScreen() {
  const { method, contact, code } = useLocalSearchParams<{ method: string; contact: string; code: string }>();
  const logoBreath = useRef(new Animated.Value(0)).current;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 2) return '#F44336';
    if (strength < 4) return '#FF9800';
    return '#4CAF50';
  };

  const getStrengthText = (strength: number) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isPasswordValid = newPassword.length >= 8 && passwordsMatch;

  const updatePassword = async () => {
    if (!isPasswordValid) return;

    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      // Navigate to success screen
      router.replace('/screens/auth/success');
    }, 2000);
  };

  const goBack = () => {
    press(() => router.replace('/screens/auth/code'));
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
            <Ionicons name="lock-closed" size={36} color="#4CAF50" />
          </Animated.View>
          
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            Create New Password
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }}>
            Choose a strong password to secure your account
          </Text>
        </View>
      </View>

      {/* Form */}
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 40 }}>
        {/* New Password */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
            New Password
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.9)" style={{ marginRight: 12 }} />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={{ color: 'white', flex: 1, fontSize: 16 }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          
          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginRight: 8 }}>
                  <View style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    height: '100%',
                    backgroundColor: getStrengthColor(passwordStrength),
                    borderRadius: 2,
                  }} />
                </View>
                <Text style={{ color: getStrengthColor(passwordStrength), fontSize: 12, fontWeight: '600' }}>
                  {getStrengthText(passwordStrength)}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                Use 8+ characters with uppercase, lowercase, numbers, and symbols
              </Text>
            </View>
          )}
        </View>

        {/* Confirm Password */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
            Confirm Password
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.9)" style={{ marginRight: 12 }} />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              style={{ color: 'white', flex: 1, fontSize: 16 }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          
          {/* Password Match Indicator */}
          {confirmPassword.length > 0 && (
            <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name={passwordsMatch ? 'checkmark-circle' : 'close-circle'} 
                size={16} 
                color={passwordsMatch ? '#4CAF50' : '#F44336'} 
              />
              <Text style={{ 
                color: passwordsMatch ? '#4CAF50' : '#F44336', 
                fontSize: 12, 
                marginLeft: 6,
                fontWeight: '500'
              }}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}
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
              Your password will be encrypted and stored securely
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="lock-closed" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              All devices will be logged out for security
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medical" size={16} color="#A7F3D0" />
            <Text style={{ color: '#A7F3D0', fontSize: 14, marginLeft: 8 }}>
              Your health data remains protected
            </Text>
          </View>
        </View>
      </View>

      {/* Update Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity
          onPress={updatePassword}
          disabled={!isPasswordValid || isUpdating}
          style={{
            backgroundColor: isPasswordValid && !isUpdating ? 'white' : 'rgba(255,255,255,0.4)',
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {isUpdating && (
            <Animated.View style={{ marginRight: 8 }}>
              <Ionicons name="refresh" size={20} color="#1F2937" />
            </Animated.View>
          )}
          <Text style={{
            color: isPasswordValid && !isUpdating ? '#1F2937' : 'rgba(255,255,255,0.7)',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            {isUpdating ? 'Updating Password...' : 'Update Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}