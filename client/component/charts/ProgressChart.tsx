import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, interpolate } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProgressChartProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  value?: number;
  unit?: string;
  label?: string;
  style?: ViewStyle;
  animated?: boolean;
  duration?: number;
}

export default function ProgressChart({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#4CAF50',
  backgroundColor = '#E0E0E0',
  showPercentage = true,
  showValue = false,
  value,
  unit = '',
  label,
  style,
  animated = true,
  duration = 1000,
}: ProgressChartProps) {
  const animatedProgress = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, { duration });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated, duration, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      animatedProgress.value,
      [0, 100],
      [circumference, 0]
    );

    return {
      strokeDashoffset,
    };
  });

  const getContainerStyle = (): ViewStyle => ({
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    textAlign: 'center',
  });

  const getValueStyle = (): TextStyle => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  });

  const getUnitStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  });

  const getPercentageStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  });

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            animatedProps={animatedProps}
          />
        </Svg>

        {/* Center content */}
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {showValue && value !== undefined && (
            <Text style={getValueStyle()}>
              {value}
              {unit && <Text style={getUnitStyle()}> {unit}</Text>}
            </Text>
          )}
          
          {showPercentage && (
            <Text style={getPercentageStyle()}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

