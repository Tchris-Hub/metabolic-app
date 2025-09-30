import { useState, useEffect, useCallback } from 'react';
import { NotificationService, PushNotification } from '../services/firebase/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const granted = await NotificationService.requestPermission();
      setPermission(granted);
      
      return granted;
    } catch (error) {
      setError(error as string);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFCMToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await NotificationService.getFCMToken();
      return token;
    } catch (error) {
      setError(error as string);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subscribeToTopic = useCallback(async (topic: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.subscribeToTopic(topic);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribeFromTopic = useCallback(async (topic: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.unsubscribeFromTopic(topic);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setupForegroundListener = useCallback((onNotification: (notification: PushNotification) => void) => {
    try {
      const unsubscribe = NotificationService.setupForegroundListener((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        onNotification(notification);
      });
      
      return unsubscribe;
    } catch (error) {
      setError(error as string);
      return () => {};
    }
  }, []);

  const scheduleLocalNotification = useCallback(async (
    title: string,
    body: string,
    data?: Record<string, string>,
    delay?: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.scheduleLocalNotification(title, body, data, delay);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelLocalNotification = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.cancelLocalNotification(notificationId);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getScheduledNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const scheduled = await NotificationService.getScheduledNotifications();
      return scheduled;
    } catch (error) {
      setError(error as string);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.clearAllNotifications();
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Health-specific notification methods
  const scheduleMedicationReminder = useCallback(async (
    medicationName: string,
    time: Date,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.scheduleMedicationReminder(medicationName, time, userId);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleBloodSugarReminder = useCallback(async (
    time: Date,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.scheduleBloodSugarReminder(time, userId);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleExerciseReminder = useCallback(async (
    time: Date,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.scheduleExerciseReminder(time, userId);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleHydrationReminder = useCallback(async (
    time: Date,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await NotificationService.scheduleHydrationReminder(time, userId);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper functions
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const getNotificationsByType = useCallback((type: 'reminder' | 'achievement' | 'tip' | 'general') => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getRecentNotifications = useCallback((hours: number = 24) => {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    return notifications.filter(notification => 
      new Date(notification.timestamp) >= cutoffTime
    );
  }, [notifications]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    permission,
    
    // Actions
    requestPermission,
    getFCMToken,
    subscribeToTopic,
    unsubscribeFromTopic,
    setupForegroundListener,
    scheduleLocalNotification,
    cancelLocalNotification,
    getScheduledNotifications,
    markNotificationAsRead,
    clearAllNotifications,
    clearError,
    
    // Health-specific actions
    scheduleMedicationReminder,
    scheduleBloodSugarReminder,
    scheduleExerciseReminder,
    scheduleHydrationReminder,
    
    // Helper functions
    getUnreadNotifications,
    getNotificationsByType,
    getRecentNotifications,
  };
};

