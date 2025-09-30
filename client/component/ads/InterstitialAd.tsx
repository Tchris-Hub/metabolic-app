import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InterstitialAdProps {
  adUnitId: string;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: string) => void;
  onAdClosed?: () => void;
  onAdClicked?: () => void;
  showAd: boolean;
  onClose: () => void;
}

export default function InterstitialAd({
  adUnitId,
  onAdLoaded,
  onAdFailedToLoad,
  onAdClosed,
  onAdClicked,
  showAd,
  onClose,
}: InterstitialAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showAd) {
      setIsLoading(true);
      setError(null);
      
      // Simulate ad loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsLoaded(true);
        onAdLoaded?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAd, onAdLoaded]);

  const getModalStyle = (): ViewStyle => ({
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const getAdContainerStyle = (): ViewStyle => ({
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '90%',
  });

  const getLoadingStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  });

  const getLoadingTextStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#757575',
    marginLeft: 12,
  });

  const getAdContentStyle = (): ViewStyle => ({
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  });

  const getAdTitleStyle = (): TextStyle => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  });

  const getAdDescriptionStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  });

  const getAdButtonStyle = (): ViewStyle => ({
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  });

  const getAdButtonTextStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  });

  const getCloseButtonStyle = (): ViewStyle => ({
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  });

  const getErrorStyle = (): ViewStyle => ({
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  });

  const getErrorTextStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  });

  const getRetryButtonStyle = (): ViewStyle => ({
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  });

  const getRetryButtonTextStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  });

  const handleAdClick = () => {
    onAdClicked?.();
  };

  const handleClose = () => {
    onAdClosed?.();
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIsLoaded(false);
  };

  if (!showAd) {
    return null;
  }

  return (
    <Modal
      visible={showAd}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={getModalStyle()}>
        <View style={getAdContainerStyle()}>
          <TouchableOpacity onPress={handleClose} style={getCloseButtonStyle()}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>

          {isLoading && (
            <View style={getLoadingStyle()}>
              <Ionicons name="refresh" size={24} color="#757575" />
              <Text style={getLoadingTextStyle()}>Loading ad...</Text>
            </View>
          )}

          {error && (
            <View style={getErrorStyle()}>
              <Ionicons name="warning" size={48} color="#F44336" />
              <Text style={getErrorTextStyle()}>Ad failed to load</Text>
              <TouchableOpacity onPress={handleRetry} style={getRetryButtonStyle()}>
                <Text style={getRetryButtonTextStyle()}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoaded && !error && (
            <View style={getAdContentStyle()}>
              <Ionicons name="megaphone" size={48} color="#2196F3" />
              <Text style={getAdTitleStyle()}>Advertisement</Text>
              <Text style={getAdDescriptionStyle()}>
                This is a sample interstitial ad. In a real app, this would show an actual advertisement.
              </Text>
              <TouchableOpacity onPress={handleAdClick} style={getAdButtonStyle()}>
                <Text style={getAdButtonTextStyle()}>Learn More</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

