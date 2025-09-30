import React, { useEffect, useRef } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak?: number;
  target?: number;
  type: 'daily' | 'weekly' | 'monthly';
  color?: string;
  backgroundColor?: string;
  showFire?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

export default function StreakCounter({
  currentStreak,
  longestStreak,
  target,
  type,
  color = '#FF6B35',
  backgroundColor = '#FFF3E0',
  showFire = true,
  animated = true,
  style,
}: StreakCounterProps) {
  const scaleValue = useRef(useSharedValue(1)).current;
  const opacityValue = useRef(useSharedValue(1)).current;

  useEffect(() => {
    if (animated) {
      scaleValue.value = withSpring(1.1, { damping: 8, stiffness: 100 });
      setTimeout(() => {
        scaleValue.value = withSpring(1, { damping: 8, stiffness: 100 });
      }, 200);

      opacityValue.value = withTiming(0.7, { duration: 1000 });
      opacityValue.value = withTiming(1, { duration: 1000 });
    }
  }, [currentStreak, animated, scaleValue, opacityValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const getTypeText = (): string => {
    switch (type) {
      case 'daily':
        return 'Day';
      case 'weekly':
        return 'Week';
      case 'monthly':
        return 'Month';
    }
  };

  const getTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'daily':
        return 'sunny';
      case 'weekly':
        return 'calendar';
      case 'monthly':
        return 'calendar-outline';
    }
  };

  const getContainerStyle = (): ViewStyle => ({
    backgroundColor,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color,
    ...style,
  });

  const getHeaderStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  });

  const getTypeTextStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 4,
  });

  const getStreakStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  });

  const getCurrentStreakStyle = (): TextStyle => ({
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  });

  const getStreakTextStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  });

  const getStatsStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  });

  const getStatStyle = (): ViewStyle => ({
    alignItems: 'center',
    flex: 1,
  });

  const getStatLabelStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  });

  const getStatValueStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  });

  const getProgressStyle = (): ViewStyle => ({
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  });

  const getProgressBarStyle = (): ViewStyle => ({
    height: '100%',
    backgroundColor: color,
    borderRadius: 3,
    width: target ? `${Math.min((currentStreak / target) * 100, 100)}%` : '0%',
  });

  const getMotivationText = (): string => {
    if (currentStreak === 0) {
      return "Start your streak today!";
    } else if (currentStreak < 7) {
      return "Keep it up!";
    } else if (currentStreak < 30) {
      return "Great job!";
    } else if (currentStreak < 100) {
      return "Amazing streak!";
    } else {
      return "Legendary!";
    }
  };

  const getMotivationStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  });

  return (
    <Animated.View style={[getContainerStyle(), animatedStyle]}>
      {/* Header */}
      <View style={getHeaderStyle()}>
        <Ionicons
          name={getTypeIcon()}
          size={16}
          color="#424242"
        />
        <Text style={getTypeTextStyle()}>
          {getTypeText()} Streak
        </Text>
      </View>

      {/* Current streak */}
      <View style={getStreakStyle()}>
        {showFire && currentStreak > 0 && (
          <Ionicons
            name="flame"
            size={24}
            color={color}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={getCurrentStreakStyle()}>{currentStreak}</Text>
        <Text style={getStreakTextStyle()}>
          {currentStreak === 1 ? getTypeText() : `${getTypeText()}s`}
        </Text>
      </View>

      {/* Stats */}
      <View style={getStatsStyle()}>
        {longestStreak && (
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Longest</Text>
            <Text style={getStatValueStyle()}>{longestStreak}</Text>
          </View>
        )}
        
        {target && (
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Target</Text>
            <Text style={getStatValueStyle()}>{target}</Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {target && (
        <View style={getProgressStyle()}>
          <View style={getProgressBarStyle()} />
        </View>
      )}

      {/* Motivation text */}
      <Text style={getMotivationStyle()}>
        {getMotivationText()}
      </Text>
    </Animated.View>
  );
}

