import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  earned?: boolean;
  progress?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Badge({
  title,
  description,
  icon,
  color = '#FFD700',
  backgroundColor = '#FFF8E1',
  size = 'medium',
  earned = false,
  progress,
  onPress,
  style,
}: BadgeProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: 8, borderRadius: 12 },
          icon: 16,
          title: 12,
          description: 10,
        };
      case 'medium':
        return {
          container: { padding: 12, borderRadius: 16 },
          icon: 20,
          title: 14,
          description: 12,
        };
      case 'large':
        return {
          container: { padding: 16, borderRadius: 20 },
          icon: 24,
          title: 16,
          description: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getContainerStyle = (): ViewStyle => ({
    backgroundColor: earned ? backgroundColor : '#F5F5F5',
    borderWidth: 2,
    borderColor: earned ? color : '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: earned ? 1 : 0.6,
    ...sizeStyles.container,
    ...style,
  });

  const getIconStyle = (): ViewStyle => ({
    marginBottom: 8,
    opacity: earned ? 1 : 0.5,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: sizeStyles.title,
    fontWeight: 'bold',
    color: earned ? '#212121' : '#9E9E9E',
    textAlign: 'center',
    marginBottom: 4,
  });

  const getDescriptionStyle = (): TextStyle => ({
    fontSize: sizeStyles.description,
    color: earned ? '#757575' : '#9E9E9E',
    textAlign: 'center',
    lineHeight: sizeStyles.description + 4,
  });

  const getProgressStyle = (): ViewStyle => ({
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  });

  const getProgressBarStyle = (): ViewStyle => ({
    height: '100%',
    backgroundColor: color,
    borderRadius: 2,
    width: `${progress || 0}%`,
  });

  const renderContent = () => (
    <View style={getContainerStyle()}>
      {icon && (
        <View style={getIconStyle()}>
          <Ionicons
            name={icon}
            size={sizeStyles.icon}
            color={earned ? color : '#9E9E9E'}
          />
        </View>
      )}
      
      <Text style={getTitleStyle()}>{title}</Text>
      
      {description && (
        <Text style={getDescriptionStyle()}>{description}</Text>
      )}
      
      {!earned && progress !== undefined && (
        <View style={getProgressStyle()}>
          <View style={getProgressBarStyle()} />
        </View>
      )}
      
      {earned && (
        <View style={{ marginTop: 8 }}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={color}
          />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
}

