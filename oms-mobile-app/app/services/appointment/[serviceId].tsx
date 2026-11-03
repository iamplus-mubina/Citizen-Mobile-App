import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CalendarDaysIcon,
  DocumentTextIcon,
  UserIcon,
  CheckIcon,
  InformationCircleIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { getServiceById, getCategoryTitle } from '@/services/mock/popularServices.data';
import { useComplaintStore } from '@/store/useComplaintStore';
import { usePopularServicesStore } from '@/store/usePopularServicesStore';

export default function BookAppointmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ serviceId: string }>();
  const service = getServiceById(params.serviceId || '');

  // Prefill details from authenticated citizen profile (or empty if unauthenticated)
  const { profileName, phoneNumber, firstName, lastName } = useComplaintStore();
  const bookAppointment = usePopularServicesStore((s) => s.bookAppointment);

  const profileFullName = (profileName || `${firstName || ''} ${lastName || ''}`).trim();
  const profileMobileNumber = phoneNumber ? phoneNumber.replace(/\D/g, '').slice(-10) : '';

  const [applicantName, setApplicantName] = useState(profileFullName);
  const [applicantMobile, setApplicantMobile] = useState(profileMobileNumber);
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background justify-between";

  if (!service) {
    return (
      <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
        <View className={containerClass}>
          <Header showBack title="Book appointment" onBack={() => router.back()} />
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-base font-inter-semibold text-dark">
              Service Not Found
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const isFormValid =
    documentsConfirmed &&
    applicantName.trim().length > 0 &&
    applicantMobile.trim().length === 10;

  const handleBookAppointment = () => {
    if (!isFormValid) return;

    const apptId = bookAppointment({
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.categoryId,
      categoryTitle: getCategoryTitle(service.categoryId),
      applicantName: applicantName.trim(),
      applicantPhone: applicantMobile.trim(),
      appointmentDate: 'Pending Office Confirmation',
      timeSlot: 'Pending Office Allocation',
      venue: 'Municipal Council Office',
      documentsConfirmed,
      requiredDocuments: service.requiredDocuments || [],
    });

    router.replace({
      pathname: '/services/success' as any,
      params: { requestId: apptId },
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title="Book appointment"
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {/* Service Information */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-1.5">
              <DocumentTextIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-semibold text-dark ml-2">
                Service
              </Text>
            </View>
            <Text className="text-base font-inter-bold text-dark mt-1 mb-1">
              {service.title}
            </Text>
            <Text className="text-xs font-inter text-muted leading-5">
              {service.description}
            </Text>
          </View>

          {/* Applicant Details */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <UserIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-semibold text-dark ml-2">
                Applicant
              </Text>
            </View>

            <Text className="text-xs font-inter-semibold text-dark mb-1.5">
              Applicant name *
            </Text>
            <TextInput
              value={applicantName}
              onChangeText={setApplicantName}
              placeholder="Enter applicant name"
              placeholderTextColor={colors.muted}
              className="w-full bg-surface border border-border rounded-md px-3.5 py-2.5 text-sm font-inter text-dark mb-4"
              style={Platform.OS === 'web' ? { outlineWidth: 0 } as any : {}}
            />

            <Text className="text-xs font-inter-semibold text-dark mb-1.5">
              Applicant mobile number *
            </Text>
            <View className="flex-row w-full border border-border rounded-md overflow-hidden bg-surface mb-1">
              <View className="px-3.5 py-2.5 bg-background border-r border-border items-center justify-center">
                <Text className="text-sm font-inter-semibold text-dark">+91</Text>
              </View>
              <TextInput
                value={applicantMobile}
                onChangeText={setApplicantMobile}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="10-digit mobile number"
                placeholderTextColor={colors.muted}
                className="flex-1 px-3.5 py-2.5 text-sm font-inter text-dark"
                style={Platform.OS === 'web' ? { outlineWidth: 0 } as any : {}}
              />
            </View>
            <Text className="text-xs font-inter text-muted mt-1">
              The office calls this number about the appointment.
            </Text>
          </View>

          {/* Required Documents */}
          <View className="bg-surface border border-border rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-1">
              <DocumentTextIcon size={18} color={colors.primary} />
              <Text className="text-sm font-inter-semibold text-dark ml-2">
                Required documents
              </Text>
            </View>
            <Text className="text-xs font-inter text-muted mb-3 leading-4">
              Bring these documents to your appointment. You do not need to upload them.
            </Text>

            <View className="pt-3 border-t border-border">
              {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
                service.requiredDocuments.map((doc) => (
                  <View key={doc.id} className="flex-row items-center mb-3">
                    <DocumentTextIcon size={18} color={colors.primary} />
                    <Text className="text-xs font-inter-medium text-dark ml-2.5 flex-1">
                      {doc.name}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="flex-row items-center mb-3">
                  <DocumentTextIcon size={18} color={colors.primary} />
                  <Text className="text-xs font-inter-medium text-dark ml-2.5 flex-1">
                    Identity Proof (Aadhar / Voter ID)
                  </Text>
                </View>
              )}
            </View>

            {/* Document Availability Confirmation */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDocumentsConfirmed(!documentsConfirmed)}
              className={`mt-2 p-3.5 rounded-xl border flex-row items-center ${
                documentsConfirmed
                  ? 'bg-primary-light border-primary'
                  : 'bg-surface border-border'
              }`}
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  documentsConfirmed
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                {documentsConfirmed && (
                  <CheckIcon size={14} color={colors.dark} strokeWidth={3} />
                )}
              </View>
              <Text className={`text-xs flex-1 leading-5 ${documentsConfirmed ? 'font-inter-semibold text-dark' : 'font-inter-medium text-dark'}`}>
                I confirm that the required documents are available with me.
              </Text>
            </TouchableOpacity>
          </View>

          {/* What Happens Next */}
          <View className="rounded-xl p-4 mb-6 flex-row items-start bg-primary-light border border-primary/30">
            <InformationCircleIcon size={20} color={colors.primary} className="mt-0.5 mr-2.5" />
            <View className="flex-1">
              <Text className="text-xs font-inter-bold text-dark mb-1">
                What happens next
              </Text>
              <Text className="text-xs font-inter text-dark leading-5">
                The office will confirm the date, time and place of your appointment. It appears in My activity, with any messages.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-20">
          <TouchableOpacity
            onPress={handleBookAppointment}
            activeOpacity={0.8}
            disabled={!isFormValid}
            style={!isFormValid && Platform.OS === 'web' ? { cursor: 'not-allowed' } as any : {}}
            className={`py-3.5 px-5 rounded-xl flex-row items-center justify-center border ${
              isFormValid
                ? 'bg-primary border-primary'
                : 'bg-secondary border-border'
            }`}
          >
            <CalendarDaysIcon
              size={18}
              color={isFormValid ? colors.dark : colors.muted}
            />
            <Text
              className={`text-sm ml-2 ${
                isFormValid
                  ? 'font-inter-bold text-dark'
                  : 'font-inter-semibold text-muted'
              }`}
            >
              Book appointment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
