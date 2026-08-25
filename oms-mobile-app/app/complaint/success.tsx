import { View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircleIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

export default function SuccessScreen() {
  const router = useRouter();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-center items-center px-6"
    : "flex-1 bg-background justify-center items-center px-6";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <CheckCircleIcon size={80} color={colors.primary} />
        <Text className="text-2xl font-inter-bold text-text mt-6 mb-3 text-center">
          Complaint Submitted!
        </Text>
        <Text className="text-base font-inter text-muted text-center mb-10">
          Your complaint has been registered successfully. We will review it and get back to you.
        </Text>
        <Button
          title="Go to Home"
          onPress={() => router.replace('/home')}
          className="w-full"
        />
      </View>
    </SafeAreaView>
  );
}
