import { View, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-10">
          <Text className="text-3xl font-inter-bold text-primary mb-2">Welcome</Text>
          <Text className="text-gray-500 text-base">Please enter your details to proceed.</Text>
        </View>

        <Input 
          label="Mobile Number" 
          placeholder="Enter your 10-digit number" 
          keyboardType="phone-pad"
        />

        <View className="mt-6">
          <Button title="Continue" onPress={() => console.log('Continue Pressed')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
