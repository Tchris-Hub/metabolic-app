import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  rightIcon,
  onRightIconPress,
  maxLength,
  style,
  inputStyle,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
    ...style,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: disabled ? '#F5F5F5' : 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: error ? '#F44336' : isFocused ? '#4CAF50' : '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? 80 : 48,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: disabled ? '#9E9E9E' : '#212121',
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: error ? '#F44336' : '#424242',
    marginBottom: 8,
  });

  const getHelperTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: error ? '#F44336' : '#757575',
    marginTop: 4,
  });

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <Ionicons
        name={icon}
        size={20}
        color={isFocused ? '#4CAF50' : '#9E9E9E'}
        style={{ marginRight: 12 }}
      />
    );
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={handlePasswordToggle} style={{ padding: 4 }}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#9E9E9E"
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon && onRightIconPress) {
      return (
        <TouchableOpacity onPress={onRightIconPress} style={{ padding: 4 }}>
          <Ionicons
            name={rightIcon}
            size={20}
            color="#9E9E9E"
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: '#F44336' }}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {renderIcon()}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {renderRightIcon()}
      </View>
      
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;

