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
  CalendarDaysIcon,
  MapPinIcon,
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

  const fetchApplication = useCallback(async () => {
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
      console.error('[ServiceRequestDetailsScreen] Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplication();
  };

  const appointment = useMemo(() => {
    if (application) return undefined;
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
  const scheduleDate = application?.scheduleDate || '';
  const schedulePlace = application?.schedulePlace || '';

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

  const formattedScheduleDate = useMemo(() => {
    if (!scheduleDate) return '';
    try {
      const d = new Date(scheduleDate);
      return `${d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}, ${d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`;
    } catch {
      return String(scheduleDate);
    }
  }, [scheduleDate]);

  const progressSteps: StepperTimelineStep[] = useMemo(() => {
    const isApproved = status === 'APPROVED';
    const isRejected = status === 'REJECTED';
    const isScheduled = status === 'SCHEDULED';

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
        title: t('services.stepScheduled', 'Meeting Scheduled'),
        date: formattedScheduleDate || undefined,
        description: isScheduled
          ? `${t('services.meetAt', 'Venue')}: ${schedulePlace || 'Municipal Office'}`
          : isApproved || isRejected
          ? t('services.stepReviewCompleted', 'Application reviewed by officer.')
          : t('services.stepReviewDesc', 'Municipal officer will review and schedule meeting.'),
        status: isApproved || isRejected ? 'completed' : isScheduled ? 'current' : 'future',
      },
      {
        id: 'step-3',
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
        status: isApproved ? 'completed' : isRejected ? 'future' : 'future',
      },
    ];
  }, [status, formattedDate, formattedScheduleDate, schedulePlace, rejectionReason, t]);

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
          title={t('services.requestDetails', 'Application Details')}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-5 pt-4"
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
              <Text className="text-xs font-inter text-secondary mt-3">
                {t('common.loading', 'Loading details...')}
              </Text>
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
                  ) : status === 'SCHEDULED' ? (
                    <View className="bg-indigo-50 border border-indigo-300 rounded-md px-2.5 py-1 flex-row items-center">
                      <CalendarDaysIcon size={14} color="#4338ca" />
                      <Text className="text-xs font-inter-bold text-indigo-700 ml-1.5">
                        Meeting Scheduled
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

              {/* Scheduled Meeting Notice Banner */}
              {status === 'SCHEDULED' && (
                <View className="bg-indigo-50 border border-indigo-300 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2.5">
                    <CalendarDaysIcon size={20} color="#4338ca" />
                    <Text className="text-sm font-inter-bold text-indigo-900 ml-2">
                      Meeting Scheduled by Officer
                    </Text>
                  </View>

                  {formattedScheduleDate ? (
                    <View className="flex-row items-start mb-1.5 ml-1">
                      <ClockIcon size={15} color="#4338ca" className="mt-0.5" />
                      <Text className="text-xs font-inter-bold text-indigo-950 ml-2">
                        Date & Time: <Text className="font-inter-medium text-indigo-800">{formattedScheduleDate}</Text>
                      </Text>
                    </View>
                  ) : null}

                  {schedulePlace ? (
                    <View className="flex-row items-start ml-1">
                      <MapPinIcon size={15} color="#4338ca" className="mt-0.5" />
                      <Text className="text-xs font-inter-bold text-indigo-950 ml-2">
                        Venue / Place: <Text className="font-inter-medium text-indigo-800">{schedulePlace}</Text>
                      </Text>
                    </View>
                  ) : null}

                  <Text className="text-[11px] font-inter text-indigo-700 mt-2.5 pt-2 border-t border-indigo-200">
                    Please visit the venue on the scheduled date & time with all required documents.
                  </Text>
                </View>
              )}

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
                  {t('services.applicantDetails', 'Applicant Details')}
                </Text>
                <View className="flex-row items-center mb-2">
                  <UserIcon size={15} color={colors.secondary} />
                  <Text className="text-xs font-inter text-secondary ml-2 w-20">Name:</Text>
                  <Text className="text-xs font-inter-bold text-dark flex-1">
                    {displayApplicantName}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <PhoneIcon size={15} color={colors.secondary} />
                  <Text className="text-xs font-inter text-secondary ml-2 w-20">Mobile:</Text>
                  <Text className="text-xs font-inter-bold text-dark flex-1">
                    {displayApplicantPhone || '—'}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <DocumentTextIcon size={15} color={colors.secondary} />
                  <Text className="text-xs font-inter text-secondary ml-2 w-20">Token #:</Text>
                  <Text className="text-xs font-inter-bold text-primary flex-1">
                    {displayToken}
                  </Text>
                </View>
              </View>

              {/* Applicant Remarks */}
              {displayRemarks ? (
                <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <ChatBubbleLeftEllipsisIcon size={16} color={colors.secondary} />
                    <Text className="text-sm font-inter-bold text-dark ml-2">
                      {t('services.applicantRemarks', 'Applicant Remarks')}
                    </Text>
                  </View>
                  <Text className="text-xs font-inter text-secondary leading-5">
                    {displayRemarks}
                  </Text>
                </View>
              ) : null}

              {/* Uploaded Documents */}
              {application?.documents && application.documents.length > 0 && (
                <View className="bg-surface border border-border rounded-2xl p-4 mb-4">
                  <Text className="text-sm font-inter-bold text-dark mb-3">
                    {t('services.submittedDocuments', 'Uploaded Documents')} (
                    {application.documents.length})
                  </Text>
                  <View className="space-y-2">
                    {application.documents.map((doc, idx) => (
                      <View
                        key={idx}
                        className="flex-row items-center justify-between p-3 bg-surface-variant/40 rounded-xl border border-border/80"
                      >
                        <View className="flex-row items-center flex-1 pr-2">
                          <DocumentTextIcon size={16} color={colors.primary} />
                          <Text
                            className="text-xs font-inter-semibold text-dark ml-2 flex-1"
                            numberOfLines={1}
                          >
                            {doc.documentName || `Document ${idx + 1}`}
                          </Text>
                        </View>
                        {doc.url ? (
                          <TouchableOpacity
                            onPress={() => handleOpenDoc(doc.url)}
                            className="flex-row items-center px-2.5 py-1 bg-primary/10 rounded-lg"
                          >
                            <Text className="text-[11px] font-inter-bold text-primary mr-1">
                              View
                            </Text>
                            <ArrowTopRightOnSquareIcon size={12} color={colors.primary} />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
