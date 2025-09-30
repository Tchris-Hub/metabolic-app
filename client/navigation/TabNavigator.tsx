import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import your screen components here
// import HomeScreen from '../app/screens/HomeScreen';
// import LogScreen from '../app/screens/LogScreen';
// import MealScreen from '../app/screens/MealScreen';
// import LearnScreen from '../app/screens/LearnScreen';
// import MoreScreen from '../app/screens/MoreScreen';

const Tab = createBottomTabNavigator();

// Placeholder screens for now
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
    <Text style={{ fontSize: 18, color: '#757575' }}>{title}</Text>
  </View>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Log':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'Meal':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'Learn':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={() => <PlaceholderScreen title="Home Screen" />}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Log" 
        component={() => <PlaceholderScreen title="Log Screen" />}
        options={{
          tabBarLabel: 'Log',
        }}
      />
      <Tab.Screen 
        name="Meal" 
        component={() => <PlaceholderScreen title="Meal Screen" />}
        options={{
          tabBarLabel: 'Meal',
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={() => <PlaceholderScreen title="Learn Screen" />}
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen 
        name="More" 
        component={() => <PlaceholderScreen title="More Screen" />}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}

