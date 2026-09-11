import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { citizenService } from './citizenService';
import { getStoredToken } from './api';

const FCM_TOKEN_STORAGE_KEY = '@citizen_fcm_token';

// Configure foreground presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const pushNotificationService = {
  /**
   * Initializes notification channels and registers FCM token with backend
   */
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    try {
      // 1. Android Notification Channel configuration
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'General Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1A3B5C',
          enableLights: true,
          enableVibrate: true,
        });
      }

      // 2. Request user permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[Push] Notification permission not granted');
        return null;
      }

      // 3. Obtain native FCM Device Push Token
      let fcmToken: string | null = null;
      try {
        const devicePushToken = await Notifications.getDevicePushTokenAsync();
        fcmToken = devicePushToken.data;
        console.log('[Push] Native FCM Device Push Token obtained:', fcmToken);
      } catch (fcmError) {
        console.warn('[Push] Native FCM token retrieval warning, trying expo fallback:', (fcmError as Error).message);
        try {
          const expoToken = await Notifications.getExpoPushTokenAsync();
          fcmToken = expoToken.data;
        } catch (expoErr) {
          console.error('[Push] Could not retrieve push token:', (expoErr as Error).message);
        }
      }

      if (!fcmToken) {
        return null;
      }

      // 4. Cache token locally
      await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, fcmToken);

      // 5. If user is logged in, sync token to backend
      const authToken = await getStoredToken();
      if (authToken) {
        try {
          await citizenService.registerFcmToken(fcmToken, Platform.OS);
          console.log('[Push] FCM token synced with backend successfully.');
        } catch (syncErr) {
          console.warn('[Push] Could not sync token with backend:', (syncErr as Error).message);
        }
      }

      return fcmToken;
    } catch (error) {
      console.error('[Push] Error in registerForPushNotificationsAsync:', (error as Error).message);
      return null;
    }
  },

  /**
   * Syncs cached FCM token to backend immediately after login
   */
  syncTokenOnLogin: async (): Promise<void> => {
    try {
      let token = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (!token) {
        token = await pushNotificationService.registerForPushNotificationsAsync();
      }
      if (token) {
        await citizenService.registerFcmToken(token, Platform.OS);
        console.log('[Push] FCM token synced on user login.');
      }
    } catch (err) {
      console.warn('[Push] Failed to sync token on login:', (err as Error).message);
    }
  },

  /**
   * Sets up foreground notification listener and user interaction handler
   */
  setupNotificationListeners: (onNotificationReceived?: () => void) => {
    // Listener when notification arrives in foreground
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('[Push] Foreground notification received:', notification.request.content);
      if (onNotificationReceived) {
        onNotificationReceived();
      }
    });

    // Listener when user taps a notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[Push] User interacted with notification:', response.notification.request.content);
      const data = response.notification.request.content.data;

      if (data) {
        const type = data.type;
        if (type === 'COMPLAINT_STATUS') {
          // Navigate to complaints tab
          router.replace({ pathname: '/home', params: { tab: 'complaints' } });
        } else if (type === 'NEW_UPDATE') {
          // Navigate to updates tab
          router.replace({ pathname: '/home', params: { tab: 'updates' } });
        } else {
          // Navigate to notifications tab
          router.replace({ pathname: '/home', params: { tab: 'notifications' } });
        }
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  },
};
