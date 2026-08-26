import React from 'react';
import { View, ScrollView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Header } from '@/components/Header';
import { Stepper, StepperStep } from '@/components/Stepper';

const getComplaintHistory = (id: string | string[]): StepperStep[] => {
  return [
    {
      id: 'step-1',
      title: 'Complaint Submitted',
      description: 'Your complaint has been submitted successfully.',
      date: '13 May 2024 10:30 AM',
      status: 'completed',
      theme: 'primary'
    },
    {
      id: 'step-2',
      title: 'Pending Verification',
      description: 'Office admin is verifying your complaint.',
      date: '13 May 2024 11:15 AM',
      status: 'completed',
      theme: 'success'
    },
    {
      id: 'step-3',
      title: 'Assigned',
      description: 'Yet to be assigned',
      status: 'completed',
      theme: 'warning'
    },
    {
      id: 'step-4',
      title: 'In Progress',
      description: 'Work is in progress',
      status: 'completed',
      theme: 'warning'
    },
    {
      id: 'step-5',
      title: 'Resolved',
      description: 'Work has been completed',
      status: 'completed',
      theme: 'secondary'
    },
    {
      id: 'step-6',
      title: 'Rejected',
      description: 'Complaint could not be processed',
      status: 'completed',
      theme: 'error'
    },
    {
      id: 'step-7',
      title: 'Completed',
      description: 'Complaint closed',
      status: 'completed',
      theme: 'success'
    }
  ];
};

export default function TimelineScreen() {
  const { id } = useLocalSearchParams();
  const historySteps = getComplaintHistory(id);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        
        <Header showBack />

        <View className="px-6 pb-2 pt-2">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-inter-bold text-text">Timeline</Text>
              <Text className="text-xs font-inter-medium text-muted mt-1">{id || 'CMP-1025'}</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Stepper steps={historySteps} />
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
}
