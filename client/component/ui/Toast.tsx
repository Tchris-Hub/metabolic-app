import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast, ToastConfig } from '../../contexts/ToastContext';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ToastIconConfig {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
}

const getToastConfig = (type: ToastConfig['type'], isDarkMode: boolean): ToastIconConfig => {
  const configs: Record<ToastConfig['type'], ToastIconConfig> = {
    success: {
      name: 'checkmark-circle',
      color: isDarkMode ? '#34D399' : '#10B981',
      backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.15)' : 'rgba(16, 185, 129, 0.1)',
    },
    error: {
      name: 'close-circle',
      color: isDarkMode ? '#F87171' : '#EF4444',
      backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.15)' : 'rgba(239, 68, 68, 0.1)',
    },
    warning: {
      name: 'warning',
      color: isDarkMode ? '#FBBF24' : '#F59E0B',
      backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.1)',
    },
    info: {
      name: 'information-circle',
      color: isDarkMode ? '#60A5FA' : '#3B82F6',
      backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)',
    },
  };
  return configs[type];
};

export default function Toast() {
  const { toast, hideToast } = useToast();
  const { isDarkMode, colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast?.visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast?.visible, translateY, opacity]);

  if (!toast) return null;

  const config = getToastConfig(toast.type, isDarkMode);
  const isError = toast.type === 'error';
  const topOffset = toast.position === 'top' 
    ? insets.top + (Platform.OS === 'ios' ? 10 : 20)
    : undefined;
  const bottomOffset = toast.position === 'bottom'
    ? insets.bottom + 20
    : undefined;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          top: toast.position === 'top' ? topOffset : undefined,
          bottom: toast.position === 'bottom' ? bottomOffset : undefined,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: isDarkMode ? '#000' : '#1F2937',
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${toast.type}: ${toast.message}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
        <Ionicons name={config.name} size={20} color={config.color} />
      </View>
      
      <Text 
        style={[styles.message, { color: colors.text }]}
        numberOfLines={2}
      >
        {toast.message}
      </Text>
      
      {isError && (
        <TouchableOpacity
          onPress={hideToast}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          accessibilityHint="Tap to close this notification"
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxWidth: SCREEN_WIDTH - 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
