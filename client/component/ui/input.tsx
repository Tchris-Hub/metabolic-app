import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInputAccessibilityProps } from '../../utils/accessibilityUtils';
import { useTheme } from '../../context/ThemeContext';

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
  accessibilityHint?: string;
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
  accessibilityHint,
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
    ...style,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: disabled ? colors.surfaceSecondary : colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: error ? colors.error : isFocused ? colors.success : colors.border,
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? 80 : 48,
    opacity: disabled ? 0.6 : 1,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: disabled ? colors.textTertiary : colors.text,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: error ? colors.error : colors.text,
    marginBottom: 8,
  });

  const getHelperTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: error ? colors.error : colors.textSecondary,
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
        color={isFocused ? colors.success : colors.textTertiary}
        style={{ marginRight: 12 }}
      />
    );
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity 
          onPress={handlePasswordToggle} 
          style={{ padding: 4 }}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon && onRightIconPress) {
      return (
        <TouchableOpacity 
          onPress={onRightIconPress} 
          style={{ padding: 4 }}
          accessibilityRole="button"
          accessibilityLabel="Input action"
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  // Get accessibility props
  const a11yProps = getInputAccessibilityProps({
    label,
    placeholder,
    hint: accessibilityHint,
    disabled,
    error,
  });

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {renderIcon()}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
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
          {...a11yProps}
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
