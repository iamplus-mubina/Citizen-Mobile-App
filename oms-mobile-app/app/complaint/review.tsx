import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function ReviewScreen() {
  const router = useRouter();
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
  } = useComplaintStore();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleSubmit = () => {
    Alert.alert(
      'Submit Complaint',
      'Are you sure you want to submit this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            resetForm();
            router.replace('/complaint/success');
          },
        },
      ]
    );
  };

  const fullAddress = [address, area, ward, pincode].filter(Boolean).join(', ');
  const attachmentSummary = [
    photoCount > 0 ? `${photoCount} Photo${photoCount > 1 ? 's' : ''}` : null,
    documentCount > 0 ? `${documentCount} Document${documentCount > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ') || 'None';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>

        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-inter-bold text-text ml-2">Review Your Complaint</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <ReviewRow label="Category" value={category || '-'} />
            <ReviewRow label="Title" value={title || '-'} />
            <ReviewRow label="Description" value={description || '-'} />
            <ReviewRow label="Address" value={fullAddress || '-'} />
            <ReviewRow label="Priority" value={priority || '-'} />
            <ReviewRow label="Attachments" value={attachmentSummary} isLast />
          </View>
        </ScrollView>

        <View className="px-6 py-4 border-t border-border bg-background">
          <Button title="Submit Complaint" onPress={handleSubmit} />
        </View>

      </View>
    </SafeAreaView>
  );
}

function ReviewRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`py-4 ${!isLast ? 'border-b border-border' : ''}`}>
      <Text className="text-xs font-inter-semibold text-muted mb-1">{label}</Text>
      <Text className="text-base font-inter text-text">{value}</Text>
    </View>
  );
}
