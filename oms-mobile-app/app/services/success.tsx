import React, { useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckIcon } from 'react-native-heroicons/solid';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';
import { usePopularServicesStore } from '@/store/usePopularServicesStore';

export default function ServiceSubmissionSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ requestId?: string }>();
  const requestId = params.requestId ? String(params.requestId) : '';

  const getAppointmentById = usePopularServicesStore((s) => s.getAppointmentById);

  // Retrieve exact submitted request using its request ID
  const appointment = requestId ? getAppointmentById(requestId) : undefined;
  const displayRequestId = appointment?.appointmentId || requestId || '—';

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/home');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const now = new Date();
  const fallbackDate = `${now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}, ${now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()}`;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className={containerClass}>
        <Header
          showBack
          title="Request Submitted"
          onBack={() => router.replace('/home')}
        />

        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-6 shadow-sm">
              <CheckIcon size={48} color={colors.surface} />
            </View>

            <Text className="text-2xl font-inter-bold text-dark mb-3 text-center px-4">
              Appointment request sent
            </Text>

            <Text className="text-sm font-inter text-muted text-center leading-5 px-2">
              Your appointment request details have been recorded. Keep the request number to follow its progress.
            </Text>
          </View>

          {/* Request Number Card */}
          <View 
            className="w-full rounded-2xl p-6 items-center border border-primary/30" 
            style={{ backgroundColor: 'rgba(244, 194, 55, 0.08)' }}
          >
            <Text className="text-muted text-xs font-inter-medium mb-1">
              Request number
            </Text>
            <Text className="text-dark text-xl font-inter-bold mb-1">
              {displayRequestId}
            </Text>
            <Text className="text-muted text-xs font-inter mt-1">
              Submitted on {appointment?.formattedDate || fallbackDate}
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-6 py-4 border-t border-border bg-background space-y-3">
          <Button
            title="View my request"
            variant="primary"
            onPress={() => {
              if (displayRequestId && displayRequestId !== '—') {
                router.push({
                  pathname: '/services/request/[requestId]' as any,
                  params: { requestId: displayRequestId },
                });
              } else {
                router.replace('/home');
              }
            }}
            className="w-full"
          />
          <View className="mt-3">
            <Button
              title="Back to Home"
              variant="outline"
              onPress={() => router.replace('/home')}
              className="w-full"
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
