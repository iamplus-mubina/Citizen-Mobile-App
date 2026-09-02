import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

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

  const confirmSubmit = () => {
    setShowWebModal(false);
    submitComplaint();
    resetForm();
    router.replace('/complaint/success');
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

        <Header showBack />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-2">
            <Text className="text-2xl font-inter-bold text-dark mb-4 mt-2">Raise a complaint</Text>
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


            <View className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'rgba(244, 194, 55, 0.1)' }}>
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

