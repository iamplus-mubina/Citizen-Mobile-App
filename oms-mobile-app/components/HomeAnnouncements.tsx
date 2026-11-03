import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRightIcon, MegaphoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { getCleanImageUrl } from '@/utils/image';
import { useUpdatesStore, FormattedUpdateItem } from '@/store/useUpdatesStore';

interface HomeAnnouncementsProps {
  onViewAll: () => void;
}

export function HomeAnnouncements({ onViewAll }: HomeAnnouncementsProps) {
  const router = useRouter();
  const { updates, loading, fetchUpdates } = useUpdatesStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth <= 0) return;
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / containerWidth);
    if (index !== activeIndex && index >= 0 && index < updates.length) {
      setActiveIndex(index);
    }
  };

  const handleOpenAnnouncement = (item: FormattedUpdateItem) => {
    router.push({
      pathname: '/updates/[id]',
      params: {
        id: item.id,
        title: item.title,
        summary: item.summary,
        date: item.date,
        imageUrl: item.imageUrl,
        category: item.category,
      },
    } as any);
  };

  return (
    <View
      className="mb-8"
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        if (width > 0 && width !== containerWidth) {
          setContainerWidth(width);
        }
      }}
    >
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xl font-inter-bold text-dark">
          Announcements
        </Text>
        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          className="flex-row items-center py-1"
        >
          <Text className="text-sm font-inter-semibold text-primary mr-1">
            View all
          </Text>
          <ChevronRightIcon size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && updates.length === 0 ? (
        <View className="bg-surface border border-border rounded-2xl p-8 items-center justify-center">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-xs font-inter text-muted mt-2">Loading announcements...</Text>
        </View>
      ) : updates.length === 0 ? (
        <View className="bg-surface border border-border rounded-2xl p-6 items-center justify-center">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <MegaphoneIcon size={24} color={colors.primary} />
          </View>
          <Text className="text-sm font-inter-bold text-dark text-center">
            No Announcements Available
          </Text>
          <Text className="text-xs font-inter text-muted text-center mt-1">
            New municipal updates and announcements will appear here.
          </Text>
        </View>
      ) : (
        <View className="w-full">
          {/* Horizontal Carousel */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={containerWidth > 0 ? containerWidth : undefined}
            snapToAlignment="center"
            className="w-full"
          >
            {updates.map((item) => {
              const cleanedImage = getCleanImageUrl(item.imageUrl);
              return (
                <View
                  key={item.id}
                  style={containerWidth > 0 ? { width: containerWidth } : { width: 340 }}
                  className="px-0.5"
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleOpenAnnouncement(item)}
                    className="bg-surface border border-border rounded-2xl overflow-hidden"
                  >
                    {/* Announcement Image / Banner */}
                    {cleanedImage ? (
                      <Image
                        source={{ uri: cleanedImage }}
                        className="w-full h-44 bg-surface"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-44 bg-primary/10 items-center justify-center">
                        <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center mb-2">
                          <MegaphoneIcon size={28} color={colors.primary} />
                        </View>
                        <Text className="text-xs font-inter-semibold text-primary">
                          {item.category || 'City Announcement'}
                        </Text>
                      </View>
                    )}

                    {/* Announcement Details */}
                    <View className="p-4">
                      {/* Category Badge & Published Date */}
                      <View className="flex-row items-center mb-2">
                        <View className="px-2.5 py-0.5 rounded-md bg-primary/10">
                          <Text className="text-xs font-inter-bold text-primary">
                            {item.category || 'City Update'}
                          </Text>
                        </View>
                        <Text className="text-xs font-inter text-muted ml-3">
                          {item.date}
                        </Text>
                      </View>

                      {/* Announcement Title */}
                      <Text
                        className="text-base font-inter-bold text-dark leading-snug mb-1"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>

                      {/* Short Description */}
                      {item.summary ? (
                        <Text
                          className="text-xs font-inter text-muted leading-relaxed"
                          numberOfLines={2}
                        >
                          {item.summary}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {/* Dynamic Pagination Dots */}
          {updates.length > 1 && (
            <View className="flex-row items-center justify-center mt-3 gap-1.5">
              {updates.map((_, dotIdx) => {
                const isActive = dotIdx === activeIndex;
                return (
                  <View
                    key={dotIdx}
                    className={`h-1.5 rounded-full ${
                      isActive ? 'w-6 bg-primary' : 'w-1.5 bg-border'
                    }`}
                  />
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
