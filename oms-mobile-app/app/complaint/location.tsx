import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Input } from '@/components/Input';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function LocationScreen() {
  const router = useRouter();
  const storeAddress = useComplaintStore((s) => s.address);
  const storePincode = useComplaintStore((s) => s.pincode);
  const setComplaintForm = useComplaintStore((s) => s.setComplaintForm);

  // Initialize from store so data persists on back navigation
  const [address, setAddress] = useState(storeAddress);
  const [pincode, setPincode] = useState(storePincode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/complaint/details');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = 'Address is required';
    if (pincode && pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setComplaintForm({ address, pincode });
    router.push('/complaint/attachments');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header 
          showBack 
          title="Raise a complaint" 
          onBack={() => router.replace('/home')}
        />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>

          <View className="mb-2">
            <View className="mt-2" />
            <FormStepper currentStep={3} totalSteps={5} />
            <Text className="text-base font-inter-semibold text-dark mt-6 mb-2">Pinpoint the issue location</Text>
          </View>

          <View className="mb-8">
            <Input
              label="Address *"
              placeholder="Enter full address"
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (text.trim()) setErrors(prev => ({ ...prev, address: '' }));
              }}
              error={errors.address}
            />

            <Input
              label="Pincode (Optional)"
              placeholder="Enter pincode"
              value={pincode}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                setPincode(cleanText);
                if (cleanText.length === 6 || cleanText.length === 0) setErrors(prev => ({ ...prev, pincode: '' }));
              }}
              keyboardType="numeric"
              maxLength={6}
              error={errors.pincode}
            />

          </View>
        </ScrollView>

        {/* Bottom action bar — Back + Next */}
        <View className="px-6 py-4 border-t border-border bg-background flex-row gap-x-3">
          <View className="flex-[0.8]">
            <Button
              title="Back"
              variant="outline"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/complaint/details');
                }
              }}
            />
          </View>
          <View className="flex-[1.2]">
            <Button title="Next" onPress={handleNext} />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
