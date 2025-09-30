import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BannerAdProps {
  adUnitId: string;
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: string) => void;
  onAdClicked?: () => void;
  style?: ViewStyle;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function BannerAd({
  adUnitId,
  size = 'banner',
  onAdLoaded,
  onAdFailedToLoad,
  onAdClicked,
  style,
  showCloseButton = false,
  onClose,
}: BannerAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
      onAdLoaded?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onAdLoaded]);

  const getSizeStyles = () => {
    switch (size) {
      case 'banner':
        return { width: 320, height: 50 };
      case 'largeBanner':
        return { width: 320, height: 100 };
      case 'mediumRectangle':
        return { width: 300, height: 250 };
    }
  };

  const sizeStyles = getSizeStyles();

  const getContainerStyle = (): ViewStyle => ({
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...sizeStyles,
    ...style,
  });

  const getLoadingStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const getLoadingTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
  });

  const getAdContentStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  });

  const getAdTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
  });

  const getCloseButtonStyle = (): ViewStyle => ({
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  });

  const getErrorStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  });

  const getErrorTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#F44336',
    textAlign: 'center',
  });

  const handleAdClick = () => {
    onAdClicked?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  if (error) {
    return (
      <View style={getContainerStyle()}>
        <View style={getErrorStyle()}>
          <Ionicons name="warning" size={16} color="#F44336" />
          <Text style={getErrorTextStyle()}>Ad failed to load</Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={getContainerStyle()}>
        <View style={getLoadingStyle()}>
          <Ionicons name="refresh" size={16} color="#757575" />
          <Text style={getLoadingTextStyle()}>Loading ad...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={getContainerStyle()}>
      {showCloseButton && (
        <TouchableOpacity onPress={handleClose} style={getCloseButtonStyle()}>
          <Ionicons name="close" size={12} color="white" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={handleAdClick} activeOpacity={0.8}>
        <View style={getAdContentStyle()}>
          <Ionicons name="megaphone" size={16} color="#2196F3" />
          <Text style={getAdTextStyle()}>
            Advertisement
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

