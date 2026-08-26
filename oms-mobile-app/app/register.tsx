import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleNext = () => {
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your address');
      return;
    }
    
    console.log('Registration Data:', { fullName, email, address });
    router.push('/pending-approval');
  };

  const renderContent = () => (
    <View className="flex-1 px-6 w-full max-w-md mx-auto">
      <View className="h-14 justify-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="self-start p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-4">
        <View className="mb-8">
          <Text className="text-3xl font-inter-bold text-dark mb-2">
            Create Your Account
          </Text>
          <Text className="text-muted text-lg font-inter">
            Please fill the details to register
          </Text>
        </View>

        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Email (Optional)"
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
          multiline={true}
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
        />

        <View className="mt-8">
          <Button title="Next" onPress={handleNext} />
        </View>
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {renderContent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {renderContent()}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
