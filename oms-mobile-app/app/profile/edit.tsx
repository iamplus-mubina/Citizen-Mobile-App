import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { api } from '@/services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const store = useComplaintStore();
  
  // Basic Details
  const [name, setName] = useState(store.profileName);
  const [email, setEmail] = useState(store.profileEmail);
  const [address, setAddress] = useState(store.profileAddress);
  const [pincode, setPincode] = useState(store.profilePincode);
  
  // Personal Details
  const [dob, setDob] = useState(store.dob);
  const [age, setAge] = useState(store.age);
  const [education, setEducation] = useState(store.education);
  const [occupation, setOccupation] = useState(store.occupation);
  
  // Identity Cards
  const [aadharCard, setAadharCard] = useState(store.aadharCard);
  const [panCard, setPanCard] = useState(store.panCard);
  const [voterId, setVoterId] = useState(store.voterId);
  const [rationCard, setRationCard] = useState(store.rationCard);
  
  // Other Details
  const [caste, setCaste] = useState(store.caste);
  const [subCaste, setSubCaste] = useState(store.subCaste);
  
  // Voter Details
  const [voterAccountNumber, setVoterAccountNumber] = useState(store.voterAccountNumber);
  const [voterPartNumber, setVoterPartNumber] = useState(store.voterPartNumber);
  const [voterSectionNumber, setVoterSectionNumber] = useState(store.voterSectionNumber);
  const [voterSlnNumber, setVoterSlnNumber] = useState(store.voterSlnNumber);
  const [ourVoter, setOurVoter] = useState(store.ourVoter);

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

        const payload = {
          firstName,
          lastName,
          email,
          address,
          pincode,
          dob,
          age,
          education,
          occupation,
          aadharCard,
          panCard,
          voterId,
          rationCard,
          caste,
          subCaste,
          voterAccountNumber,
          voterPartNumber,
          voterSectionNumber,
          voterSlnNumber,
          ourVoter
        };

        await api.put('/citizen/profile', payload);

        store.setProfile({
          profileName: name,
          profileEmail: email,
          profileAddress: address,
          profilePincode: pincode,
          dob,
          age,
          education,
          occupation,
          aadharCard,
          panCard,
          voterId,
          rationCard,
          caste,
          subCaste,
          voterAccountNumber,
          voterPartNumber,
          voterSectionNumber,
          voterSlnNumber,
          ourVoter
        });
        router.back();
      } catch (err: any) {
        console.error('Failed to update profile:', err);
        Alert.alert('Error', err.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    };

    updateProfile();
  };

  const renderSectionHeader = (title: string) => (
    <View className="mt-6 mb-4 pb-2 border-b border-border">
      <Text className="text-base font-inter-bold text-primary">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className={containerClass}>
          
          <Header showBack title="Edit Profile" />

          <ScrollView className="flex-1 px-6 pt-2 pb-10" showsVerticalScrollIndicator={false}>
            <View className="pb-10">
              
              {renderSectionHeader('Basic Details')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Full Name *</Text>
                <Input placeholder="Enter full name" value={name} onChangeText={(text) => { setName(text); if (text.trim()) setErrors(prev => ({ ...prev, name: '' })); }} error={errors.name} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Email *</Text>
                <Input placeholder="Enter email address" value={email} onChangeText={(text) => { setEmail(text); if (/^\S+@\S+\.\S+$/.test(text)) setErrors(prev => ({ ...prev, email: '' })); }} keyboardType="email-address" error={errors.email} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Address *</Text>
                <Input placeholder="Enter address" value={address} onChangeText={(text) => { setAddress(text); if (text.trim()) setErrors(prev => ({ ...prev, address: '' })); }} multiline numberOfLines={2} error={errors.address} />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Pincode *</Text>
                <Input placeholder="Enter pincode" value={pincode} onChangeText={(text) => { const cleanText = text.replace(/[^0-9]/g, ''); setPincode(cleanText); if (cleanText.length === 6) setErrors(prev => ({ ...prev, pincode: '' })); }} keyboardType="number-pad" maxLength={6} error={errors.pincode} />
              </View>

              {renderSectionHeader('Personal Details (Optional)')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Date of Birth</Text>
                <Input placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Age</Text>
                <Input placeholder="Enter your age" value={age} onChangeText={setAge} keyboardType="number-pad" />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Education</Text>
                <Input placeholder="Enter education" value={education} onChangeText={setEducation} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Occupation</Text>
                <Input placeholder="Enter occupation" value={occupation} onChangeText={setOccupation} />
              </View>

              {renderSectionHeader('Identity Cards (Optional)')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Aadhar Card</Text>
                <Input placeholder="XXXX-XXXX-XXXX" value={aadharCard} onChangeText={setAadharCard} keyboardType="number-pad" />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">PAN Card</Text>
                <Input placeholder="Enter PAN number" value={panCard} onChangeText={setPanCard} autoCapitalize="characters" />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Voter ID</Text>
                <Input placeholder="Enter Voter ID" value={voterId} onChangeText={setVoterId} autoCapitalize="characters" />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Ration Card</Text>
                <Input placeholder="Select ration card type" value={rationCard} onChangeText={setRationCard} />
              </View>

              {renderSectionHeader('Other Details (Optional)')}
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Caste</Text>
                <Input placeholder="Select Caste" value={caste} onChangeText={setCaste} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Sub-Caste</Text>
                <Input placeholder="Select Sub-Caste" value={subCaste} onChangeText={setSubCaste} />
              </View>

              {renderSectionHeader('Voter Details (Optional)')}
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-sm font-inter-semibold text-dark">Our Voter</Text>
                <Switch value={ourVoter} onValueChange={setOurVoter} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Account Number</Text>
                <Input placeholder="Enter Account Number" value={voterAccountNumber} onChangeText={setVoterAccountNumber} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Part Number</Text>
                <Input placeholder="Enter Part Number" value={voterPartNumber} onChangeText={setVoterPartNumber} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">Section Number</Text>
                <Input placeholder="Enter Section Number" value={voterSectionNumber} onChangeText={setVoterSectionNumber} />
              </View>
              <View className="mb-4">
                <Text className="text-sm font-inter-semibold text-dark mb-2">SLN Number In Part</Text>
                <Input placeholder="Enter SLN Number" value={voterSlnNumber} onChangeText={setVoterSlnNumber} />
              </View>

            </View>
          </ScrollView>

          <View className="px-6 py-4 bg-background border-t border-border flex-row gap-x-3">
            <View className="flex-1">
              <Button title="Cancel" onPress={() => router.back()} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button title="Update" onPress={handleSave} variant="primary" />
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
