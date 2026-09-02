import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Input } from '@/components/Input';
import { Dropdown } from '@/components/Dropdown';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

const WARDS = [
  'Ward A',
  'Ward B',
  'Ward C',
  'Ward D',
  'Ward E'
];

export default function LocationScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [ward, setWard] = useState('');
  const [pincode, setPincode] = useState('');
  const setLocation = useComplaintStore((s) => s.setLocation);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = 'Address is required';
    if (!area.trim()) newErrors.area = 'Area or Locality is required';
    if (!ward) newErrors.ward = 'Please select a ward';
    if (pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLocation(address, area, ward, pincode);
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
              label="Area or Locality *"
              placeholder="Enter area"
              value={area}
              onChangeText={(text) => {
                setArea(text);
                if (text.trim()) setErrors(prev => ({ ...prev, area: '' }));
              }}
              error={errors.area}
            />

            <Dropdown 
              label="Ward *"
              placeholder="Select ward"
              options={WARDS}
              value={ward}
              onSelect={(val) => {
                setWard(val);
                if (val) setErrors(prev => ({ ...prev, ward: '' }));
              }}
              error={errors.ward}
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

            <Button 
              title="Use Current Location" 
              variant="outline"
              leftIcon={<MapPinIcon size={20} color={colors.primary} />}
              onPress={() => console.log('Fetch location...')}
              className="mt-2"
            />
          </View>
        </ScrollView>

        
        <View className="px-6 py-4 pb-8 border-t border-border bg-background">
          <Button 
            title="Next" 
            onPress={handleNext}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
