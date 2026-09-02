import { View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckIcon } from 'react-native-heroicons/solid';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

export default function SuccessScreen() {
  const router = useRouter();

  const renderContent = () => (
    <View className="flex-1 px-6 w-full max-w-md mx-auto pt-16 pb-10 justify-between">
      <View className="items-center w-full flex-1 justify-center">
        <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-8">
          <CheckIcon size={48} color={colors.surface} />
        </View>

        <Text className="text-2xl font-inter-bold text-primary mb-10 text-center">
          Complaint Submitted{"\n"}Successfully!
        </Text>

        <View className="w-full space-y-4 mb-10">
          <View className="w-full bg-surface border border-border rounded-lg py-4 px-4 items-center shadow-sm">
            <Text className="text-muted text-sm font-inter-medium mb-1">
              Complaint ID
            </Text>
            <Text className="text-dark text-xl font-inter-bold">
              CMP-1025
            </Text>
          </View>
          
          <View className="w-full bg-surface border border-border rounded-lg py-4 px-4 items-center mt-3 shadow-sm">
            <Text className="text-muted text-sm font-inter-medium mb-1">
              Status
            </Text>
            <Text className="text-primary text-xl font-inter-bold">
              Pending Verification
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full mt-4 space-y-3">
        <Button 
          title="Track Complaint" 
          variant="primary"
          onPress={() => console.log('Track Complaint')} 
          className="w-full"
        />
        <View className="mt-3">
          <Button 
            title="Back to Home" 
            variant="outline" 
            onPress={() => router.replace('/home')} 
            className="w-full"
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {renderContent()}
    </SafeAreaView>
  );
}
