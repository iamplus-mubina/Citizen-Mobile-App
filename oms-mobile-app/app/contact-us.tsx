import React, { useEffect } from 'react';
import { View, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ContactUs } from '@/components/ContactUs';

export default function ContactUsScreen() {
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      router.replace({ pathname: '/home', params: { tab: 'home' } });
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background justify-between";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        <View className="flex-1">
          <Header title="Contact Us" />
          <ContactUs />
        </View>
        <BottomNavigation
          activeTab="contact"
          onTabPress={(tab) => {
            if (tab === 'contact') return;
            router.replace({ pathname: '/home', params: { tab } } as any);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
