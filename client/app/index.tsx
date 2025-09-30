import React from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../component/ui/Loadingspinner';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner text="Loading..." overlay />
      </View>
    );
  }

  // If not authenticated, go to onboarding
  if (!isAuthenticated) {
    return <Redirect href="/screens/auth/PremiumOnboardingScreen" />;
  }

  // If authenticated but hasn't completed onboarding, go to profile setup
  if (isAuthenticated && !hasCompletedOnboarding) {
    return <Redirect href="/screens/auth/profile" />;
  }

  // If authenticated and completed onboarding, go to main app
  return <Redirect href="/(tabs)" />;
}