import { View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Header } from '@/components/Header';
import { Profile } from '@/components/Profile';

export default function ProfileScreen() {
  const containerClass = Platform.OS === 'web'
    ? 'flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden'
    : 'flex-1 bg-background';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        <Header showBack />
        <Profile />
      </View>
    </SafeAreaView>
  );
}
