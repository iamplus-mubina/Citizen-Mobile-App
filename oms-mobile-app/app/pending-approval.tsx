import { View, Text, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { CheckIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

export default function PendingApprovalScreen() {
  const router = useRouter();

  const renderContent = () => (
    <View className="flex-1 px-6 w-full max-w-md mx-auto pt-16 pb-10 justify-between">
      <View className="items-center w-full flex-1 justify-center">
        <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-8">
          <CheckIcon size={48} color={colors.surface} />
        </View>

        <Text className="text-3xl font-inter-bold text-primary mb-4 text-center">
          Registration Submitted!
        </Text>
        <Text className="text-muted text-lg font-inter text-center mb-10 px-4">
          Your account is awaiting approval by Office Admin.
        </Text>

        <View className="w-full border-2 border-dashed border-primary rounded-2xl py-6 px-4 items-center mb-10">
          <Text className="text-muted text-base font-inter-medium mb-1">
            Status
          </Text>
          <Text className="text-primary text-2xl font-inter-bold">
            Pending Approval
          </Text>
        </View>

        <Text className="text-muted text-base font-inter text-center px-4">
          You will receive a notification once your account is approved.
        </Text>
      </View>

      <View className="w-full mt-4">
        <Button 
          title="Close" 
          variant="secondary" 
          onPress={() => router.push('/login')} 
        />
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 bg-background min-h-screen">
        {renderContent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {renderContent()}
    </SafeAreaView>
  );
}
