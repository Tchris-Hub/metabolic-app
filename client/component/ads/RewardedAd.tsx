import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RewardedAdProps {
  adUnitId: string;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: string) => void;
  onAdClosed?: () => void;
  onAdClicked?: () => void;
  onRewarded?: (reward: { type: string; amount: number }) => void;
  showAd: boolean;
  onClose: () => void;
  rewardType?: string;
  rewardAmount?: number;
}

export default function RewardedAd({
  adUnitId,
  onAdLoaded,
  onAdFailedToLoad,
  onAdClosed,
  onAdClicked,
  onRewarded,
  showAd,
  onClose,
  rewardType = 'coins',
  rewardAmount = 10,
}: RewardedAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  useEffect(() => {
    if (showAd) {
      setIsLoading(true);
      setError(null);
      setIsWatching(false);
      setWatchProgress(0);
      
      // Simulate ad loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsLoaded(true);
        onAdLoaded?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAd, onAdLoaded]);

  useEffect(() => {
    if (isWatching) {
      const interval = setInterval(() => {
        setWatchProgress(prev => {
          if (prev >= 100) {
            setIsWatching(false);
            onRewarded?.({ type: rewardType, amount: rewardAmount });
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isWatching, onRewarded, rewardType, rewardAmount]);

  const getModalStyle = (): ViewStyle => ({
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const getAdContainerStyle = (): ViewStyle => ({
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
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

  const getRewardIconStyle = (): ViewStyle => ({
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  });

  const getAdTitleStyle = (): TextStyle => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  });

  const getAdDescriptionStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  });

  const getRewardTextStyle = (): TextStyle => ({
    fontSize: 18,
    fontWeight: '600',
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 20,
  });

  const getWatchButtonStyle = (): ViewStyle => ({
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    minWidth: 200,
  });

  const getWatchButtonTextStyle = (): TextStyle => ({
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  });

  const getProgressStyle = (): ViewStyle => ({
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  });

  const getProgressBarStyle = (): ViewStyle => ({
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    width: `${watchProgress}%`,
  });

  const getProgressTextStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
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

  const handleWatchAd = () => {
    setIsWatching(true);
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
              <View style={getRewardIconStyle()}>
                <Ionicons name="gift" size={40} color="#FF9800" />
              </View>
              
              <Text style={getAdTitleStyle()}>Watch Ad for Reward</Text>
              <Text style={getAdDescriptionStyle()}>
                Watch a short advertisement to earn {rewardAmount} {rewardType}!
              </Text>
              
              <Text style={getRewardTextStyle()}>
                Reward: {rewardAmount} {rewardType}
              </Text>

              {isWatching ? (
                <>
                  <View style={getProgressStyle()}>
                    <View style={getProgressBarStyle()} />
                  </View>
                  <Text style={getProgressTextStyle()}>
                    Watching ad... {watchProgress}%
                  </Text>
                </>
              ) : (
                <TouchableOpacity onPress={handleWatchAd} style={getWatchButtonStyle()}>
                  <Text style={getWatchButtonTextStyle()}>Watch Ad</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

