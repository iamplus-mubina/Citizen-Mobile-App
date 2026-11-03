import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { StepperTimeline, StepperTimelineStep } from '@/components/StepperTimeline';
import { colors } from '@/constants/Colors';
import { usePopularServicesStore } from '@/store/usePopularServicesStore';

export default function ServiceRequestDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ requestId: string }>();
  const requestId = params.requestId ? String(params.requestId) : '';

  const getAppointmentById = usePopularServicesStore((s) => s.getAppointmentById);

  // Retrieve exact submitted request using its request ID
  const appointment = requestId ? getAppointmentById(requestId) : undefined;

  const displayRequestId = appointment?.appointmentId || requestId || '—';
  const displayServiceTitle = appointment?.serviceTitle || 'Service Request';
  const displayCategoryTitle = appointment?.categoryTitle || 'Popular Services';
  const displayApplicantName = appointment?.applicantName || 'Applicant';
  const displayApplicantPhone = appointment?.applicantPhone || '';
  const displayDate = appointment?.formattedDate || '';
  const displayDocuments = appointment?.requiredDocuments || [];

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background";

  const progressSteps: StepperTimelineStep[] = [
    {
      id: 'step-1',
      title: 'Submitted',
      date: displayDate || 'Recently',
      description: 'Your request has been recorded.',
      status: 'completed',
    },
    {
      id: 'step-2',
      title: 'Pending Admin Approval',
      description: 'Waiting for officer review and verification.',
      status: 'current',
    },
    {
      id: 'step-3',
      title: 'In Progress',
      status: 'future',
    },
    {
      id: 'step-4',
      title: 'Resolved',
      status: 'future',
    },
  ];

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={displayRequestId}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Status, Title and Timestamp */}
          <View className="mb-4 pt-1">
            <View className="flex-row items-center mb-2">
              <View className="bg-amber-50 border border-amber-300 rounded-md px-2.5 py-1 flex-row items-center">
                <PaperAirplaneIcon size={12} color={colors.warning} />
                <Text className="text-xs font-inter-semibold text-amber-800 ml-1.5">
                  Submitted
                </Text>
              </View>
            </View>

            <Text className="text-xl font-inter-bold text-dark leading-tight mb-1">
              {displayServiceTitle}
            </Text>
            <Text className="text-xs font-inter text-muted mb-1">
              {displayCategoryTitle}
            </Text>
            <Text className="text-xs font-inter text-muted">
              Submitted {displayDate}
            </Text>
          </View>

          {/* Complaint Progress */}
          <View className="bg-surface border border-border rounded-xl p-5 mb-4">
            <Text className="text-base font-inter-bold text-dark mb-2">
              Complaint Progress
            </Text>
            <StepperTimeline steps={progressSteps} />
          </View>

          {/* Messages */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <ChatBubbleLeftEllipsisIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-bold text-dark ml-2">
                Messages
              </Text>
            </View>
            <Text className="text-xs font-inter text-muted leading-5">
              Messages from the officer appear here. You can reply to them.
            </Text>
          </View>

          {/* History */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <ClockIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-bold text-dark ml-2">
                History
              </Text>
            </View>

            <View className="bg-background border border-border rounded-lg p-3 flex-row items-center">
              <View className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-50 items-center justify-center mr-3">
                <PaperAirplaneIcon size={14} color={colors.warning} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-inter-bold text-dark">
                  Request submitted
                </Text>
                <Text className="text-[11px] font-inter text-muted mt-0.5">
                  {displayDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Submitted Form Details */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <DocumentTextIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-bold text-dark ml-2">
                Your submitted form
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-inter text-muted mb-0.5">
                Applicant name
              </Text>
              <Text className="text-sm font-inter-medium text-dark">
                {displayApplicantName}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="text-xs font-inter text-muted mb-0.5">
                Applicant mobile number
              </Text>
              <Text className="text-sm font-inter-medium text-dark">
                {displayApplicantPhone ? `+91 ${displayApplicantPhone}` : '—'}
              </Text>
            </View>

            <View className="border-t border-border pt-3">
              <Text className="text-xs font-inter-bold text-dark mb-2">
                Required documents
              </Text>
              {displayDocuments.length > 0 ? (
                displayDocuments.map((doc) => (
                  <View key={doc.id} className="flex-row items-center mb-1.5">
                    <Text className="text-xs font-inter text-dark">
                      • {doc.name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-xs font-inter text-muted">
                  No required documents specified.
                </Text>
              )}
              {displayDocuments.length > 0 && (
                <Text className="text-xs font-inter text-muted mt-2">
                  You confirmed that you have these documents.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
