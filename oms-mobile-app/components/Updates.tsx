import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MegaphoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { getCleanImageUrl } from '@/utils/image';
import { useUpdatesStore, FormattedUpdateItem } from '@/store/useUpdatesStore';

export type { FormattedUpdateItem };

export function Updates() {
  const router = useRouter();
  const { updates, loading, isRefreshing, fetchUpdates, refreshUpdates } = useUpdatesStore();

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return (
    <View className="flex-1 w-full bg-background pt-2">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshUpdates} />
        }
      >
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : updates.length > 0 ? (
          updates.map((update) => (
            <TouchableOpacity
              key={update.id}
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/updates/[id]',
                params: {
                  id: update.id,
                  title: update.title,
                  summary: update.summary,
                  date: update.date,
                  imageUrl: update.imageUrl,
                },
              } as any)}
              className="bg-surface border border-border rounded-lg p-4 mb-4 flex-row items-start"
            >
              {getCleanImageUrl(update.imageUrl) ? (
                <Image
                  source={{ uri: getCleanImageUrl(update.imageUrl)! }}
                  className="w-16 h-16 rounded-lg mr-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-16 h-16 bg-primary-light rounded-lg items-center justify-center mr-4">
                  <MegaphoneIcon size={24} color={colors.primary} />
                </View>
              )}

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
          ))
        ) : (
          <View className="bg-surface border border-border rounded-xl p-8 items-center justify-center my-6">
            <View className="w-16 h-16 bg-primary-light rounded-full items-center justify-center mb-4">
              <MegaphoneIcon size={28} color={colors.primary} />
            </View>
            <Text className="text-lg font-inter-bold text-dark text-center mb-2">
              No Updates Available
            </Text>
            <Text className="text-sm font-inter text-muted text-center leading-5">
              There are currently no new city announcements or updates published from the administration.
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
