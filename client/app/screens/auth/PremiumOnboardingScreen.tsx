import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StatusBar, FlatList, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import Slide1 from '../../../assets/images/onboarding/onboardingslide1.svg';
// @ts-ignore
import Slide2 from '../../../assets/images/onboarding/onboardingslide2.svg';
// @ts-ignore
import Slide3 from '../../../assets/images/onboarding/onboardingslide3.svg';

const { width: W, height: H } = Dimensions.get('window');

const COLORS: [string, string, string?][] = [
  ['#4CAF50', '#2E7D32', '#1B5E20'],
  ['#2196F3', '#1976D2', '#0D47A1'],
  ['#FF9800', '#F57C00', '#E65100'],
];

const SLIDES = [Slide1, Slide2, Slide3];
const TITLES = [
  'Track Your Health Journey',
  'Smart Nutrition Made Simple',
  'Achieve Your Health Goals',
];
const SUBS = [
  'Monitor blood sugar, pressure, weight, and medications all in one place',
  'Access diabetes-friendly meal plans, recipes, and carb counting tools',
  'Stay motivated with daily tips, challenges, and progress tracking',
];
const CTAS = ['Get Started', 'Continue', "Let's Begin"];

export default function PremiumOnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const draggingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // lightweight animation drivers
  const pulse = useRef(new Animated.Value(0)).current; // slide 1
  const appear = useRef(new Animated.Value(0)).current; // slide 2
  const bounce = useRef(new Animated.Value(0)).current; // slide 3

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / W);
    if (i !== index) setIndex(i);
  };

  const goTo = (i: number) => {
    if (i < 0 || i > SLIDES.length - 1) return;
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  const SlideItem = ({ i }: { i: number }) => {
    const Svg = SLIDES[i];
    return (
      <View style={{ width: W, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Svg width={W * 0.86} height={H * 0.42} />
      </View>
    );
  };

  // Autoplay with safe loop; pauses while user is dragging
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (!draggingRef.current) {
        const nextIndex = (index + 1) % SLIDES.length;
        goTo(nextIndex);
      }
    }, 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  // Start per-slide micro animations
  useEffect(() => {
    // reset
    pulse.setValue(0); appear.setValue(0); bounce.setValue(0);
    if (index === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else if (index === 1) {
      Animated.stagger(180, [
        Animated.timing(appear, { toValue: 0.33, duration: 220, useNativeDriver: true }),
        Animated.timing(appear, { toValue: 0.66, duration: 220, useNativeDriver: true }),
        Animated.timing(appear, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else if (index === 2) {
      Animated.sequence([
        Animated.spring(bounce, { toValue: 1, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0.9, duration: 200, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [index]);

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Gradient background matching current slide */}
      <View style={{ position: 'absolute', inset: 0 as any }}>
        <ExpoLinearGradient
          colors={COLORS[index] as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Skip */}
      <TouchableOpacity className="absolute top-16 right-6 z-20 px-4 py-2"
        onPress={() => goTo(SLIDES.length - 1)}
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
        <Text className="text-white font-semibold">Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={[0, 1, 2]}
        keyExtractor={(x) => String(x)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScrollBeginDrag={() => { draggingRef.current = true; }}
        onMomentumScrollEnd={onMomentumEnd}
        onScrollEndDrag={() => { draggingRef.current = false; }}
        renderItem={({ item }) => <SlideItem i={item} />}
      />

      {/* Headline & subtitle */}
      <View className="items-center px-8" style={{ position: 'absolute', bottom: 140, left: 0, right: 0 }}>
        <Text className="text-white text-3xl font-extrabold text-center"
          style={{ textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
          {TITLES[index]}
        </Text>
        <Text className="text-white/90 text-base text-center mt-2">
          {SUBS[index]}
        </Text>
      </View>

      {/* Controls */}
      <View className="px-8 pb-12">
        <View className="flex-row justify-center mb-8">
          {[0, 1, 2].map((i) => (
            <View key={i} className={`mx-1 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} style={{ width: 8, height: 8 }} />
          ))}
        </View>

        <View className="flex-row justify-between items-center">
          <TouchableOpacity disabled={index === 0} onPress={() => goTo(index - 1)}
            className={`px-6 py-4 rounded-full min-w-[110px] ${index === 0 ? 'opacity-40 bg-white/20' : 'bg-white/20'}`}>
            <Text className="text-white font-semibold text-center">Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            if (index === 2) {
              router.push('/screens/auth/disclaimer-consent');
            } else {
              goTo(index + 1);
            }
          }}
            className={`px-10 py-4 rounded-full min-w-[150px] bg-white`}>
            <Text className="text-gray-900 font-bold text-center">{CTAS[index]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Micro-animations overlay */}
      {index === 0 && (
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0 as any }}>
          <Animated.View style={{ position: 'absolute', top: H * 0.22, left: W * 0.18, width: 10, height: 10, borderRadius: 5, backgroundColor: 'white', opacity: 0.6, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.15] }) }] }} />
          <Animated.View style={{ position: 'absolute', top: H * 0.26, right: W * 0.2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', opacity: 0.5, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1.1, 0.95] }) }] }} />
        </View>
      )}
      {index === 1 && (
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0 as any }}>
          {[0, 1, 2].map((i) => (
            <Animated.View key={`food-${i}`} style={{ position: 'absolute', top: H * (0.22 + i * 0.06), left: W * (0.2 + i * 0.12), width: 10 + i * 3, height: 10 + i * 3, borderRadius: 8, backgroundColor: 'white', opacity: appear.interpolate({ inputRange: [0, 0.33, 0.66, 1], outputRange: [0, i >= 0 ? 1 : 0, i >= 1 ? 1 : 0, 1] }) }} />
          ))}
        </View>
      )}
      {index === 2 && (
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0 as any }}>
          {[0, 1, 2].map((i) => (
            <Animated.View key={`badge-${i}`} style={{ position: 'absolute', top: H * (0.22 + i * 0.06), right: W * (0.2 + i * 0.1), width: 26, height: 26, borderRadius: 13, backgroundColor: 'white', opacity: 0.95, transform: [{ scale: bounce.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }} />
          ))}
        </View>
      )}
    </View>
  );
}
