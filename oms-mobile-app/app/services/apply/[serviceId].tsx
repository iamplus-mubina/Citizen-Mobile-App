import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { ServiceCategoryIcon } from '@/components/ServiceCategoryIcon';
import { colors } from '@/constants/Colors';
import {
  popularService,
  PopularServiceItem,
  getCategoryTitle,
  toFrontendCategory,
} from '@/services/popularService';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function ServiceApplyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const params = useLocalSearchParams<{ serviceId: string }>();
  const serviceId = params.serviceId || '';

  const [service, setService] = useState<PopularServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // User-editable fields
  const [applicantName, setApplicantName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  const fetchServiceDetails = useCallback(async () => {
    try {
      const data = await popularService.getServiceById(serviceId);
      setService(data);
    } catch (err) {
      console.error('[ServiceApplyScreen] fetchServiceDetails error:', err);
      setService(null);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleSubmit = async () => {
    if (!service) return;

    // Validate name
    if (!applicantName.trim()) {
      Alert.alert(
        t('common.error', 'Error'),
        t('services.nameRequired', 'Please enter your full name.')
      );
      return;
    }

    // Validate mobile — 10 digits
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      Alert.alert(
        t('common.error', 'Error'),
        t('services.mobileRequired', 'Please enter a valid 10-digit mobile number.')
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await popularService.applyForService({
        serviceId: Number(service.id),
        applicantName: applicantName.trim(),
        mobileNumber: cleanMobile,
        remarks: remarks.trim() || undefined,
      });

      if (res && res.success && res.data) {
        const app = res.data;
        router.replace({
          pathname: '/services/success' as any,
          params: {
            tokenNumber: app.tokenNumber,
            applicationId: String(app.id),
            serviceName: service.name,
            requestId: app.tokenNumber || String(app.id),
          },
        });
      } else {
        Alert.alert(
          t('common.error', 'Error'),
          res?.message || t('services.submitError', 'Failed to submit application. Please try again.')
        );
      }
    } catch (err: any) {
      console.error('[ServiceApplyScreen] handleSubmit error:', err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        t('services.submitError', 'Failed to submit application. Please try again.');
      Alert.alert(t('common.error', 'Error'), Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const containerClass =
    Platform.OS === 'web'
      ? 'flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden'
      : 'flex-1 bg-background';

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!service) {
    return (
      <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
        <View className={containerClass}>
          <Header showBack title={t('services.applyTitle', 'Apply for Service')} onBack={() => router.back()} />
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-base font-inter-semibold text-dark">
              {t('services.notFound', 'Service Not Found')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const frontendKey = toFrontendCategory(String(service.category));
  const categoryTitle = getCategoryTitle(String(service.category));
  const requiredList = service.requiredDocuments || [];

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={t('services.applyTitle', 'Apply for Service')}
          onBack={() => router.back()}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-5 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Service Info Card ── */}
            <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
              <View className="flex-row items-center mb-2">
                <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center mr-3">
                  <ServiceCategoryIcon category={frontendKey} size={20} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-inter-semibold text-primary uppercase tracking-wider">
                    {categoryTitle}
                  </Text>
                  <Text className="text-base font-inter-bold text-dark leading-snug">
                    {service.name}
                  </Text>
                </View>
              </View>

              {service.description ? (
                <Text className="text-xs font-inter text-secondary leading-5 mt-1 border-t border-border/60 pt-2">
                  {service.description}
                </Text>
              ) : null}
            </View>

            {/* ── Applicant Details (Editable) ── */}
            <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
              <Text className="text-xs font-inter-bold text-dark uppercase tracking-wider mb-3">
                {t('services.applicantDetails', 'Applicant Details')}
              </Text>

              {/* Full Name */}
              <View className="mb-3">
                <View className="flex-row items-center mb-1.5">
                  <UserIcon size={15} color={colors.secondary} />
                  <Text className="text-xs font-inter-semibold text-secondary ml-1.5">
                    {t('services.fullName', 'Full Name')} *
                  </Text>
                </View>
                <TextInput
                  value={applicantName}
                  onChangeText={setApplicantName}
                  placeholder={t('services.enterFullName', 'Enter your full name')}
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  className="border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-dark bg-background"
                />
              </View>

              {/* Mobile Number */}
              <View>
                <View className="flex-row items-center mb-1.5">
                  <PhoneIcon size={15} color={colors.secondary} />
                  <Text className="text-xs font-inter-semibold text-secondary ml-1.5">
                    {t('services.mobileNumber', 'Mobile Number')} *
                  </Text>
                </View>
                <TextInput
                  value={mobileNumber}
                  onChangeText={(v) => setMobileNumber(v.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('services.enterMobile', 'Enter 10-digit mobile number')}
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                  className="border border-border rounded-xl px-3 py-2.5 text-sm font-inter text-dark bg-background"
                />
              </View>
            </View>

            {/* ── Required Documents Info ── */}
            <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
              <View className="flex-row items-center mb-3">
                <InformationCircleIcon size={18} color={colors.primary} />
                <Text className="text-xs font-inter-bold text-dark uppercase tracking-wider ml-2">
                  {t('services.requiredDocuments', 'Required Documents')}
                  {requiredList.length > 0 ? ` (${requiredList.length})` : ''}
                </Text>
              </View>

              {requiredList.length === 0 ? (
                <Text className="text-xs font-inter text-secondary">
                  {t('services.noDocsRequired', 'No documents required for this service.')}
                </Text>
              ) : (
                <View>
                  <Text className="text-xs font-inter text-secondary mb-2.5 leading-4">
                    {t('services.bringDocuments', 'Please carry the following documents when visiting the office:')}
                  </Text>
                  {requiredList.map((docName, idx) => (
                    <View key={idx} className="flex-row items-start mb-2">
                      <View className="w-5 h-5 rounded-full bg-primary-light items-center justify-center mr-2.5 mt-0.5">
                        <DocumentTextIcon size={12} color={colors.primary} />
                      </View>
                      <Text className="text-sm font-inter-medium text-dark flex-1 leading-5">
                        {docName}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* ── Remarks (Optional) ── */}
            <View className="bg-surface border border-border rounded-2xl p-4 mb-6">
              <Text className="text-xs font-inter-bold text-dark uppercase tracking-wider mb-2">
                {t('services.remarksOptional', 'Remarks (Optional)')}
              </Text>
              <TextInput
                placeholder={t('services.remarksPlaceholder', 'Add any additional note or instructions...')}
                placeholderTextColor={colors.muted}
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="border border-border rounded-xl p-3 text-xs font-inter text-dark min-h-[70px] bg-background"
              />
            </View>

            {/* ── Submit ── */}
            <Button
              title={submitting ? t('services.submitting', 'Submitting...') : t('services.submitApplication', 'Submit Application')}
              onPress={handleSubmit}
              disabled={submitting}
              className="w-full mb-4"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
