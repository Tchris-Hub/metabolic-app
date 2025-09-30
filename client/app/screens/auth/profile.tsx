import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, ScrollView, Image, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const AVATARS = [
  { id: 'avatar1', emoji: '👨‍⚕️', name: 'Professional' },
  { id: 'avatar2', emoji: '👩‍⚕️', name: 'Medical' },
  { id: 'avatar3', emoji: '🧑‍💼', name: 'Business' },
  { id: 'avatar4', emoji: '👨‍🎓', name: 'Academic' },
  { id: 'avatar5', emoji: '👩‍🎨', name: 'Creative' },
  { id: 'avatar6', emoji: '🧑‍🍳', name: 'Chef' },
  { id: 'avatar7', emoji: '👨‍🏫', name: 'Teacher' },
  { id: 'avatar8', emoji: '👩‍💻', name: 'Tech' },
  { id: 'avatar9', emoji: '🧑‍🌾', name: 'Wellness' },
  { id: 'avatar10', emoji: '👨‍🚀', name: 'Adventure' },
  { id: 'avatar11', emoji: '👩‍🎤', name: 'Artist' },
  { id: 'avatar12', emoji: '🧑‍🔬', name: 'Scientist' },
];

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
];

export default function ProfileSetupScreen() {
  const logoBreath = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [country, setCountry] = useState('');

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

  const formatDateInput = (text: string) => {
    // Remove all non-digits
    const numbers = text.replace(/\D/g, '');
    
    // Format as MM/DD/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDateOfBirth(formatted);
  };

  const openImagePicker = () => {
    // For now, let's just open the avatar modal since camera access is problematic
    setShowAvatarModal(true);
  };

  const openCamera = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera not available', 'Camera is not supported on web. Please use Photo Library instead.');
      return;
    }

    try {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8 as any,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          setSelectedPhoto(response.assets[0].uri || null);
          setSelectedAvatar(null);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Camera access is not available. Please use Photo Library instead.');
    }
  };

  const openImageLibrary = () => {
    try {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8 as any,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          setSelectedPhoto(response.assets[0].uri || null);
          setSelectedAvatar(null);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Photo library access is not available. Please try again or use an avatar instead.');
    }
  };

  const selectAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setSelectedPhoto(null);
    setShowAvatarModal(false);
  };

  const selectCountry = (country: { code: string; name: string; flag: string }) => {
    setSelectedCountry(country);
    setCountry(country.name);
    setShowCountryModal(false);
  };

  const getProfileImage = () => {
    if (selectedPhoto) {
      return <Image source={{ uri: selectedPhoto }} style={{ width: 80, height: 80, borderRadius: 40 }} />;
    }
    if (selectedAvatar) {
      const avatar = AVATARS.find(a => a.id === selectedAvatar);
      return (
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 32 }}>{avatar?.emoji}</Text>
        </View>
      );
    }
    return (
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="person" size={32} color="rgba(255,255,255,0.7)" />
      </View>
    );
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return fullName.trim().length > 0 && dateOfBirth.length > 0 && gender.length > 0;
      case 2:
        return height.length > 0 && weight.length > 0 && selectedCountry !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to goals screen
      router.replace('/screens/auth/goals');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      {/* Profile Photo Section - Beautiful Design */}
      <View style={{ 
        alignItems: 'center', 
        marginBottom: 48,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 20, 
          fontWeight: '700', 
          marginBottom: 8, 
          textAlign: 'center' 
        }}>
          Add Your Photo
        </Text>
        <Text style={{ 
          color: 'rgba(255,255,255,0.8)', 
          fontSize: 14, 
          textAlign: 'center', 
          marginBottom: 24,
          lineHeight: 20 
        }}>
          Personalize your health journey
        </Text>
        
        <TouchableOpacity 
          onPress={() => press(openImagePicker)} 
          style={{ 
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {getProfileImage()}
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity 
            onPress={() => press(openImagePicker)} 
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              📷 Take Photo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => press(() => setShowAvatarModal(true))} 
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              👤 Choose Avatar
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: 12, 
          textAlign: 'center', 
          marginTop: 16 
        }}>
          Optional • Secure & Private
        </Text>
      </View>

      {/* Personal Information Form */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 18, 
          fontWeight: '700', 
          marginBottom: 20,
          textAlign: 'center' 
        }}>
          Personal Information
        </Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Full Name *
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: 'white', fontSize: 16 }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Date of Birth *
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <TextInput
              value={dateOfBirth}
              onChangeText={handleDateChange}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: 'white', fontSize: 16 }}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
            Enter your birth date for personalized health insights
          </Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Gender *
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Male', 'Female'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => press(() => setGender(option))}
                style={{
                  flex: 1,
                  backgroundColor: gender === option ? 'white' : 'rgba(255,255,255,0.12)',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: gender === option ? 'white' : 'rgba(255,255,255,0.2)',
                }}
              >
                <Text style={{
                  color: gender === option ? '#1F2937' : 'white',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            onPress={() => press(() => setGender('Prefer not to say'))}
            style={{
              marginTop: 8,
              backgroundColor: gender === 'Prefer not to say' ? 'white' : 'rgba(255,255,255,0.12)',
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: gender === 'Prefer not to say' ? 'white' : 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{
              color: gender === 'Prefer not to say' ? '#1F2937' : 'white',
              fontSize: 14,
              fontWeight: '600',
            }}>
              Prefer not to say
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      {/* Header Section */}
      <View style={{ 
        alignItems: 'center', 
        marginBottom: 40,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 20, 
          fontWeight: '700', 
          marginBottom: 8, 
          textAlign: 'center' 
        }}>
          Physical Measurements
        </Text>
        <Text style={{ 
          color: 'rgba(255,255,255,0.8)', 
          fontSize: 14, 
          textAlign: 'center',
          lineHeight: 20 
        }}>
          This helps us provide accurate health insights and personalized recommendations
        </Text>
      </View>

      {/* Form Fields */}
      <View style={{ marginBottom: 32 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Height *
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="e.g., 5'8 or 173 cm"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: 'white', fontSize: 16 }}
            />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
            Used for BMI calculations and health recommendations
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Weight *
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 18,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="e.g., 150 lbs or 68 kg"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={{ color: 'white', fontSize: 16 }}
              keyboardType="numeric"
            />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
            Helps us track your health progress accurately
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
            Country/Region *
          </Text>
          <TouchableOpacity
            onPress={() => press(() => setShowCountryModal(true))}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 16,
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {selectedCountry ? (
                <>
                  <Text style={{ fontSize: 20, marginRight: 12 }}>{selectedCountry.flag}</Text>
                  <Text style={{ color: 'white', fontSize: 16, flex: 1 }}>{selectedCountry.name}</Text>
                </>
              ) : (
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>Select your country</Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
            For localized health recommendations and units
          </Text>
        </View>
      </View>

      {/* Privacy Notice - Beautiful Design */}
      <View style={{
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
          </View>
          <Text style={{ color: '#4CAF50', fontSize: 16, fontWeight: '700' }}>
            Your Data is Secure
          </Text>
        </View>
        <Text style={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: 14, 
          lineHeight: 20,
          marginLeft: 44 
        }}>
          All information is encrypted and stored securely. We never share your personal health data with third parties.
        </Text>
      </View>
    </View>
  );

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
          onPress={() => press(() => {
            if (currentStep === 1) {
              router.replace('/screens/auth/verification');
            } else {
              setCurrentStep(1);
            }
          })}
          style={{ position: 'absolute', left: 20, top: H * 0.06, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', marginTop: 16, textAlign: 'center' }}>
            {currentStep === 1 ? 'Create Your Profile' : 'Physical Information'}
          </Text>
          
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginTop: 8 }}>
            Step {currentStep} of 2
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 8 }}>
        <View style={{ 
          height: 6, 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${(currentStep / 2) * 100}%`,
            backgroundColor: 'white',
            borderRadius: 3,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 4,
          }} />
        </View>
        <Text style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: 12, 
          textAlign: 'center', 
          marginTop: 8 
        }}>
          {currentStep === 1 ? 'Basic Information' : 'Physical Measurements'}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </ScrollView>

      {/* Navigation */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => press(prevStep)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingVertical: 16,
                borderRadius: 25,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                Previous
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => press(nextStep)}
            disabled={!canContinue()}
            style={{
              flex: 1,
              backgroundColor: canContinue() ? 'white' : 'rgba(255,255,255,0.4)',
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: canContinue() ? '#1F2937' : 'rgba(255,255,255,0.7)',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              {currentStep === 2 ? 'Continue' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar Selection Modal */}
      <Modal visible={showAvatarModal} transparent animationType="fade" onRequestClose={() => setShowAvatarModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: H * 0.7 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Choose an Avatar
            </Text>
            
            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {AVATARS.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    onPress={() => press(() => selectAvatar(avatar.id))}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: selectedAvatar === avatar.id ? '#4CAF50' : '#f0f0f0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 32 }}>{avatar.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => press(() => setShowAvatarModal(false))}
              style={{
                backgroundColor: '#f0f0f0',
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal visible={showCountryModal} transparent animationType="fade" onRequestClose={() => setShowCountryModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, maxHeight: H * 0.8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Select Your Country
            </Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  onPress={() => press(() => selectCountry(country))}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: selectedCountry?.code === country.code ? '#4CAF50' : 'transparent',
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 16 }}>{country.flag}</Text>
                  <Text style={{ 
                    color: selectedCountry?.code === country.code ? 'white' : '#1F2937',
                    fontSize: 16,
                    fontWeight: selectedCountry?.code === country.code ? '600' : '400',
                    flex: 1
                  }}>
                    {country.name}
                  </Text>
                  {selectedCountry?.code === country.code && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => press(() => setShowCountryModal(false))}
              style={{
                backgroundColor: '#f0f0f0',
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
