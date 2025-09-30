import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

// Import your auth screen components here
// import OnboardingScreen from '../app/screens/auth/OnboardingScreen';
// import WelcomeScreen from '../app/screens/auth/WelcomeScreen';
// import LoginScreen from '../app/screens/auth/LoginScreen';
// import SignupScreen from '../app/screens/auth/SignupScreen';
// import VerificationScreen from '../app/screens/auth/VerificationScreen';
// import ProfileScreen from '../app/screens/auth/ProfileScreen';
// import GoalsScreen from '../app/screens/auth/GoalsScreen';

const Stack = createStackNavigator();

// Placeholder screens for now
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
    <Text style={{ fontSize: 18, color: '#757575' }}>{title}</Text>
  </View>
);

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen 
        name="Onboarding" 
        component={() => <PlaceholderScreen title="Onboarding Screen" />}
      />
      <Stack.Screen 
        name="Welcome" 
        component={() => <PlaceholderScreen title="Welcome Screen" />}
      />
      <Stack.Screen 
        name="Login" 
        component={() => <PlaceholderScreen title="Login Screen" />}
      />
      <Stack.Screen 
        name="Signup" 
        component={() => <PlaceholderScreen title="Signup Screen" />}
      />
      <Stack.Screen 
        name="Verification" 
        component={() => <PlaceholderScreen title="Verification Screen" />}
      />
      <Stack.Screen 
        name="Profile" 
        component={() => <PlaceholderScreen title="Profile Screen" />}
      />
      <Stack.Screen 
        name="Goals" 
        component={() => <PlaceholderScreen title="Goals Screen" />}
      />
    </Stack.Navigator>
  );
}

