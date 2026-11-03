import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { ServiceCategoryIcon } from '@/components/ServiceCategoryIcon';
import { POPULAR_SERVICE_CATEGORIES } from '@/services/mock/popularServices.data';

export default function PopularServicesHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background";

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title="Popular Services"
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-5 pt-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="flex-row flex-wrap -mx-[1%]">
            {POPULAR_SERVICE_CATEGORIES.map((cat) => (
              <Card
                key={cat.id}
                variant="quick"
                title={cat.title}
                Icon={(props) => (
                  <ServiceCategoryIcon
                    category={cat.id}
                    size={props.size}
                    color={props.color}
                  />
                )}
                onPress={() => router.push(`/services/category/${cat.id}` as any)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
