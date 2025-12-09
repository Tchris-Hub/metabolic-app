import React, { useRef } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getButtonAccessibilityProps } from '../../utils/accessibilityUtils';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityHint?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityHint,
}: ButtonProps) {
  const { colors } = useTheme();
  
  // Animation value for press effect
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  // Define contrasting text color for filled buttons
  const filledTextColor = '#FFFFFF';

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      borderWidth: variant === 'outline' ? 1 : 0,
    };

    // Size styles
    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8 },
      medium: { paddingHorizontal: 24, paddingVertical: 12 },
      large: { paddingHorizontal: 32, paddingVertical: 16 },
    };

    // Variant styles using theme colors
    const variantStyles = {
      primary: {
        backgroundColor: colors.success,
        borderColor: colors.success,
      },
      secondary: {
        backgroundColor: colors.info,
        borderColor: colors.info,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.success,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    // Variant text styles using theme colors
    const variantTextStyles = {
      primary: { color: filledTextColor },
      secondary: { color: filledTextColor },
      outline: { color: colors.success },
      ghost: { color: colors.success },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'medium' ? 18 : 20;
    const iconColor = variant === 'outline' || variant === 'ghost' ? colors.success : filledTextColor;
    
    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={iconColor}
        style={{ marginRight: iconPosition === 'left' ? 8 : 0, marginLeft: iconPosition === 'right' ? 8 : 0 }}
      />
    );
  };

  // Get accessibility props
  const a11yProps = getButtonAccessibilityProps({
    title,
    disabled,
    loading,
    hint: accessibilityHint,
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...a11yProps}
      >
        {iconPosition === 'left' && renderIcon()}
        
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? colors.success : filledTextColor} 
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
        
        {iconPosition === 'right' && renderIcon()}
      </TouchableOpacity>
    </Animated.View>
  );
}
