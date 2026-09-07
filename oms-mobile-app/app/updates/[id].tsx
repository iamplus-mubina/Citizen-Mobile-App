import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { PlayIcon, MegaphoneIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';
import { api } from '@/services/api';

export default function UpdateDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string; summary?: string; date?: string; category?: string }>();
  const [detail, setDetail] = useState<{
    title: string;
    date: string;
    content: string;
    badge?: string;
    actionNotice?: string;
    videoUrl?: string;
    duration?: string;
    imageUrl?: string;
  }>({
    title: params.title || '',
    date: params.date || '',
    content: params.summary || '',
    badge: params.category || 'Official Update',
  });

  useEffect(() => {
    if (!params.id) return;
    let isMounted = true;
    const fetchSingleUpdate = async () => {
      try {
        let res;
        try {
          res = await api.get(`/citizen/updates/${params.id}`);
        } catch {
          res = await api.get(`/updates/${params.id}`);
        }
        if (isMounted && res?.data) {
          const item = res.data.data || res.data;
          if (item) {
            setDetail({
              title: item.title || item.heading || params.title || '',
              date: item.createdDate || item.createdAt || item.date || params.date || '',
              content: item.description || item.content || item.summary || params.summary || '',
              badge: item.category || item.type || item.badge || 'Official Update',
              actionNotice: item.actionNotice || item.actionRequired || item.notice || '',
              videoUrl: item.videoUrl || item.video || '',
              duration: item.duration || item.videoDuration || '',
              imageUrl: item.imageUrl || item.image || item.banner || '',
            });
          }
        }
      } catch (err) {
        console.log('Single Update API fetch error:', err);
      }
    };

    fetchSingleUpdate();
    return () => { isMounted = false; };
  }, [params.id]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>

        <Header showBack title="City Updates" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

          {detail.imageUrl ? (
            <Image source={{ uri: detail.imageUrl }} className="w-full h-56" resizeMode="cover" />
          ) : (
            <View className="w-full h-48 bg-primary-light items-center justify-center relative">
              {detail.videoUrl ? (
                <>
                  <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                    <PlayIcon size={32} color={colors.dark} />
                  </View>
                  {detail.duration && (
                    <View className="absolute bottom-2 right-2 bg-text px-2 py-1 rounded">
                      <Text className="text-surface text-xs font-inter-medium">{detail.duration}</Text>
                    </View>
                  )}
                </>
              ) : (
                <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center">
                  <MegaphoneIcon size={36} color={colors.primary} />
                </View>
              )}
            </View>
          )}

          <View className="p-6">
            {detail.badge ? (
              <View className="bg-primary self-start px-3 py-1 rounded-full mb-3">
                <Text className="text-xs font-inter-bold text-on-primary">{detail.badge}</Text>
              </View>
            ) : null}

            {detail.title ? (
              <Text className="text-2xl font-inter-bold text-dark mb-2">
                {detail.title}
              </Text>
            ) : null}

            {detail.date ? (
              <Text className="text-sm font-inter-medium text-muted mb-6">
                {detail.date}
              </Text>
            ) : null}

            {detail.content ? (
              <Text className="text-base font-inter text-dark leading-6 mb-4">
                {detail.content}
              </Text>
            ) : null}

            {detail.actionNotice ? (
              <View className="bg-surface p-4 rounded-lg border border-border mt-2">
                <Text className="text-sm font-inter-bold text-dark mb-1">Action Required:</Text>
                <Text className="text-sm font-inter text-muted leading-5">
                  {detail.actionNotice}
                </Text>
              </View>
            ) : null}
          </View>

          <View className="h-12" />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}


