import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../ui/Input';

interface ReadingInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  maxLength?: number;
  status?: 'good' | 'warning' | 'danger';
  helperText?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function ReadingInput({
  label,
  value,
  onChangeText,
  unit,
  placeholder,
  keyboardType = 'numeric',
  maxLength,
  status = 'good',
  helperText,
  error,
  disabled = false,
  style,
}: ReadingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getStatusColor = (): string => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
    ...style,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: disabled ? '#F5F5F5' : 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: error ? '#F44336' : isFocused ? getStatusColor() : '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: disabled ? '#9E9E9E' : '#212121',
    textAlign: 'center',
  });

  const getUnitStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#757575',
    marginLeft: 8,
    fontWeight: '500',
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: error ? '#F44336' : '#424242',
    marginBottom: 8,
    textAlign: 'center',
  });

  const getHelperTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: error ? '#F44336' : '#757575',
    marginTop: 4,
    textAlign: 'center',
  });

  const getStatusIndicatorStyle = (): ViewStyle => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: getStatusColor(),
    marginRight: 8,
  });

  return (
    <View style={getContainerStyle()}>
      {/* Label with status indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <View style={getStatusIndicatorStyle()} />
        <Text style={getLabelStyle()}>{label}</Text>
      </View>

      {/* Input with unit */}
      <View style={getInputContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Text style={getUnitStyle()}>{unit}</Text>
      </View>

      {/* Helper text or error */}
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

