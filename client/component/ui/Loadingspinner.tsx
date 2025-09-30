import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated, ViewStyle, TextStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function LoadingSpinner({
  size = 'large',
  color = '#4CAF50',
  text,
  overlay = false,
  style,
  textStyle,
}: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (overlay) {
      return {
        ...baseStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
      };
    }

    return {
      ...baseStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => ({
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    ...textStyle,
  });

  return (
    <View style={getContainerStyle()}>
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
        }}
      >
        <ActivityIndicator size={size} color={color} />
      </Animated.View>
      {text && <Text style={getTextStyle()}>{text}</Text>}
    </View>
  );
}

