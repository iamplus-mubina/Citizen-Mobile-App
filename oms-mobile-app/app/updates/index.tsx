import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { MegaphoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { api, getStoredToken } from '@/services/api';

const formatDateString = (dateStr?: string) => {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export default function UpdatesListScreen() {
  const router = useRouter();
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUpdates = async () => {
      setLoading(true);
      try {
        const token = await getStoredToken();
        console.log('Fetching Updates with Token present:', !!token);

        let res;
        const endpoints = [
          { method: 'get', url: '/updates/citizen/list' },
          { method: 'post', url: '/updates/citizen/list', body: {} },
          { method: 'get', url: '/citizen/updates' },
          { method: 'get', url: '/updates' },
        ];

        for (const ep of endpoints) {
          try {
            if (ep.method === 'post') {
              res = await api.post(ep.url, ep.body || {});
            } else {
              res = await api.get(ep.url);
            }
            if (res?.data) {
              const possibleList = Array.isArray(res.data) 
                ? res.data 
                : res.data.data || res.data.content || res.data.list || res.data.rows || res.data.items;
              if (Array.isArray(possibleList) && possibleList.length > 0) {
                console.log(`Successfully fetched updates from ${ep.method.toUpperCase()} ${ep.url}:`, possibleList.length);
                res.data = possibleList;
                break;
              }
            }
          } catch (e) {
            // continue trying next endpoint
          }
        }

        if (isMounted && res?.data) {
          const list = Array.isArray(res.data) 
            ? res.data 
            : res.data.data || res.data.content || res.data.list || res.data.rows || res.data.items;
          if (Array.isArray(list) && list.length > 0) {
            const formatted = list.map((item: any, idx: number) => {
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

              const rawDate = item.createdDate || item.createdAt || item.date || item.updateDate;

              return {
                id: String(item.id || item.updateId || `upd-${idx}`),
                title: item.title || item.heading || item.name || 'City Update',
                date: formatDateString(rawDate),
                summary: item.description || item.summary || item.content || item.place || item.location || '',
                place: item.place || item.location || '',
                imageUrl: primaryImg,
                images: imageList,
                read: !!item.read || !!item.isRead,
                fullItem: item
              };
            });
            setUpdates(formatted);
          }
        }
      } catch (err) {
        console.log('Updates API fetch result error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUpdates();
    return () => { isMounted = false; };
  }, []);

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
                  params: { id: update.id, title: update.title, summary: update.summary, date: update.date, imageUrl: update.imageUrl } 
                } as any)}
                className="bg-surface border border-border rounded-lg p-4 mb-4 flex-row items-start"
              >
                {update.imageUrl ? (
                  <Image 
                    source={{ uri: update.imageUrl }} 
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
    </SafeAreaView>
  );
}




