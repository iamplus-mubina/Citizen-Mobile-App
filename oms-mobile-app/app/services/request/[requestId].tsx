import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChatBubbleLeftEllipsisIcon,
  ClockIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
  PhoneIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { StepperTimeline, StepperTimelineStep } from '@/components/StepperTimeline';
import { colors } from '@/constants/Colors';
import {
  popularService,
  PopularServiceApplication,
  getCategoryTitle,
} from '@/services/popularService';
import { getFileViewUrl } from '@/services/citizenService';
import { usePopularServicesStore } from '@/store/usePopularServicesStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function ServiceRequestDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const params = useLocalSearchParams<{ requestId: string }>();
  const requestId = params.requestId ? String(params.requestId) : '';

  const getAppointmentById = usePopularServicesStore((s) => s.getAppointmentById);
  const [application, setApplication] = useState<PopularServiceApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchApplicationDetails = useCallback(async () => {
    if (!requestId) {
      setLoading(false);
      return;
    }
    try {
      const data = await popularService.getApplicationById(requestId);
      if (data) {
        setApplication(data);
      }
    } catch (err) {
      console.error('[ServiceRequestDetailsScreen] fetchApplicationDetails error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplicationDetails();
  };

  // Fallback to store appointment if not found in backend API
  const appointment = useMemo(() => {
    if (application) return null;
    return requestId ? getAppointmentById(requestId) : undefined;
  }, [application, requestId, getAppointmentById]);

  const displayToken = application?.tokenNumber || appointment?.appointmentId || requestId || '—';
  const displayServiceTitle = application?.service?.name || appointment?.serviceTitle || 'Service Request';
  const displayCategoryTitle = getCategoryTitle(
    application?.service?.category || appointment?.categoryTitle || 'Popular Services'
  );
  const displayApplicantName =
    application?.applicantName || appointment?.applicantName || 'Applicant';
  const displayApplicantPhone =
    application?.mobileNumber || appointment?.applicantPhone || '';
  const displayRemarks = application?.remarks || '';
  const status = application?.status || (appointment ? 'SUBMITTED' : 'PENDING');
  const rejectionReason = application?.rejectionReason || '';

  const formattedDate = useMemo(() => {
    if (application?.createdAt) {
      const d = new Date(application.createdAt);
      return `${d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}, ${d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).toLowerCase()}`;
    }
    return appointment?.formattedDate || '';
  }, [application, appointment]);

  const progressSteps: StepperTimelineStep[] = useMemo(() => {
    const isApproved = status === 'APPROVED';
    const isRejected = status === 'REJECTED';
    const isInProgress = status === 'IN_PROGRESS';

    return [
      {
        id: 'step-1',
        title: t('services.stepSubmitted', 'Submitted'),
        date: formattedDate || t('services.recently', 'Recently'),
        description: t('services.stepSubmittedDesc', 'Your application has been received.'),
        status: 'completed',
      },
      {
        id: 'step-2',
        title: t('services.stepReview', 'Under Review'),
        description: t('services.stepReviewDesc', 'Municipal officer is reviewing the application.'),
        status: isApproved || isRejected || isInProgress ? 'completed' : 'current',
      },
      {
        id: 'step-3',
        title: t('services.stepInProgress', 'Scrutiny & Processing'),
        description: t('services.stepInProgressDesc', 'Documents verification and field scrutiny.'),
        status: isApproved || isRejected ? 'completed' : isInProgress ? 'current' : 'future',
      },
      {
        id: 'step-4',
        title: isRejected
          ? t('services.stepRejected', 'Application Rejected')
          : isApproved
          ? t('services.stepApproved', 'Approved')
          : t('services.stepFinal', 'Final Decision'),
        description: isRejected
          ? rejectionReason || t('services.rejectedDefaultDesc', 'Application was not approved.')
          : isApproved
          ? t('services.approvedDefaultDesc', 'Service request has been approved.')
          : t('services.pendingFinalDesc', 'Approval decision will be notified here.'),
        status: isApproved || isRejected ? (isRejected ? 'future' : 'completed') : 'future',
      },
    ];
  }, [status, formattedDate, rejectionReason, t]);

  const handleOpenDoc = (url: string) => {
    if (!url) return;
    const fullUrl = getFileViewUrl(url) || url;
    Linking.openURL(fullUrl).catch((e) => console.log('Cannot open URL:', e));
  };

  const containerClass =
    Platform.OS === 'web'
      ? 'flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden'
      : 'flex-1 bg-background';

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={displayToken}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {/* Status Header */}
              <View className="mb-4 pt-1">
                <View className="flex-row items-center mb-2">
                  {status === 'APPROVED' ? (
                    <View className="bg-emerald-50 border border-emerald-300 rounded-md px-2.5 py-1 flex-row items-center">
                      <CheckCircleIcon size={14} color="#059669" />
                      <Text className="text-xs font-inter-bold text-emerald-700 ml-1.5">
                        Approved
                      </Text>
                    </View>
                  ) : status === 'REJECTED' ? (
                    <View className="bg-rose-50 border border-rose-300 rounded-md px-2.5 py-1 flex-row items-center">
                      <XCircleIcon size={14} color="#e11d48" />
                      <Text className="text-xs font-inter-bold text-rose-700 ml-1.5">
                        Rejected
                      </Text>
                    </View>
                  ) : status === 'IN_PROGRESS' ? (
                    <View className="bg-blue-50 border border-blue-300 rounded-md px-2.5 py-1 flex-row items-center">
                      <ClockIcon size={14} color="#2563eb" />
                      <Text className="text-xs font-inter-bold text-blue-700 ml-1.5">
                        In Progress
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-amber-50 border border-amber-300 rounded-md px-2.5 py-1 flex-row items-center">
                      <PaperAirplaneIcon size={13} color={colors.warning} />
                      <Text className="text-xs font-inter-bold text-amber-800 ml-1.5">
                        Submitted (Pending)
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="text-xl font-inter-bold text-dark leading-tight mb-1">
                  {displayServiceTitle}
                </Text>
                <Text className="text-xs font-inter text-secondary mb-1">
                  {displayCategoryTitle}
                </Text>
                {formattedDate ? (
                  <Text className="text-xs font-inter text-muted">
                    Submitted on {formattedDate}
                  </Text>
                ) : null}
              </View>

              {/* Rejection Notice Banner */}
              {status === 'REJECTED' && rejectionReason && (
                <View className="bg-rose-50 border border-rose-300 rounded-2xl p-4 mb-4 flex-row items-start">
                  <ExclamationCircleIcon size={20} color="#e11d48" className="mt-0.5" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-inter-bold text-rose-800">
                      Reason for Rejection
                    </Text>
                    <Text className="text-xs font-inter text-rose-700 mt-1 leading-5">
                      {rejectionReason}
                    </Text>
                  </View>
                </View>
              )}

              {/* Application Progress Stepper */}
              <View className="bg-surface border border-border rounded-2xl p-5 mb-4">
                <Text className="text-base font-inter-bold text-dark mb-2">
                  Application Progress
                </Text>
                <StepperTimeline steps={progressSteps} />
              </View>

              {/* Submitted Applicant Details */}
              <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
                <Text className="text-sm font-inter-bold text-dark mb-3">
                  Applicant Information
                </Text>

                <View className="flex-row items-center mb-2.5">
                  <UserIcon size={16} color={colors.secondary} />
                  <Text className="text-xs font-inter text-secondary ml-2 w-24">
                    Applicant:
                  </Text>
                  <Text className="text-xs font-inter-bold text-dark flex-1">
                    {displayApplicantName}
                  </Text>
                </View>

                <View className="flex-row items-center mb-2.5">
                  <PhoneIcon size={16} color={colors.secondary} />
                  <Text className="text-xs font-inter text-secondary ml-2 w-24">
                    Mobile:
                  </Text>
                  <Text className="text-xs font-inter-bold text-dark flex-1">
                    {displayApplicantPhone ? `+91 ${displayApplicantPhone}` : '—'}
                  </Text>
                </View>

                {displayRemarks ? (
                  <View className="mt-2 pt-2.5 border-t border-border/60">
                    <Text className="text-xs font-inter text-secondary mb-1">
                      Applicant Remarks:
                    </Text>
                    <Text className="text-xs font-inter-medium text-dark leading-5">
                      {displayRemarks}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Uploaded Documents */}
              <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <DocumentTextIcon size={18} color={colors.primary} />
                  <Text className="text-sm font-inter-bold text-dark ml-2">
                    Submitted Documents ({application?.documents?.length || appointment?.requiredDocuments?.length || 0})
                  </Text>
                </View>

                {application?.documents && application.documents.length > 0 ? (
                  <View className="space-y-2">
                    {application.documents.map((doc, idx) => (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        onPress={() => handleOpenDoc(doc.url)}
                        className="bg-background border border-border rounded-xl p-3 flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center flex-1 mr-2">
                          <DocumentTextIcon size={16} color={colors.primary} />
                          <Text
                            className="text-xs font-inter-bold text-dark ml-2 flex-1"
                            numberOfLines={1}
                          >
                            {doc.documentName}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Text className="text-[11px] font-inter-medium text-primary mr-1">
                            View
                          </Text>
                          <ArrowTopRightOnSquareIcon size={13} color={colors.primary} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : appointment?.requiredDocuments && appointment.requiredDocuments.length > 0 ? (
                  <View className="space-y-1.5">
                    {appointment.requiredDocuments.map((doc) => (
                      <View key={doc.id} className="flex-row items-center">
                        <Text className="text-xs font-inter text-dark">• {doc.name}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className="text-xs font-inter text-secondary">
                    No documents attached.
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
