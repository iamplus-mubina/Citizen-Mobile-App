import React from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { MegaphoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

const MOCK_UPDATES = [
  {
    id: 'upd-1',
    title: 'Road Construction Notice: Ward 5',
    date: '14 May 2024 • 09:00 AM',
    summary: 'Main road construction will begin tomorrow. Please use alternate routes to avoid traffic.',
    read: false,
  },
  {
    id: 'upd-2',
    title: 'Water Supply Disruption',
    date: '12 May 2024 • 04:30 PM',
    summary: 'Water supply in Zone A will be disrupted for maintenance between 10 AM to 2 PM.',
    read: false,
  },
  {
    id: 'upd-3',
    title: 'New Public Park Inauguration',
    date: '10 May 2024 • 11:00 AM',
    summary: 'Join us for the inauguration of the new Eco Park by the Honorable Mayor this Sunday.',
    read: true,
  }
];

export default function UpdatesListScreen() {
  const router = useRouter();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        
        <Header showBack title="City Updates" />

        <View className="h-4" />

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {MOCK_UPDATES.map((update) => (
            <TouchableOpacity 
              key={update.id}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/updates/[id]', params: { id: update.id } } as any)}
              className="bg-surface border border-border rounded-lg p-4 mb-4 flex-row items-start"
            >
              <View className="w-16 h-16 bg-primary-light rounded-lg items-center justify-center mr-4">
                <MegaphoneIcon size={24} color={colors.primary} />
              </View>
              
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="text-base font-inter-bold text-dark mb-1 flex-1 pr-2" numberOfLines={2}>
                    {update.title}
                  </Text>
                  {!update.read && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                  )}
                </View>
                <Text className="text-xs font-inter-medium text-muted mb-2">
                  {update.date}
                </Text>
                <Text className="text-sm font-inter text-muted leading-5" numberOfLines={2}>
                  {update.summary}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <View className="h-8" />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
