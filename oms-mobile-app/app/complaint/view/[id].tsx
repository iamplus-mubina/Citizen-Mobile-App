import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';

const getComplaintDetails = (id: string | string[] | undefined) => {
  const finalId = Array.isArray(id) ? id[0] : id;
  return {
    id: finalId || 'CMP-1025',
    status: 'Pending Verification',
    category: 'Water Supply',
    title: 'Pipeline Leakage',
    description: 'Water leakage near my street for last 3 days.',
    address: 'Street 12, Green Park, Ward 5, Bhopal - 462001',
    priority: 'Medium'
  };
};

export default function ComplaintDetailsViewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const complaint = getComplaintDetails(id);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>
        <Header showBack />

        <View className="px-6 pb-6 pt-2">
          <Text className="text-lg font-inter-bold text-text">Complaint Details</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-between items-center mb-6 py-2">
            <Text className="text-base font-inter-bold text-text">{complaint.id}</Text>
            <View className="bg-secondary px-3 py-1 rounded-md border border-border">
              <Text className="text-xs font-inter-semibold text-text">{complaint.status}</Text>
            </View>
          </View>

          <View>
            <View className="mb-6">
              <Text className="text-sm font-inter-bold text-text mb-1">Category</Text>
              <Text className="text-sm font-inter text-muted">{complaint.category}</Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-inter-bold text-text mb-1">Title</Text>
              <Text className="text-sm font-inter text-muted">{complaint.title}</Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-inter-bold text-text mb-1">Description</Text>
              <Text className="text-sm font-inter text-muted leading-5">{complaint.description}</Text>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-inter-bold text-text mb-1">Address</Text>
              <Text className="text-sm font-inter text-muted leading-5">{complaint.address}</Text>
            </View>

            <View className="mb-8">
              <Text className="text-sm font-inter-bold text-text mb-1">Priority</Text>
              <Text className="text-sm font-inter text-muted">{complaint.priority}</Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 py-4 bg-background border-t border-border">
          <Button 
            title="View Timeline" 
            onPress={() => router.push({ pathname: '/complaint/timeline/[id]', params: { id: complaint.id } })}  
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
