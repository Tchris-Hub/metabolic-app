import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width: W, height: H } = Dimensions.get('window');

export default function DisclaimerConsentScreen() {
  const insets = useSafeAreaInsets();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [consents, setConsents] = useState([
    { key: 'diag', label: 'I understand this app does not provide medical diagnosis.', required: true, checked: false },
    { key: 'storage', label: 'I consent to the use and storage of my health data.', required: true, checked: false },
    { key: 'terms', label: 'I agree to the terms of service and privacy policy.', required: true, checked: false },
    { key: 'analytics', label: 'I consent to anonymous analytics to improve the app.', required: false, checked: false },
  ]);

  // reading progress + minimum read time before enabling Accept
  const [progress, setProgress] = useState(0);
  const [startTs] = useState(() => Date.now());
  const minReadMs = 8000; // 8s
  const scrollerRef = useRef<ScrollView>(null);

  const allRequiredChecked = useMemo(() => consents.every(c => !c.required || c.checked), [consents]);
  const timeOk = Date.now() - startTs >= minReadMs;
  const canAccept = allRequiredChecked && timeOk;

  const accept = () => {
    router.replace('/screens/auth/welcome-screen');
  };

  const decline = () => {
    router.back();
  };

  const Check = ({ checked }: { checked: boolean }) => (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: checked ? 'white' : 'transparent',
        marginRight: 12,
      }}
    />
  );

  const Section = ({
    i,
    title,
    summary,
    details,
    icon,
  }: { i: number; title: string; summary: string[]; details: string; icon: string }) => (
    <View style={{ marginBottom: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.10)', padding: 14 }}>
      <Text className="text-white text-base font-bold mb-2">{icon} {title}</Text>
      {summary.map((t, idx) => (
        <Text key={idx} className="text-white/90 text-sm leading-6 mb-1">{t}</Text>
      ))}
      <TouchableOpacity onPress={() => setExpandedIdx(expandedIdx === i ? null : i)}>
        <Text className="text-white underline mt-2">{expandedIdx === i ? 'Hide details' : 'Read more'}</Text>
      </TouchableOpacity>
      {expandedIdx === i && (
        <Text className="text-white/80 text-xs leading-6 mt-2">{details}</Text>
      )}
    </View>
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const total = Math.max(1, contentSize.height - layoutMeasurement.height);
    setProgress(Math.min(1, contentOffset.y / total));
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

      {/* progress indicator */}
      <View style={{ position: 'absolute', left: 16, right: 16, top: insets.top + 8, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' }}>
        <View style={{ width: `${Math.round(progress * 100)}%`, height: 4, borderRadius: 2, backgroundColor: 'white' }} />
      </View>

      <View
        style={{
          flex: 1,
          marginTop: insets.top + 16,
          marginBottom: insets.bottom + 92,
          marginHorizontal: 16,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: 20,
        }}
      >
        <ScrollView
          ref={scrollerRef}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="text-white text-2xl font-extrabold mb-4 text-center">Disclaimer & Consent</Text>

          <Section
            i={0}
            icon="⚠️"
            title="Important Health Disclaimer"
            summary={[
              'If you are experiencing a medical emergency, call emergency services immediately.',
              'This app is educational only and not a substitute for professional medical advice.',
              'Not evaluated by the FDA; not a medical device; cannot diagnose, treat, cure, or prevent any disease.',
            ]}
            details={'Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition. Do not disregard professional advice or delay seeking it because of information presented in this app. Medication decisions should be made with your clinician; the app does not replace prescribed care.'}
          />

          <Section
            i={1}
            icon="🔐"
            title="Data Security & Your Privacy Rights"
            summary={[
              'Data encrypted in transit and at rest; access is restricted.',
              'Limited third‑party sharing (e.g., Firebase/AdMob) as described in our Privacy Policy.',
              'You can request export or deletion of your data at any time.',
            ]}
            details={'Data retention follows operational needs and legal requirements. Servers may be located in the U.S. or other regions. In the unlikely event of a breach, we will notify affected users and regulators as required by law. You retain rights similar to HIPAA/GDPR including access, correction, and deletion.'}
          />

          <Section
            i={2}
            icon="📱"
            title="App Limitations & Accuracy"
            summary={[
              'User‑entered data may be inaccurate; review before relying on outputs.',
              'Technology may have bugs, downtime, or incorrect calculations.',
              'Some features require an active internet connection and a compatible device.',
            ]}
            details={'While we strive for accuracy, the app may occasionally present errors or be unavailable. Device performance and OS versions can affect functionality. Terms may change as the app is updated.'}
          />

          <Section
            i={3}
            icon="⚖️"
            title="Legal Terms & Conditions"
            summary={[
              'Use at your own risk; we are not liable for outcomes or decisions.',
              'You agree to indemnify and hold the company harmless for misuse.',
              'Your use is governed by the laws/jurisdiction stated in our Terms; disputes may require arbitration; class‑action waiver may apply.',
            ]}
            details={'These terms limit liability to the extent permitted by law and define dispute resolution mechanisms, including arbitration and governing law. Continued use constitutes agreement to updated terms.'}
          />

          <Section
            i={4}
            icon="👤"
            title="Age & Capacity Requirements"
            summary={[
              'You must be 18+ or have verified parental/guardian consent.',
              'You confirm you have the capacity to make health decisions.',
            ]}
            details={'Users under 18 or with certain conditions may require guardian consent and oversight. Misrepresentation of age or capacity may result in account termination.'}
          />

          <Text className="text-white text-lg font-bold mt-6 mb-2">✅ Consent to Use & Data Processing</Text>
          <Text className="text-white/90 text-sm leading-6 mb-3">
            By continuing, you agree to the collection and processing of your health data to provide app features. You also confirm you understand this app is for wellness support, not medical treatment.
          </Text>

          {consents.map((c, i) => (
            <TouchableOpacity key={c.key} onPress={() => setConsents(prev => prev.map((x, idx) => idx === i ? { ...x, checked: !x.checked } : x))} className="flex-row items-center mb-3">
              <Check checked={c.checked} />
              <Text className="text-white/90 text-sm flex-1">{c.label}{c.required ? ' *' : ''}</Text>
            </TouchableOpacity>
          ))}

          <Text className="text-white/70 text-xs mt-2">Version 1.0 • Last updated: {new Date().toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com?subject=Disclaimer%20Copy')}>
            <Text className="text-white/80 text-xs underline mt-1">Email a copy</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 16, paddingHorizontal: 20 }}>
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={decline} className="px-6 py-4 rounded-full bg-white/20">
            <Text className="text-white font-semibold">Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={accept}
            disabled={!canAccept}
            className={`px-8 py-4 rounded-full ${canAccept ? 'bg-white' : 'bg-white/40'}`}
          >
            <Text className={`${canAccept ? 'text-gray-900' : 'text-gray-700'} font-bold`}>Accept & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


