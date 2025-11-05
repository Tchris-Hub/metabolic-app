import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../component/ui/Loadingspinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has COMPLETED the full onboarding process
      const completed = await AsyncStorage.getItem('onboardingComplete');
      setOnboardingComplete(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingComplete(false);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  // Show loading while checking auth or onboarding status
  if (isLoading || checkingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner text="Loading..." overlay />
      </View>
    );
  }

  // FIRST-TIME USERS: Haven't completed onboarding
  // Show full sequential onboarding flow (slides → consent → signup → profile → goals)
  if (!onboardingComplete) {
    return <Redirect href="/screens/auth/PremiumOnboardingScreen" />;
  }

  // RETURNING USERS: Completed onboarding but not authenticated
  // Go straight to login (skip onboarding)
  if (!isAuthenticated) {
    return <Redirect href="/screens/auth/login" />;
  }

  // AUTHENTICATED USERS: Completed onboarding and logged in
  // Go to main app
  return <Redirect href="/(tabs)" />;
}