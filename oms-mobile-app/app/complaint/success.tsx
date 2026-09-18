import { useEffect } from 'react';
import { View, Text, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckIcon, ClockIcon } from 'react-native-heroicons/solid';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const submittedComplaints = useComplaintStore(state => state.submittedComplaints);

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/home');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const reqId = params?.requestId ? String(params.requestId) : '';
  const matched = reqId
    ? submittedComplaints.find((c) => String(c.requestId) === reqId || String(c.id) === reqId)
    : null;

  const latestComplaint = matched || (submittedComplaints.length > 0 ? submittedComplaints[0] : null);
  const targetId = latestComplaint?.tokenNumber || String(latestComplaint?.requestId || latestComplaint?.id || reqId || '');

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className={containerClass}>
        <Header showBack title="Complaint Submitted" onBack={() => router.replace('/home')} />

        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-primary justify-center items-center mb-6 shadow-sm">
              <CheckIcon size={48} color={colors.surface} />
            </View>

            <Text className="text-2xl font-inter-bold text-dark mb-3 text-center px-4">
              Your complaint has been submitted
            </Text>

            <Text className="text-sm font-inter text-muted text-center leading-5 px-2">
              We have received your submission and forwarded it for review.
            </Text>
          </View>

          {/* Info Card: Approval notice instead of REQ- ID */}
          <View 
            className="w-full rounded-2xl p-6 items-center border border-primary/30" 
            style={{ backgroundColor: 'rgba(244, 194, 55, 0.08)' }}
          >
            {latestComplaint?.tokenNumber ? (
              <>
                <Text className="text-muted text-xs font-inter-medium mb-1">
                  Token Number
                </Text>
                <Text className="text-dark text-xl font-inter-bold mb-1">
                  {latestComplaint.tokenNumber}
                </Text>
              </>
            ) : (
              <>
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-3">
                  <ClockIcon size={22} color={colors.primary} />
                </View>
                <Text className="text-base font-inter-semibold text-dark text-center leading-6 mb-2">
                  Your complaint is filed and send for the approval, after approval the token number shall be generated for your complaint
                </Text>
              </>
            )}

            <Text className="text-muted text-xs font-inter mt-1">
              Submitted on {latestComplaint?.date || new Date().toLocaleDateString('en-IN')}
            </Text>
          </View>
        </View>

        <View className="px-6 py-4 border-t border-border bg-background space-y-3">
          <Button
            title="Track your complaint"
            variant="primary"
            onPress={() => router.replace({ 
              pathname: '/complaint/timeline/[id]', 
              params: { id: targetId, fromSuccess: 'true' } 
            })}
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
