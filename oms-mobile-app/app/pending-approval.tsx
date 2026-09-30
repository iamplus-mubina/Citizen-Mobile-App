import { useEffect } from 'react';
import { View, Text, Platform, BackHandler, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { CheckIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

export default function PendingApprovalScreen() {
  const router = useRouter();

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/login');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 px-6 w-full max-w-md mx-auto justify-between pb-8"
    : "flex-1 px-6 w-full justify-between pb-8";

  const renderContent = () => (
    <View className={containerClass}>
      {/* Clean top navigation without dashboard Header */}
      <View className="h-14 justify-center">
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          className="self-start p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      {/* Main Status Information (Fit to screen width) */}
      <View className="items-center w-full my-auto py-4">
        <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-6 shadow-sm">
          <CheckIcon size={46} color={colors.surface || '#FFFFFF'} />
        </View>

        <Text className="text-3xl font-inter-bold text-dark mb-3 text-center">
          Registration Submitted!
        </Text>
        <Text className="text-muted text-base font-inter text-center mb-8 px-2 leading-6">
          Your account is awaiting approval by Office Admin.
        </Text>

        <View className="w-full bg-surface border-2 border-dashed border-primary/50 rounded-2xl py-6 px-4 items-center mb-8">
          <Text className="text-muted text-xs font-inter-semibold uppercase tracking-wider mb-1">
            Status
          </Text>
          <Text className="text-primary text-2xl font-inter-bold">
            Pending Approval
          </Text>
        </View>

        <Text className="text-muted text-sm font-inter text-center px-4 leading-5">
          You will receive a notification once your account is approved.
        </Text>
      </View>

      {/* Bottom Button */}
      <View className="w-full">
        <Button 
          title="Back to Login" 
          variant="secondary" 
          onPress={() => router.replace('/login')} 
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {renderContent()}
    </SafeAreaView>
  );
}
