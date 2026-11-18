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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
  DocumentTextIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  TrashIcon,
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
  toFrontendCategory,
  getCategoryTitle,
} from '@/services/popularService';
import { citizenService } from '@/services/citizenService';
import { getServiceById as getMockServiceById } from '@/services/mock/popularServices.data';
import { useComplaintStore } from '@/store/useComplaintStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface UploadedDocState {
  documentName: string;
  originalFileName: string;
  url: string;
  isUploading: boolean;
  error?: string;
}

export default function ServiceApplyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const params = useLocalSearchParams<{ serviceId: string }>();
  const serviceId = params.serviceId || '';

  const { profileName, phoneNumber, firstName, lastName } = useComplaintStore();
  const applicantName = (profileName || `${firstName || ''} ${lastName || ''}`).trim();
  const applicantMobile = phoneNumber ? phoneNumber.replace(/\D/g, '').slice(-10) : '';

  const [service, setService] = useState<PopularServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>('');

  // Map of documentName -> UploadedDocState
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocState>>({});

  const fetchServiceDetails = useCallback(async () => {
    try {
      const data = await popularService.getServiceById(serviceId);
      if (data) {
        setService(data);
      } else {
        // Fallback to mock data if service is not found by ID in backend
        const mock = getMockServiceById(serviceId);
        if (mock) {
          setService({
            id: mock.id as any,
            name: mock.title,
            category: mock.categoryId,
            description: mock.description,
            requiredDocuments: (mock.requiredDocuments || []).map((d: any) =>
              typeof d === 'string' ? d : d.name
            ),
            isActive: true,
          });
        }
      }
    } catch (err) {
      console.error('[ServiceApplyScreen] fetchServiceDetails error:', err);
      const mock = getMockServiceById(serviceId);
      if (mock) {
        setService({
          id: mock.id as any,
          name: mock.title,
          category: mock.categoryId,
          description: mock.description,
          requiredDocuments: (mock.requiredDocuments || []).map((d: any) =>
            typeof d === 'string' ? d : d.name
          ),
          isActive: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  // Handler to pick and upload a document for a specific required document slot
  const handlePickDocument = async (docName: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];

        // Set uploading state
        setUploadedDocs((prev) => ({
          ...prev,
          [docName]: {
            documentName: docName,
            originalFileName: file.name,
            url: '',
            isUploading: true,
          },
        }));

        try {
          const res = await citizenService.uploadFile(
            file.uri,
            file.name,
            file.mimeType || 'application/pdf',
            'popular-services'
          );
          const serverPath = res?.path || res?.data?.path || res?.fileUrl || file.uri;

          setUploadedDocs((prev) => ({
            ...prev,
            [docName]: {
              documentName: docName,
              originalFileName: file.name,
              url: serverPath,
              isUploading: false,
            },
          }));
        } catch (uploadErr) {
          console.error('[handlePickDocument] upload failed:', uploadErr);
          // Keep the local URI if upload failed so user doesn't lose file selection
          setUploadedDocs((prev) => ({
            ...prev,
            [docName]: {
              documentName: docName,
              originalFileName: file.name,
              url: file.uri,
              isUploading: false,
              error: 'Upload warning: file cached locally',
            },
          }));
        }
      }
    } catch (err) {
      console.error('[handlePickDocument] pick error:', err);
      Alert.alert(t('common.error', 'Error'), t('services.pickError', 'Failed to pick document'));
    }
  };

  const handleRemoveDocument = (docName: string) => {
    setUploadedDocs((prev) => {
      const updated = { ...prev };
      delete updated[docName];
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!service) return;

    // Check required documents
    const requiredList = service.requiredDocuments || [];
    const missingDocs: string[] = [];

    for (const reqDoc of requiredList) {
      if (!uploadedDocs[reqDoc] || !uploadedDocs[reqDoc].url) {
        missingDocs.push(reqDoc);
      }
    }

    if (missingDocs.length > 0) {
      Alert.alert(
        t('services.documentsRequired', 'Required Documents'),
        `${t('services.missingDocsMsg', 'Please upload all required documents:')}\n\n• ${missingDocs.join('\n• ')}`
      );
      return;
    }

    setSubmitting(true);
    try {
      const payloadDocuments = requiredList.map((docName) => ({
        documentName: docName,
        url: uploadedDocs[docName]?.url || '',
      }));

      const res = await popularService.applyForService({
        serviceId: Number(service.id) || 1,
        documents: payloadDocuments,
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

        <ScrollView
          className="flex-1 px-5 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Service Info Card */}
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

          {/* Applicant Details */}
          <View className="bg-surface border border-border rounded-2xl p-4 mb-5">
            <Text className="text-xs font-inter-bold text-dark uppercase tracking-wider mb-3">
              {t('services.applicantDetails', 'Applicant Details')}
            </Text>

            <View className="flex-row items-center mb-2.5">
              <UserIcon size={16} color={colors.secondary} />
              <Text className="text-xs font-inter text-secondary ml-2 w-20">
                {t('services.name', 'Name')}:
              </Text>
              <Text className="text-xs font-inter-bold text-dark flex-1">
                {applicantName || '—'}
              </Text>
            </View>

            <View className="flex-row items-center">
              <PhoneIcon size={16} color={colors.secondary} />
              <Text className="text-xs font-inter text-secondary ml-2 w-20">
                {t('services.mobile', 'Mobile')}:
              </Text>
              <Text className="text-xs font-inter-bold text-dark flex-1">
                {applicantMobile || '—'}
              </Text>
            </View>
          </View>

          {/* Required Documents Section */}
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-inter-bold text-dark uppercase tracking-wider">
                {t('services.requiredDocuments', 'Required Documents')} ({requiredList.length})
              </Text>
            </View>

            {requiredList.length === 0 ? (
              <View className="bg-surface border border-border rounded-2xl p-4 items-center">
                <Text className="text-xs font-inter text-secondary">
                  {t('services.noDocsRequired', 'No documents required for this service.')}
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {requiredList.map((docName, idx) => {
                  const uploadState = uploadedDocs[docName];
                  const isUploaded = !!uploadState?.url;
                  const isUploading = !!uploadState?.isUploading;

                  return (
                    <View
                      key={idx}
                      className="bg-surface border border-border rounded-2xl p-4"
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-row items-center flex-1 pr-2">
                          <DocumentTextIcon size={18} color={isUploaded ? colors.primary : colors.secondary} />
                          <Text className="text-sm font-inter-bold text-dark ml-2 flex-1">
                            {docName}
                          </Text>
                        </View>
                        {isUploaded && (
                          <View className="flex-row items-center bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircleIcon size={12} color="#059669" />
                            <Text className="text-[10px] font-inter-bold text-emerald-700 ml-1">
                              Uploaded
                            </Text>
                          </View>
                        )}
                      </View>

                      {isUploading ? (
                        <View className="flex-row items-center justify-center py-3 bg-primary-light/30 rounded-xl">
                          <ActivityIndicator size="small" color={colors.primary} />
                          <Text className="text-xs font-inter text-primary ml-2">
                            {t('services.uploading', 'Uploading document...')}
                          </Text>
                        </View>
                      ) : isUploaded ? (
                        <View className="flex-row items-center justify-between bg-surface-variant/50 p-2.5 rounded-xl border border-border/80">
                          <View className="flex-1 mr-2">
                            <Text className="text-xs font-inter-medium text-dark" numberOfLines={1}>
                              {uploadState.originalFileName}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleRemoveDocument(docName)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            className="p-1 rounded-md"
                          >
                            <TrashIcon size={18} color="#dc2626" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handlePickDocument(docName)}
                          className="flex-row items-center justify-center py-3 border border-dashed border-primary/50 bg-primary/5 rounded-xl"
                        >
                          <DocumentArrowUpIcon size={18} color={colors.primary} />
                          <Text className="text-xs font-inter-bold text-primary ml-2">
                            {t('services.chooseFile', 'Choose Document (PDF or Photo)')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Remarks */}
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

          {/* Submit Button */}
          <Button
            title={submitting ? t('services.submitting', 'Submitting...') : t('services.submitApplication', 'Submit Application')}
            onPress={handleSubmit}
            disabled={submitting}
            className="w-full mb-4"
          />
        </ScrollView>
      </View>
    </View>
  );
}
