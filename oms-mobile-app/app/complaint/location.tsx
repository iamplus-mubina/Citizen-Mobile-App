import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { api } from '@/services/api';

const FALLBACK_WARDS = ['Ward A', 'Ward B', 'Ward C', 'Ward D', 'Ward E'];

export default function LocationScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [ward, setWard] = useState('');
  const [pincode, setPincode] = useState('');
  const [wardOptions, setWardOptions] = useState<string[]>(FALLBACK_WARDS);
  const setLocation = useComplaintStore((s) => s.setLocation);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [deptRes, assemblyRes, gaonRes, ganRes, gatRes, prabhagRes, prabhagAreaRes, districtRes] = await Promise.allSettled([
          api.get('/department'),
          api.get('/assembly'),
          api.get('/gaon'),
          api.get('/ganNo'),
          api.get('/gatNo'),
          api.get('/prabhag'),
          api.get('/prabhagArea'),
          api.get('/district'),
        ]);

        if (prabhagRes.status === 'fulfilled' && Array.isArray(prabhagRes.value.data) && prabhagRes.value.data.length > 0) {
          const prabhagList = prabhagRes.value.data.map((p: any) => p.name || `Prabhag ${p.id}`);
          setWardOptions(prabhagList);
          console.log('Prabhag/Ward options dynamically loaded:', prabhagList.length);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    fetchLocationData();
  }, []);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = 'Address is required';
    if (pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLocation(address, '', ward, pincode);
    router.push('/complaint/attachments');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header showBack title="Raise a complaint" />

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
              label="Pincode *"
              placeholder="Enter pincode"
              value={pincode}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                setPincode(cleanText);
                if (cleanText.length === 6) setErrors(prev => ({ ...prev, pincode: '' }));
              }}
              keyboardType="numeric"
              maxLength={6}
              error={errors.pincode}
            />

            {/* <Button
              title="Use Current Location"
              variant="outline"
              leftIcon={<MapPinIcon size={20} color={colors.primary} />}
              onPress={() => console.log('Fetch location...')}
              className="mt-2"
            /> */}
            <View className="mt-4 mb-8">
              <Button
                title="Next"
                onPress={handleNext}
              />
            </View>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
