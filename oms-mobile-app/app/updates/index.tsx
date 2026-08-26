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
  },
  {
    id: 'upd-2',
    title: 'Water Supply Disruption',
    date: '12 May 2024 • 04:30 PM',
    summary: 'Water supply in Zone A will be disrupted for maintenance between 10 AM to 2 PM.',
  },
  {
    id: 'upd-3',
    title: 'New Public Park Inauguration',
    date: '10 May 2024 • 11:00 AM',
    summary: 'Join us for the inauguration of the new Eco Park by the Honorable Mayor this Sunday.',
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
        
        <Header showBack />

        <View className="px-6 pb-2 pt-2 border-b border-border mb-4">
          <Text className="text-xl font-inter-bold text-text">City Updates</Text>
          <Text className="text-sm font-inter text-muted mt-1">Official announcements & news</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {MOCK_UPDATES.map((update) => (
            <TouchableOpacity 
              key={update.id}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/updates/[id]', params: { id: update.id } } as any)}
              className="bg-background border border-border rounded-xl p-4 shadow-sm mb-4 flex-row items-start"
            >
              {/* Image Placeholder */}
              <View className="w-16 h-16 bg-slate-200 rounded-lg items-center justify-center mr-4">
                <MegaphoneIcon size={24} color={colors.muted} />
              </View>
              
              {/* Content */}
              <View className="flex-1">
                <Text className="text-base font-inter-bold text-text mb-1" numberOfLines={2}>
                  {update.title}
                </Text>
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
