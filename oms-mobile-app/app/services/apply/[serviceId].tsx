import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function ServiceApplyRedirect() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();

  useEffect(() => {
    if (serviceId) {
      router.replace(`/services/appointment/${serviceId}` as any);
    } else {
      router.replace('/services' as any);
    }
  }, [serviceId]);

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
