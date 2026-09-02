import { View, Text, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckIcon } from 'react-native-heroicons/solid';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function SuccessScreen() {
  const router = useRouter();
  const submittedComplaints = useComplaintStore(state => state.submittedComplaints);


  const latestComplaint = submittedComplaints.length > 0 ? submittedComplaints[0] : {
    ticketId: 'CMP-1025',
    date: '13 May 2024'
  };

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>

        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-10">
            <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-6">
              <CheckIcon size={48} color={colors.surface} />
            </View>

            <Text className="text-2xl font-inter-bold text-dark mb-3 text-center px-4">
              Your complaint has been submitted
            </Text>

            <Text className="text-sm font-inter text-muted text-center leading-5 px-2">
              We are reviewing it. Every change will appear in your timeline and notifications.
            </Text>
          </View>

          <View className="w-full rounded-xl py-6 px-4 items-center border border-primary" style={{ backgroundColor: 'rgba(244, 194, 55, 0.08)' }}>
            <Text className="text-muted text-xs font-inter-medium mb-1">
              Complaint ID
            </Text>
            <Text className="text-dark text-xl font-inter-bold mb-1">
              {latestComplaint.ticketId}
            </Text>
            <Text className="text-muted text-xs font-inter">
              {latestComplaint.date}
            </Text>
          </View>
        </View>

        <View className="px-6 py-4 border-t border-border bg-background space-y-3">
          <Button
            title="Track complaint"
            variant="primary"
            onPress={() => router.push(`/complaint/timeline/${latestComplaint.ticketId}`)}
            className="w-full"
          />
          <View className="mt-3">
            <Button
              title="Return home"
              variant="outline"
              onPress={() => router.replace('/home')}
              className="w-full"
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
