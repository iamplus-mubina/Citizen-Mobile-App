import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useComplaintStore } from '@/store/useComplaintStore';
import { api } from '@/services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const store = useComplaintStore();
  const [name, setName] = useState(store.profileName);
  const [email, setEmail] = useState(store.profileEmail);
  const [address, setAddress] = useState(store.profileAddress);
  const [pincode, setPincode] = useState(store.profilePincode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden"
    : "flex-1 bg-background";

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateProfile = async () => {
      try {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        await api.put('/citizen/profile', {
          firstName,
          lastName,
          email,
          address,
          pincode
        });

        store.setProfile(name, email, address, pincode);
        router.back();
      } catch (err: any) {
        console.error('Failed to update profile:', err);
        Alert.alert('Error', err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    };

    updateProfile();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className={containerClass}>
          
          <Header showBack title="Edit Profile" />

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            <View>
              
              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Full Name</Text>
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  error={errors.name}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Email</Text>
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (/^\S+@\S+\.\S+$/.test(text)) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  error={errors.email}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Address</Text>
                <Input
                  placeholder="Enter address"
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    if (text.trim()) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  multiline
                  numberOfLines={2}
                  error={errors.address}
                />
              </View>

              <View className="mb-8">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Pincode</Text>
                <Input
                  placeholder="Enter pincode"
                  value={pincode}
                  onChangeText={(text) => {
                    const cleanText = text.replace(/[^0-9]/g, '');
                    setPincode(cleanText);
                    if (cleanText.length === 6) setErrors(prev => ({ ...prev, pincode: '' }));
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={errors.pincode}
                />
              </View>

            </View>
          </ScrollView>

          <View className="px-6 py-4 bg-background border-t border-border flex-row gap-x-3">
            <View className="flex-1">
              <Button 
                title="Cancel" 
                onPress={() => router.back()} 
                variant="secondary"
              />
            </View>
            <View className="flex-1">
              <Button 
                title="Update" 
                onPress={handleSave} 
                variant="primary"
              />
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
