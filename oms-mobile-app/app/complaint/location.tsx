import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPinIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
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

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const isFormValid = address.trim().length > 0 && area.trim().length > 0 && ward !== '' && pincode.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header showBack />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          
          <View className="mb-8">
            <View className="items-center mb-2">
              <Text className="text-lg font-inter-bold text-text">Register Complaint</Text>
            </View>
            <View className="items-end mb-2">
              <Text className="text-sm font-inter-semibold text-text">3 of 4</Text>
            </View>
          </View>

          
          <View className="mb-8">
            <Input 
              label="Address"
              placeholder="Enter full address"
              value={address}
              onChangeText={setAddress}
            />

            <Input 
              label="Area / Locality"
              placeholder="Enter area"
              value={area}
              onChangeText={setArea}
            />

            <Dropdown 
              label="Ward"
              placeholder="Select ward"
              options={WARDS}
              value={ward}
              onSelect={setWard}
            />

            <Input 
              label="Pincode"
              placeholder="Enter pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              maxLength={6}
            />

            <Button 
              title="Use Current Location" 
              variant="outline"
              leftIcon={<MapPinIcon size={20} color={colors.text} />}
              onPress={() => console.log('Fetch location...')}
              className="mt-2"
            />
          </View>
        </ScrollView>

        
        <View className="px-6 py-4 pb-8 border-t border-border bg-background">
          <Button 
            title="Next" 
            onPress={() => {
              setLocation(address, area, ward, pincode);
              router.push('/complaint/attachments');
            }}
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50' : ''}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
