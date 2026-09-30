import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getStoredToken, removeStoredToken } from '@/services/api';
import { citizenService } from '@/services/citizenService';
import { useComplaintStore } from '@/store/useComplaintStore';
import { colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = await getStoredToken();
        if (!token) {
          if (isMounted) router.replace('/login');
          return;
        }

        // Validate token by fetching profile
        const profile = await citizenService.getProfile();
        if (profile && isMounted) {
          useComplaintStore.getState().setProfileFromApi(profile);
          router.replace('/home');
          return;
        }
      } catch (err: any) {
        console.log('[Index] Auth validation error:', err?.response?.status || err?.message);
        if (err?.response?.status === 401) {
          await removeStoredToken();
          if (isMounted) router.replace('/login');
          return;
        }
        // If it's a network glitch, still take them to home if token is present
        const token = await getStoredToken();
        if (token && isMounted) {
          router.replace('/home');
          return;
        }
      }

      if (isMounted) {
        router.replace('/login');
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
