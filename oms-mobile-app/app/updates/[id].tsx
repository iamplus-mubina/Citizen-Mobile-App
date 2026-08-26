import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { PlayIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

export default function UpdateDetailScreen() {
  const { id } = useLocalSearchParams();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        
        <Header showBack />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="w-full h-56 bg-border items-center justify-center relative">
            <View className="w-16 h-16 bg-muted rounded-full items-center justify-center">
              <PlayIcon size={32} color={colors.white} />
            </View>
            <View className="absolute bottom-2 right-2 bg-text px-2 py-1 rounded">
              <Text className="text-surface text-xs font-inter-medium">0:45</Text>
            </View>
          </View>

          <View className="p-6">
            <View className="bg-secondary self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-xs font-inter-bold text-primary">Official Notice</Text>
            </View>
            
            <Text className="text-2xl font-inter-bold text-dark mb-2">
              Road Construction Notice: Ward 5 Area
            </Text>
            <Text className="text-sm font-inter-medium text-muted mb-6">
              Published on 14 May 2024 • 09:00 AM
            </Text>

            <Text className="text-base font-inter text-dark leading-6 mb-4">
              Dear Citizens, {"\n\n"}
              This is to inform you that major road reconstruction will commence on the Main Road of Ward 5 starting tomorrow morning at 8:00 AM.
            </Text>
            
            <Text className="text-base font-inter text-dark leading-6 mb-4">
              The project is expected to last for approximately 3 days. During this time, heavy machinery will be operating in the area, and traffic diversions will be in place.
            </Text>

            <View className="bg-background p-4 rounded-xl border border-border mt-2">
              <Text className="text-sm font-inter-bold text-dark mb-1">Action Required:</Text>
              <Text className="text-sm font-inter text-muted leading-5">
                Please use the alternative routes via Green Park Avenue. We regret the temporary inconvenience and appreciate your cooperation in building a better city infrastructure.
              </Text>
            </View>
          </View>
          
          <View className="h-12" />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
