import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, Modal, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width: W } = Dimensions.get('window');

export default function SignUpStep2() {
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
  const params = useLocalSearchParams();
  const email = typeof params.email === 'string' ? params.email : '';
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState<'US' | 'GB' | 'NG' | 'IN' | 'CA'>('US');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [dialVisible, setDialVisible] = useState(false);

  const countries = [
    { code: 'US' as const, name: 'United States', dial: '+1', flag: '🇺🇸' },
    { code: 'GB' as const, name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
    { code: 'NG' as const, name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
    { code: 'IN' as const, name: 'India', dial: '+91', flag: '🇮🇳' },
    { code: 'CA' as const, name: 'Canada', dial: '+1', flag: '🇨🇦' },
  ];
  const selected = countries.find(c => c.code === country)!;

  const basicOk = useMemo(() => first.trim().length > 0 && last.trim().length > 0 && dob.trim().length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dob) && gender.length > 0, [first, last, dob, gender]);

  const submit = () => {
    if (!basicOk) return;
    // Navigate to email verification, pass email from step 1
    router.push({ pathname: '/screens/auth/verification', params: { email } });
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
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 16, top: 56, padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={[{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 8 }, Breath(logoBreath)]}>
            <Ionicons name="medical" size={36} color="#4CAF50" />
          </Animated.View>
          <Text className="text-white text-lg font-extrabold mt-4">Tell us about yourself</Text>
          <Text className="text-white/80 text-xs mt-1">Step 2 of 2</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="flex-row justify-center mt-4" style={{ gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' }} />
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' }} />
      </View>

      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text className="text-white/90 mb-2">First name</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 }}>
          <TextInput value={first} onChangeText={setFirst} placeholder="Jane" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white' }} />
        </View>

        <Text className="text-white/90 mb-2">Last name</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 }}>
          <TextInput value={last} onChangeText={setLast} placeholder="Doe" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white' }} />
        </View>

        <Text className="text-white/90 mb-2">Date of birth</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 }}>
          <TextInput
            value={dob}
            onChangeText={(t) => {
              // Mask to YYYY-MM-DD
              const digits = t.replace(/[^0-9]/g, '').slice(0, 8);
              let out = digits;
              if (digits.length > 4) out = digits.slice(0,4) + '-' + digits.slice(4);
              if (digits.length > 6) out = digits.slice(0,4) + '-' + digits.slice(4,6) + '-' + digits.slice(6);
              setDob(out);
            }}
            keyboardType="number-pad"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={{ color: 'white' }}
            maxLength={10}
          />
        </View>

        <Text className="text-white/90 mb-2">Gender/Sex</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          {[ 'Female', 'Male', 'Other' ].map((g) => (
            <TouchableOpacity key={g} onPress={() => setGender(g)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: gender === g ? 'white' : 'rgba(255,255,255,0.15)' }}>
              <Text style={{ color: gender === g ? '#111827' : 'white' }}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Country/Region */}
        <Text className="text-white/90 mb-2">Country/Region</Text>
        <TouchableOpacity onPress={() => setCountryPickerVisible(true)} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white', marginRight: 8 }}>{selected.flag}</Text>
          <Text style={{ color: 'white', flex: 1 }}>{selected.name}</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>

        {/* Phone with country code */}
        <Text className="text-white/90 mb-2">Phone number (optional)</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setDialVisible(true)} style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', marginRight: 8, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', marginRight: 6 }}>{selected.flag}</Text>
            <Text style={{ color: 'white' }}>{selected.dial}</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <TextInput value={phone} onChangeText={setPhone} placeholder="555 555 5555" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white', flex: 1 }} keyboardType="phone-pad" />
        </View>
        <Text className="text-white/70 text-xs">We recommend adding a phone for two‑factor authentication.</Text>

        <TouchableOpacity disabled={!basicOk} onPress={submit} className="rounded-full mt-6" style={{ backgroundColor: basicOk ? 'white' : 'rgba(255,255,255,0.4)', paddingVertical: 14 }}>
          <Text className="text-center font-bold" style={{ color: basicOk ? '#111827' : '#374151' }}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Country picker modal */}
      <Modal visible={countryPickerVisible} transparent animationType="fade" onRequestClose={() => setCountryPickerVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, maxHeight: 360, paddingVertical: 8 }}>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setCountry(item.code); setCountryPickerVisible(false); }} style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>{item.flag}</Text>
                  <Text style={{ color: '#111827', flex: 1 }}>{item.name}</Text>
                  <Text style={{ color: '#6B7280' }}>{item.dial}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />}
            />
            <TouchableOpacity onPress={() => setCountryPickerVisible(false)} style={{ padding: 14, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dial picker reusing same list */}
      <Modal visible={dialVisible} transparent animationType="fade" onRequestClose={() => setDialVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, maxHeight: 360, paddingVertical: 8 }}>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setCountry(item.code); setDialVisible(false); }} style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>{item.flag}</Text>
                  <Text style={{ color: '#111827', flex: 1 }}>{item.name}</Text>
                  <Text style={{ color: '#6B7280' }}>{item.dial}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />}
            />
            <TouchableOpacity onPress={() => setDialVisible(false)} style={{ padding: 14, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


