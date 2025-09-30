import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  timestamp: Date;
  read: boolean;
  type: 'reminder' | 'achievement' | 'tip' | 'general';
}

export class NotificationService {
  static async getFCMToken(): Promise<string | null> {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  static async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  static async subscribeToTopic(topic: string): Promise<void> {
    try {
      // In a real implementation, you would call your backend API
      // to subscribe the user to the topic
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      throw new Error(`Failed to subscribe to topic: ${error}`);
    }
  }

  static async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      // In a real implementation, you would call your backend API
      // to unsubscribe the user from the topic
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      throw new Error(`Failed to unsubscribe from topic: ${error}`);
    }
  }

  static setupForegroundListener(
    onNotification: (notification: PushNotification) => void
  ): () => void {
    try {
      const messaging = getMessaging();
      
      const unsubscribe = onMessage(messaging, (payload) => {
        const notification: PushNotification = {
          id: payload.messageId || Date.now().toString(),
          title: payload.notification?.title || 'Notification',
          body: payload.notification?.body || '',
          data: payload.data as Record<string, string>,
          imageUrl: payload.notification?.image,
          timestamp: new Date(),
          read: false,
          type: (payload.data?.type as any) || 'general',
        };

        onNotification(notification);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to setup foreground listener:', error);
      return () => {};
    }
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, string>,
    delay?: number
  ): Promise<void> {
    try {
      // In a real implementation, you would use a library like expo-notifications
      // to schedule local notifications
      console.log('Scheduling local notification:', { title, body, data, delay });
    } catch (error) {
      throw new Error(`Failed to schedule local notification: ${error}`);
    }
  }

  static async cancelLocalNotification(notificationId: string): Promise<void> {
    try {
      // In a real implementation, you would cancel the scheduled notification
      console.log('Canceling local notification:', notificationId);
    } catch (error) {
      throw new Error(`Failed to cancel local notification: ${error}`);
    }
  }

  static async getScheduledNotifications(): Promise<PushNotification[]> {
    try {
      // In a real implementation, you would get the list of scheduled notifications
      return [];
    } catch (error) {
      throw new Error(`Failed to get scheduled notifications: ${error}`);
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      // In a real implementation, you would update the notification status in your database
      console.log('Marking notification as read:', notificationId);
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error}`);
    }
  }

  static async clearAllNotifications(): Promise<void> {
    try {
      // In a real implementation, you would clear all notifications
      console.log('Clearing all notifications');
    } catch (error) {
      throw new Error(`Failed to clear notifications: ${error}`);
    }
  }

  // Health-specific notification methods
  static async scheduleMedicationReminder(
    medicationName: string,
    time: Date,
    userId: string
  ): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Medication Reminder',
        `Time to take your ${medicationName}`,
        { type: 'medication', medicationName, userId },
        time.getTime() - Date.now()
      );
    } catch (error) {
      throw new Error(`Failed to schedule medication reminder: ${error}`);
    }
  }

  static async scheduleBloodSugarReminder(
    time: Date,
    userId: string
  ): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Blood Sugar Check',
        'Time to check your blood sugar levels',
        { type: 'bloodSugar', userId },
        time.getTime() - Date.now()
      );
    } catch (error) {
      throw new Error(`Failed to schedule blood sugar reminder: ${error}`);
    }
  }

  static async scheduleExerciseReminder(
    time: Date,
    userId: string
  ): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Exercise Time',
        'Time for your daily exercise routine',
        { type: 'exercise', userId },
        time.getTime() - Date.now()
      );
    } catch (error) {
      throw new Error(`Failed to schedule exercise reminder: ${error}`);
    }
  }

  static async scheduleHydrationReminder(
    time: Date,
    userId: string
  ): Promise<void> {
    try {
      await this.scheduleLocalNotification(
        'Stay Hydrated',
        'Remember to drink water throughout the day',
        { type: 'hydration', userId },
        time.getTime() - Date.now()
      );
    } catch (error) {
      throw new Error(`Failed to schedule hydration reminder: ${error}`);
    }
  }
}

