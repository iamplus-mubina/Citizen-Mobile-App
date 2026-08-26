import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const store = useComplaintStore();
  const [name, setName] = useState(store.profileName);
  const [email, setEmail] = useState(store.profileEmail);
  const [address, setAddress] = useState(store.profileAddress);
  const [pincode, setPincode] = useState(store.profilePincode);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleSave = () => {
    store.setProfile(name, email, address, pincode);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className={containerClass}>
          
          <Header showBack />

          <View className="px-6 pb-6 pt-2">
            <Text className="text-lg font-inter-bold text-dark">Edit Profile</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <View>
              
              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Full Name</Text>
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Email</Text>
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Address</Text>
                <Input
                  placeholder="Enter address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View className="mb-8">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Pincode</Text>
                <Input
                  placeholder="Enter pincode"
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

            </View>
          </ScrollView>

          <View className="px-6 py-4 bg-background border-t border-border">
            <Button 
              title="Save Changes" 
              onPress={handleSave} 
            />
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
