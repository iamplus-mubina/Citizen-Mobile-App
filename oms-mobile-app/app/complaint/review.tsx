import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { api } from '@/services/api';

export default function ReviewScreen() {
  const router = useRouter();
  const [showWebModal, setShowWebModal] = useState(false);
  const {
    category,
    title,
    description,
    priority,
    address,
    area,
    ward,
    pincode,
    photoCount,
    documentCount,
    resetForm,
    submitComplaint,
  } = useComplaintStore();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background relative"
    : "flex-1 bg-background";

  const confirmSubmit = async () => {
    setShowWebModal(false);
    try {

      let catId = 1;
      let tId = 10;
      const catName = (category || '').toLowerCase();
      if (catName.includes('road')) {
        catId = 3; // रस्ते
        tId = 10;
      } else if (catName.includes('garbage') || catName.includes('waste') || catName.includes('sanitation')) {
        catId = 4; // कचरा व्यवस्थापन
        tId = 10;
      } else if (catName.includes('light') || catName.includes('street')) {
        catId = 7; // इतर / Street Light
        tId = 10;
      } else if (catName.includes('water') || catName.includes('drainage')) {
        catId = 1; // पाणी व्यवस्थापन
        tId = 10;
      }

      const payload: any = {
        categoryId: catId,
        typeId: tId,
        departmentId: 2,
        description: description || 'Testing complaint from mobile app',
        address: {
          line1: [address, area, ward].filter(Boolean).join(', ') || 'Main Street',
          locality: pincode || 'Pune'
        },
      };

      const response = await api.post('/citizen/complaints/submit', payload);
      const requestId = response.data?.requestId;
      console.log('Complaint submitted, requestId:', requestId);

      // Fetch fresh complaints from API
      try {
        const res = await api.post('/citizen/complaints/my-complaints', { page: { number: 0, size: 10 }, status: '' });
        const complaintsList = Array.isArray(res.data) ? (Array.isArray(res.data[0]) ? res.data[0] : res.data) : [];
        const setComplaints = useComplaintStore.getState().setComplaints;
        if (setComplaints) setComplaints(complaintsList);
      } catch (e) {
        console.error('Error refreshing complaints:', e);
      }

      resetForm();
      router.replace('/complaint/success');
    } catch (err: any) {
      console.error('Submit complaint error:', err);
      let errorMsg = 'Failed to submit complaint. Please try again.';
      if (err.response?.data?.message) {
        errorMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
      }
      Alert.alert('Backend Error', errorMsg);
    }
  };

  const handleSubmit = () => {
    if (Platform.OS === 'web') {
      setShowWebModal(true);
    } else {
      Alert.alert(
        'Submit Complaint',
        'Are you sure you want to submit this complaint?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: confirmSubmit,
          },
        ]
      );
    }
  };

  const fullAddress = [address, area, ward, pincode].filter(Boolean).join(', ');
  const attachmentSummary = [
    photoCount > 0 ? `${photoCount} Photo${photoCount > 1 ? 's' : ''}` : null,
    documentCount > 0 ? `${documentCount} Document${documentCount > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ') || 'No files attached';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>

        <Header showBack title="Raise a complaint" />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-2">
            <View className="mt-2" />
            <FormStepper currentStep={5} totalSteps={5} />
            <Text className="text-2xl font-inter-bold text-dark mt-6 mb-2">Review your complaint</Text>
            <Text className="text-sm font-inter text-muted mb-6">
              Check the information before sending it to the Municipal Corporation.
            </Text>
          </View>

          <View className="mb-6">

            <View className="bg-surface border border-border rounded-xl p-4 mb-4">
              <Text className="text-sm font-inter-bold text-header-bg mb-2">Issue</Text>
              <Text className="text-base font-inter text-dark mb-1">{category || '-'}</Text>
              <Text className="text-sm font-inter text-dark mb-1">{title || '-'}</Text>
              <Text className="text-sm font-inter text-muted">{description || '-'}</Text>
            </View>


            <View className="bg-surface border border-border rounded-xl p-4 mb-4">
              <Text className="text-sm font-inter-bold text-header-bg mb-2">Location</Text>
              <Text className="text-base font-inter text-dark mb-1">{address || '-'}</Text>
              <Text className="text-sm font-inter text-dark mb-1">{area || '-'}</Text>
              <Text className="text-sm font-inter text-dark mb-1">{ward || '-'}</Text>
              <Text className="text-sm font-inter text-muted">{pincode || '-'}</Text>
            </View>


            <View className="bg-surface border border-border rounded-xl p-4 mb-4">
              <Text className="text-sm font-inter-bold text-header-bg mb-2">Evidence</Text>
              <Text className="text-base font-inter text-dark">{attachmentSummary}</Text>
            </View>


            <View className="p-4 rounded-xl mb-4 bg-primary/10">
              <Text className="font-inter-bold text-dark text-[15px] mb-1">What happens next</Text>
              <Text className="font-inter text-dark/80 text-sm leading-5">
                Your complaint will enter Pending verification. You can track every public status change.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 py-4 border-t border-border bg-background flex-row gap-x-3">
          <View className="flex-[0.8]">
            <Button title="Back" onPress={() => router.back()} variant="outline" />
          </View>
          <View className="flex-[1.2]">
            <Button title="Submit complaint" onPress={handleSubmit} variant="primary" />
          </View>
        </View>

        {Platform.OS === 'web' && (
          <Modal
            transparent={true}
            visible={showWebModal}
            animationType="fade"
            onRequestClose={() => setShowWebModal(false)}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-surface w-11/12 max-w-sm rounded-lg p-6 border border-border">
                <Text className="text-xl font-inter-bold text-dark mb-2">Submit Complaint</Text>
                <Text className="text-base font-inter text-muted mb-8">Are you sure you want to submit this complaint?</Text>

                <View className="flex-row justify-end gap-3 mt-2">
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => setShowWebModal(false)}
                    className="flex-1"
                  />
                  <Button
                    title="Submit"
                    variant="primary"
                    onPress={confirmSubmit}
                    className="flex-1"
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}

      </View>
    </SafeAreaView>
  );
}

