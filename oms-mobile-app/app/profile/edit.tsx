import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@example.com');
  const [address, setAddress] = useState('Street 12, Green Park, Bhopal');
  const [pincode, setPincode] = useState('462001');

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleSave = () => {
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
            <Text className="text-lg font-inter-bold text-text">Edit Profile</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <View>
              
              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-text mb-2">Full Name</Text>
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-text mb-2">Email</Text>
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-inter-semibold text-text mb-2">Address</Text>
                <Input
                  placeholder="Enter address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View className="mb-8">
                <Text className="text-sm font-inter-semibold text-text mb-2">Pincode</Text>
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
