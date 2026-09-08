import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { PlayIcon, MegaphoneIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';
import { api } from '@/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatDateString = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateStr;
  }
};

export default function UpdateDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string; summary?: string; date?: string; category?: string; imageUrl?: string }>();
  const [detail, setDetail] = useState<{
    title: string;
    date: string;
    content: string;
    badge?: string;
    actionNotice?: string;
    videoUrl?: string;
    duration?: string;
    imageUrl?: string;
    images?: string[];
  }>({
    title: params.title || '',
    date: formatDateString(params.date) || '',
    content: params.summary || '',
    badge: params.category || 'Official Update',
    imageUrl: params.imageUrl || '',
    images: params.imageUrl ? [params.imageUrl] : [],
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    let isMounted = true;
    const fetchSingleUpdate = async () => {
      try {
        let res;
        try {
          res = await api.get(`/updates/${params.id}`);
        } catch {
          res = await api.get(`/citizen/updates/${params.id}`);
        }
        if (isMounted && res?.data) {
          const item = res.data.data || res.data;
          if (item) {
            let imageList: string[] = [];
            if (Array.isArray(item.images)) {
              imageList = item.images;
            } else if (typeof item.images === 'string') {
              try {
                const parsed = JSON.parse(item.images);
                if (Array.isArray(parsed)) imageList = parsed;
              } catch {
                if (item.images.length > 0) imageList = [item.images];
              }
            }

            const primaryImg = imageList.length > 0
              ? imageList[0]
              : (item.imageUrl || item.image || item.banner || '');

            setDetail({
              title: item.title || item.heading || params.title || '',
              date: formatDateString(item.createdDate || item.createdAt || item.date || params.date) || '',
              content: item.description || item.content || item.summary || params.summary || '',
              badge: item.category || item.type || item.badge || 'Official Update',
              actionNotice: item.actionNotice || item.actionRequired || item.notice || '',
              videoUrl: item.videoUrl || item.video || '',
              duration: item.duration || item.videoDuration || '',
              imageUrl: primaryImg,
              images: imageList,
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

  const bannerImages = (detail.images && detail.images.length > 0)
    ? detail.images
    : (detail.imageUrl ? [detail.imageUrl] : []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>

        <Header showBack title="City Updates" />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

          {/* Top Banner Paging Image Slider */}
          {bannerImages.length > 0 ? (
            <View className="w-full h-72 relative bg-black">
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const slide = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                  if (slide !== activeImageIndex) setActiveImageIndex(slide);
                }}
                scrollEventThrottle={16}
              >
                {bannerImages.map((imgUri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.9}
                    onPress={() => setSelectedImage(imgUri)}
                    style={{ width: Platform.OS === 'web' ? 448 : SCREEN_WIDTH }}
                    className="h-72 items-center justify-center bg-black"
                  >
                    <Image source={{ uri: imgUri }} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>


              {bannerImages.length > 1 && (
                <View className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-inter-semibold">
                    {activeImageIndex + 1} / {bannerImages.length}
                  </Text>
                </View>
              )}


              {bannerImages.length > 1 && (
                <View className="absolute bottom-3 left-0 right-0 flex-row justify-center items-center gap-1.5">
                  {bannerImages.map((_, dotIdx) => (
                    <View
                      key={dotIdx}
                      className={`h-2 rounded-full transition-all ${dotIdx === activeImageIndex ? 'w-5 bg-primary' : 'w-2 bg-white/60'
                        }`}
                    />
                  ))}
                </View>
              )}
            </View>
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

        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View className="flex-1 bg-black/95 items-center justify-center relative p-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedImage(null)}
              className="absolute top-10 right-6 z-50 bg-white/20 p-3 rounded-full"
            >
              <XMarkIcon size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-4/5"
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}



