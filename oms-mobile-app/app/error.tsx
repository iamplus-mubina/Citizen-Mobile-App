import { View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

export default function ErrorScreen() {
  const router = useRouter();

  const containerClass = Platform.OS === 'web'
    ? 'flex-1 w-full max-w-md mx-auto bg-background justify-center px-8'
    : 'flex-1 bg-background justify-center px-8';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-full bg-[#fee2e2] items-center justify-center mb-6">
            <ExclamationTriangleIcon size={44} color={colors.error} />
          </View>
          <Text className="text-2xl font-inter-bold text-dark mb-3 text-center">
            Something Went Wrong!
          </Text>
          <Text className="text-sm font-inter text-muted text-center leading-5">
            We are unable to process your request. Please try again later.
          </Text>
        </View>

        <View className="mb-3">
          <Button
            title="Try Again"
            onPress={() => router.replace('/home')}
          />
        </View>

        <Button
          title="Go to Home"
          variant="secondary"
          onPress={() => router.replace('/home')}
        />
      </View>
    </SafeAreaView>
  );
}
