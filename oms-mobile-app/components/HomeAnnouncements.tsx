import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronRightIcon, MegaphoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { getCleanImageUrl } from '@/utils/image';
import { useUpdatesStore, FormattedUpdateItem } from '@/store/useUpdatesStore';
import { useTranslation } from '@/store/useLanguageStore';

interface HomeAnnouncementsProps {
  onViewAll: () => void;
  isActive?: boolean;
}

const AUTO_SLIDE_INTERVAL_MS = 3000;

export function HomeAnnouncements({ onViewAll, isActive = true }: HomeAnnouncementsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { updates, loading, fetchUpdates } = useUpdatesStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState ? AppState.currentState === 'active' : true
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAnimTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrollingRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const isMomentumRef = useRef(false);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      setIsAppActive(nextAppState === 'active');
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (scrollAnimTimeoutRef.current) {
      clearTimeout(scrollAnimTimeoutRef.current);
      scrollAnimTimeoutRef.current = null;
    }
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    if (
      !isActive ||
      !isScreenFocused ||
      !isAppActive ||
      updates.length <= 1 ||
      containerWidth <= 0
    ) {
      return;
    }

    if (isUserInteractingRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
      if (isUserInteractingRef.current) {
        return;
      }

      const total = updates.length;
      if (total <= 1 || containerWidth <= 0) return;

      const nextIndex = (activeIndexRef.current + 1) % total;
      isAutoScrollingRef.current = true;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      scrollViewRef.current?.scrollTo({
        x: nextIndex * containerWidth,
        animated: true,
      });

      scrollAnimTimeoutRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 450);

      startTimer();
    }, AUTO_SLIDE_INTERVAL_MS);
  }, [isActive, isScreenFocused, isAppActive, updates.length, containerWidth, clearTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      clearTimer();
    };
  }, [startTimer, clearTimer]);

  useEffect(() => {
    if (updates.length > 0 && activeIndexRef.current >= updates.length) {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [updates.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isAutoScrollingRef.current) return;
    if (containerWidth <= 0) return;
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / containerWidth);
    if (index !== activeIndexRef.current && index >= 0 && index < updates.length) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const handleScrollBeginDrag = () => {
    isUserInteractingRef.current = true;
    clearTimer();
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocity = Math.abs(event.nativeEvent.velocity?.x || 0);
    if (velocity < 0.1 || Platform.OS === 'web') {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      interactionTimeoutRef.current = setTimeout(() => {
        if (!isMomentumRef.current) {
          isUserInteractingRef.current = false;
          if (containerWidth > 0) {
            const scrollOffset = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollOffset / containerWidth);
            if (index >= 0 && index < updates.length) {
              activeIndexRef.current = index;
              setActiveIndex(index);
            }
          }
          startTimer();
        }
      }, 100);
    }
  };

  const handleMomentumScrollBegin = () => {
    isMomentumRef.current = true;
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isMomentumRef.current = false;
    isUserInteractingRef.current = false;
    isAutoScrollingRef.current = false;

    if (containerWidth > 0) {
      const scrollOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollOffset / containerWidth);
      if (index >= 0 && index < updates.length) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    }

    startTimer();
  };

  const handleDotPress = (index: number) => {
    if (containerWidth <= 0 || index === activeIndexRef.current) return;
    clearTimer();
    isAutoScrollingRef.current = true;
    activeIndexRef.current = index;
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    });
    scrollAnimTimeoutRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 450);
    startTimer();
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
          if (activeIndexRef.current > 0) {
            scrollViewRef.current?.scrollTo({
              x: activeIndexRef.current * width,
              animated: false,
            });
          }
        }
      }}
    >
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xl font-inter-bold text-dark">
          {t('home.announcements')}
        </Text>
        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          className="flex-row items-center py-1"
        >
          <Text className="text-sm font-inter-semibold text-primary mr-1">
            {t('home.viewAll')}
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
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            onMomentumScrollBegin={handleMomentumScrollBegin}
            onMomentumScrollEnd={handleMomentumScrollEnd}
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
                const isActiveDot = dotIdx === activeIndex;
                return (
                  <TouchableOpacity
                    key={dotIdx}
                    activeOpacity={0.7}
                    onPress={() => handleDotPress(dotIdx)}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <View
                      className={`h-1.5 rounded-full ${
                        isActiveDot ? 'w-6 bg-primary' : 'w-1.5 bg-border'
                      }`}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
