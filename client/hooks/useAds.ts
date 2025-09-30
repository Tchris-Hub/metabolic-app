import { useState, useEffect, useCallback } from 'react';
import { AdManager, AdConfig, AdReward } from '../services/ads/adManager';

export const useAds = () => {
  const [adManager, setAdManager] = useState<AdManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeAds = useCallback(async (config: AdConfig) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const manager = AdManager.getInstance();
      await manager.initialize(config);
      
      setAdManager(manager);
      setIsInitialized(true);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadBannerAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.loadBannerAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to load banner ad');
      }
      
      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const showBannerAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.showBannerAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to show banner ad');
      }
      
      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const loadInterstitialAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.loadInterstitialAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to load interstitial ad');
      }
      
      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const showInterstitialAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.showInterstitialAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to show interstitial ad');
      }
      
      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const loadRewardedAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.loadRewardedAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to load rewarded ad');
      }
      
      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const showRewardedAd = useCallback(async (): Promise<AdReward | null> => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await adManager.showRewardedAd();
      if (!result.success) {
        throw new Error(result.error || 'Failed to show rewarded ad');
      }
      
      return result.reward || null;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [adManager]);

  const hideBannerAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      await adManager.hideBannerAd();
    } catch (error) {
      setError(error as string);
      throw error;
    }
  }, [adManager]);

  const destroyBannerAd = useCallback(async () => {
    if (!adManager) {
      throw new Error('AdManager not initialized');
    }
    
    try {
      await adManager.destroyBannerAd();
    } catch (error) {
      setError(error as string);
      throw error;
    }
  }, [adManager]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAdLoaded = useCallback((type: 'banner' | 'interstitial' | 'rewarded') => {
    if (!adManager) return false;
    return adManager.isAdLoaded(type);
  }, [adManager]);

  const isReady = useCallback(() => {
    if (!adManager) return false;
    return adManager.isReady();
  }, [adManager]);

  // Event handlers
  const setBannerAdEventHandlers = useCallback((handlers: {
    onLoaded?: () => void;
    onFailedToLoad?: (error: string) => void;
    onClicked?: () => void;
    onClosed?: () => void;
  }) => {
    if (!adManager) return;
    
    adManager.onBannerAdLoaded = handlers.onLoaded;
    adManager.onBannerAdFailedToLoad = handlers.onFailedToLoad;
    adManager.onBannerAdClicked = handlers.onClicked;
    adManager.onBannerAdClosed = handlers.onClosed;
  }, [adManager]);

  const setInterstitialAdEventHandlers = useCallback((handlers: {
    onLoaded?: () => void;
    onFailedToLoad?: (error: string) => void;
    onClicked?: () => void;
    onClosed?: () => void;
  }) => {
    if (!adManager) return;
    
    adManager.onInterstitialAdLoaded = handlers.onLoaded;
    adManager.onInterstitialAdFailedToLoad = handlers.onFailedToLoad;
    adManager.onInterstitialAdClicked = handlers.onClicked;
    adManager.onInterstitialAdClosed = handlers.onClosed;
  }, [adManager]);

  const setRewardedAdEventHandlers = useCallback((handlers: {
    onLoaded?: () => void;
    onFailedToLoad?: (error: string) => void;
    onClicked?: () => void;
    onClosed?: () => void;
    onEarned?: (reward: AdReward) => void;
  }) => {
    if (!adManager) return;
    
    adManager.onRewardedAdLoaded = handlers.onLoaded;
    adManager.onRewardedAdFailedToLoad = handlers.onFailedToLoad;
    adManager.onRewardedAdClicked = handlers.onClicked;
    adManager.onRewardedAdClosed = handlers.onClosed;
    adManager.onRewardedAdEarned = handlers.onEarned;
  }, [adManager]);

  return {
    // State
    isInitialized,
    isLoading,
    error,
    
    // Actions
    initializeAds,
    loadBannerAd,
    showBannerAd,
    loadInterstitialAd,
    showInterstitialAd,
    loadRewardedAd,
    showRewardedAd,
    hideBannerAd,
    destroyBannerAd,
    clearError,
    
    // Utilities
    isAdLoaded,
    isReady,
    
    // Event handlers
    setBannerAdEventHandlers,
    setInterstitialAdEventHandlers,
    setRewardedAdEventHandlers,
  };
};

