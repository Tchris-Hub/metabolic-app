import React, { useEffect, useRef } from 'react';
import { 
  Modal as RNModal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Animated, 
  Dimensions,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'slide',
  style,
  titleStyle,
}: ModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (animationType === 'slide') {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === 'slide') {
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (animationType === 'fade') {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, animationType, slideAnim, fadeAnim]);

  const getModalSize = (): ViewStyle => {
    const sizeStyles: Record<string, ViewStyle> = {
      small: { 
        maxHeight: SCREEN_HEIGHT * 0.4,
        width: '80%' as any,
        borderRadius: 16,
      },
      medium: { 
        maxHeight: SCREEN_HEIGHT * 0.7,
        width: '90%' as any,
        borderRadius: 20,
      },
      large: { 
        maxHeight: SCREEN_HEIGHT * 0.9,
        width: '95%' as any,
        borderRadius: 24,
      },
      fullscreen: { 
        height: SCREEN_HEIGHT,
        width: '100%' as any,
        borderRadius: 0,
      },
    };

    return sizeStyles[size] || sizeStyles.medium;
  };

  const getContainerStyle = (): ViewStyle => ({
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  });

  const getModalStyle = (): ViewStyle => ({
    backgroundColor: 'white',
    ...getModalSize(),
    ...style,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
    ...titleStyle,
  });

  const renderContent = () => {
    const content = (
      <View style={getModalStyle()}>
        {title && <Text style={getTitleStyle()}>{title}</Text>}
        {children}
        {showCloseButton && (
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#F5F5F5',
            }}
          >
            <Ionicons name="close" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
    );

    if (animationType === 'slide') {
      return (
        <Animated.View
          style={[
            getModalStyle(),
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {title && <Text style={getTitleStyle()}>{title}</Text>}
          {children}
          {showCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#F5F5F5',
              }}
            >
              <Ionicons name="close" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    }

    if (animationType === 'fade') {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          {content}
        </Animated.View>
      );
    }

    return content;
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
        <View style={getContainerStyle()}>
          <TouchableWithoutFeedback>
            <View>
              {renderContent()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

