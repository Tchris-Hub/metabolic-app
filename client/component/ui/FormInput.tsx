import React, { useState, forwardRef, useCallback, useEffect, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, ViewStyle, TextStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInputAccessibilityProps } from '../../utils/accessibilityUtils';
import { ValidationResult, PasswordStrength, validateEmail, calculatePasswordStrength } from '../../utils/validationUtils';
import { useTheme } from '../../context/ThemeContext';

export type ValidationType = 'email' | 'password' | 'custom' | 'none';

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  accessibilityHint?: string;
  // Validation props
  validationType?: ValidationType;
  customValidator?: (value: string) => ValidationResult;
  onValidationChange?: (result: ValidationResult) => void;
  showPasswordStrength?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}


const FormInput = forwardRef<TextInput, FormInputProps>(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  required = false,
  icon,
  maxLength,
  style,
  inputStyle,
  accessibilityHint,
  validationType = 'none',
  customValidator,
  onValidationChange,
  showPasswordStrength = false,
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Validation function
  const validate = useCallback((text: string): ValidationResult => {
    if (required && (!text || text.trim().length === 0)) {
      return { isValid: false, error: `${label || 'This field'} is required` };
    }

    switch (validationType) {
      case 'email':
        return validateEmail(text);
      case 'password':
        const strength = calculatePasswordStrength(text);
        setPasswordStrength(strength);
        if (text.length > 0 && strength.level === 'weak') {
          return { isValid: false, error: 'Password is too weak' };
        }
        return { isValid: true };
      case 'custom':
        if (customValidator) {
          return customValidator(text);
        }
        return { isValid: true };
      default:
        return { isValid: true };
    }
  }, [validationType, customValidator, required, label]);


  // Debounced validation
  const debouncedValidate = useCallback((text: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      const result = validate(text);
      setValidationResult(result);
      onValidationChange?.(result);
    }, debounceMs);
  }, [validate, debounceMs, onValidationChange]);

  // Handle text change
  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
    
    if (validateOnChange && hasBeenTouched) {
      debouncedValidate(text);
    }
    
    // Update password strength in real-time
    if (showPasswordStrength && validationType === 'password') {
      setPasswordStrength(calculatePasswordStrength(text));
    }
  }, [onChangeText, validateOnChange, hasBeenTouched, debouncedValidate, showPasswordStrength, validationType]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHasBeenTouched(true);
    
    if (validateOnBlur) {
      const result = validate(value);
      setValidationResult(result);
      onValidationChange?.(result);
      
      // Shake animation on error
      if (!result.isValid) {
        Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
      }
    }
  }, [validateOnBlur, validate, value, onValidationChange, shakeAnimation]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);


  // Determine validation state for styling
  const isValid = validationResult?.isValid ?? true;
  const hasError = hasBeenTouched && !isValid;
  const showSuccess = hasBeenTouched && isValid && value.length > 0;

  // Styles using theme colors
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
    borderColor: hasError ? colors.error : showSuccess ? colors.success : isFocused ? colors.info : colors.border,
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
    color: hasError ? colors.error : colors.text,
    marginBottom: 8,
  });

  // Render validation icon
  const renderValidationIcon = () => {
    if (!hasBeenTouched || value.length === 0) return null;
    
    if (hasError) {
      return (
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.error}
          style={{ marginLeft: 8 }}
          accessibilityLabel="Invalid input"
        />
      );
    }
    
    if (showSuccess) {
      return (
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={colors.success}
          style={{ marginLeft: 8 }}
          accessibilityLabel="Valid input"
        />
      );
    }
    
    return null;
  };


  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (!showPasswordStrength || !passwordStrength || value.length === 0) return null;
    
    const getStrengthColor = () => {
      switch (passwordStrength.level) {
        case 'weak': return colors.error;
        case 'fair': return colors.warning;
        case 'good': return colors.success;
        case 'strong': return colors.success;
        default: return colors.border;
      }
    };
    
    const getStrengthWidth = () => {
      return `${passwordStrength.score}%`;
    };
    
    return (
      <View style={{ marginTop: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginRight: 8 }}>
            Strength:
          </Text>
          <Text style={{ fontSize: 12, color: getStrengthColor(), fontWeight: '600', textTransform: 'capitalize' }}>
            {passwordStrength.level}
          </Text>
        </View>
        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              width: `${passwordStrength.score}%` as any,
              backgroundColor: getStrengthColor(),
              borderRadius: 2,
            }}
          />
        </View>
        {passwordStrength.suggestions.length > 0 && passwordStrength.level !== 'strong' && (
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
            {passwordStrength.suggestions[0]}
          </Text>
        )}
      </View>
    );
  };

  // Render left icon
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <Ionicons
        name={icon}
        size={20}
        color={isFocused ? colors.info : colors.textTertiary}
        style={{ marginRight: 12 }}
      />
    );
  };

  // Render password toggle
  const renderPasswordToggle = () => {
    if (!secureTextEntry) return null;
    
    return (
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
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
  };

  // Get accessibility props
  const a11yProps = getInputAccessibilityProps({
    label,
    placeholder,
    hint: accessibilityHint,
    disabled,
    error: hasError ? validationResult?.error : undefined,
  });


  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      
      <Animated.View style={[getInputContainerStyle(), { transform: [{ translateX: shakeAnimation }] }]}>
        {renderIcon()}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...a11yProps}
        />
        
        {renderValidationIcon()}
        {renderPasswordToggle()}
      </Animated.View>
      
      {hasError && validationResult?.error && (
        <Text style={{ fontSize: 12, color: colors.error, marginTop: 4 }}>
          {validationResult.error}
        </Text>
      )}
      
      {renderPasswordStrength()}
    </View>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
