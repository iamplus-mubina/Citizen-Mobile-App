import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  MapIcon,
  ArrowRightStartOnRectangleIcon,
  GlobeAltIcon,
  BellIcon,
  IdentificationIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CakeIcon,
  TagIcon,
  TrashIcon,
  LanguageIcon,
  ChevronRightIcon,
  XMarkIcon
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { UploadModal } from '@/components/UploadModal';
import { useComplaintStore } from '@/store/useComplaintStore';
import { citizenService } from '@/services/citizenService';
import { removeStoredToken } from '@/services/api';
import { getCleanImageUrl } from '@/utils/image';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/store/useLanguageStore';

const formatDob = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const clean = String(dateStr).split('T')[0].split(' ')[0];
    if (clean.includes('-')) {
      const parts = clean.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return clean;
  } catch {
    return dateStr;
  }
};

export function Profile() {
  const router = useRouter();
  const { language, setLanguage, t } = useTranslation();
  const store = useComplaintStore();
  const {
    profilePhoto, setProfilePhoto, phoneNumber, profileName, profileEmail, profileAddress, profilePincode,
    alternatePhone,
    dob, age, gender, bloodGroup, education, occupation,
    aadharCard, panCard, voterId, drivingLicence, rationCard,
    religionName, castName, subCastName, caste, subCaste,
    setProfileFromApi
  } = store;

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cleanProfileUri = getCleanImageUrl(profilePhoto);

  React.useEffect(() => {
    setImgError(false);
  }, [cleanProfileUri]);

  const avatarUri = !imgError ? cleanProfileUri : null;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setImgError(false);
    try {
      const data = await citizenService.getProfile();
      if (data) {
        setProfileFromApi(data);
      }
    } catch (err) {
      console.warn('Failed to refresh profile:', err);
    } finally {
      setRefreshing(false);
    }
  }, [setProfileFromApi]);

  React.useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleLogout = async () => {
    try {
      await citizenService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await removeStoredToken();
      router.replace('/login');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await citizenService.deleteAccount();
      setDeleteModalVisible(false);
      await removeStoredToken();
      await AsyncStorage.removeItem('user_phone').catch(() => { });
      await AsyncStorage.removeItem('complaint_storage').catch(() => { });
      router.replace('/login');
    } catch (err: any) {
      console.error('Delete account error:', err);
      const msg = err?.response?.data?.message || 'Failed to delete account. Please try again.';
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDisplayGender = (val?: string | null) => {
    if (!val) return '-';
    const upper = val.toUpperCase();
    if (upper === 'MALE') return t('profile.male');
    if (upper === 'FEMALE') return t('profile.female');
    if (upper === 'OTHER') return t('profile.other');
    return val;
  };

  return (
    <View className="flex-1 w-full bg-background pt-6 px-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* Profile Avatar & Title */}
        <View className="items-center mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            className="relative mb-4"
          >
            <View className="w-24 h-24 rounded-full bg-primary-light items-center justify-center overflow-hidden border-2 border-primary/20">
              {avatarUri ? (
                <Image
                  key={avatarUri}
                  source={{ uri: avatarUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <UserIcon size={40} color={colors.primary} />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-background">
              <CameraIcon size={16} color={colors.dark} />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-dark mb-1">{profileName || 'Citizen'}</Text>
          <Text className="text-sm font-inter text-muted">{phoneNumber || '-'}</Text>
        </View>

        {/* 1. Contact & Address */}
        <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="flex-row justify-between items-center px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">{t('profile.contactAndAddress')}</Text>
            <TouchableOpacity
              onPress={() => router.push('/profile/edit')}
              activeOpacity={0.7}
              className="p-1.5 rounded-full bg-primary-light"
            >
              <PencilIcon size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <DetailRow icon={PhoneIcon} label={t('profile.mobileNumber')} value={phoneNumber} />
          {/* {alternatePhone ? <DetailRow icon={PhoneIcon} label="Alternate Phone" value={alternatePhone} /> : null} */}
          <DetailRow icon={EnvelopeIcon} label={t('profile.email')} value={profileEmail} />
          <DetailRow icon={MapPinIcon} label={t('profile.address')} value={profileAddress} isLast />
          {/* <DetailRow icon={MapIcon} label="Pincode" value={profilePincode} isLast /> */}
        </View>

        {/* 2. Personal Details */}
        <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">{t('profile.personalDetails')}</Text>
          </View>

          <DetailRow icon={CakeIcon} label={t('profile.dob')} value={formatDob(dob)} />
          <DetailRow icon={UserIcon} label={t('profile.gender')} value={getDisplayGender(gender)} isLast />
          {/* <DetailRow icon={TagIcon} label="Blood Group" value={bloodGroup} /> */}
          {/* <DetailRow icon={AcademicCapIcon} label="Education" value={education} /> */}
          {/* <DetailRow icon={BriefcaseIcon} label="Occupation" value={occupation} isLast /> */}
        </View>

        {/* 3. Identity Documents */}
        <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">{t('profile.identityDocs')}</Text>
          </View>

          {/* <DetailRow icon={IdentificationIcon} label="Aadhar Card" value={aadharCard} /> */}
          {/* <DetailRow icon={IdentificationIcon} label="PAN Card" value={panCard} /> */}
          <DetailRow icon={IdentificationIcon} label={t('profile.voterId')} value={voterId} isLast />
          {/* <DetailRow icon={IdentificationIcon} label="Driving Licence" value={drivingLicence} /> */}
          {/* <DetailRow icon={IdentificationIcon} label="Ration Card" value={rationCard} isLast /> */}
        </View>

        {/* Preferences */}
        <View className="bg-surface border border-border rounded-xl mb-6">
          <Text className="text-sm font-inter-bold text-dark px-4 pt-4 pb-3 border-b border-border">
            {t('profile.preferences')}
          </Text>

          {/* In-app notifications */}
          <View className="flex-row items-center px-4 py-3 border-b border-border">
            <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center mr-4">
              <BellIcon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-inter-bold text-dark">{t('profile.inAppNotifications')}</Text>
              <Text className="text-xs font-inter text-muted">{t('profile.notificationsDesc')}</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Language option - placed below In-app notifications */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLangModalVisible(true)}
            className="flex-row items-center px-4 py-3.5"
          >
            <View className="w-10 h-10 rounded-xl bg-primary-light items-center justify-center mr-4">
              <LanguageIcon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-inter-bold text-dark">{t('profile.language')}</Text>
              <Text className="text-xs font-inter text-muted mt-0.5">
                {language === 'mr' ? 'मराठी' : 'English'}
              </Text>
            </View>
            <ChevronRightIcon size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="flex-row items-center justify-center border border-primary rounded-xl py-4 mb-3 bg-surface"
        >
          <ArrowRightStartOnRectangleIcon size={20} color={colors.primary} />
          <Text className="text-base font-inter-bold text-primary ml-2">{t('profile.logout')}</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setDeleteError('');
            setDeleteModalVisible(true);
          }}
          className="flex-row items-center justify-center border border-rose-200 rounded-xl py-3.5 mb-4 bg-rose-50/50"
        >
          <TrashIcon size={18} color="#e11d48" />
          <Text className="text-sm font-inter-semibold text-rose-600 ml-2">{t('profile.deleteAccount')}</Text>
        </TouchableOpacity>

        {/* Powered by */}
        <View className="items-center justify-center pt-2 pb-8">
          <Text className="text-xs font-inter-medium text-muted tracking-wider">
            {t('profile.poweredBy')}
          </Text>
        </View>

      </ScrollView>

      <UploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={async (uri) => {
          // Optimistic UI update
          setImgError(false);
          setProfilePhoto(uri);
          setModalVisible(false);

          try {
            const rawFilename = uri.split('/').pop() || `profile_${Date.now()}.jpg`;
            const filename = rawFilename.includes('.') ? rawFilename : `${rawFilename}.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // 1. Upload to server
            const res = await citizenService.uploadFile(uri, filename, type);
            const serverPath = res?.path || res?.data?.path || '';

            if (serverPath) {
              // 2. Update citizen profile with new image path
              await citizenService.updateProfile({ ProfileImage: serverPath });
              AsyncStorage.setItem('user_profile_photo', serverPath).catch(() => { });

              // 3. Re-fetch to sync store perfectly
              try {
                const freshProfile = await citizenService.getProfile();
                if (freshProfile) {
                  setProfileFromApi(freshProfile);
                }
              } catch (refreshErr) {
                console.warn('Profile photo updated, background sync warning:', refreshErr);
              }
            }
          } catch (err) {
            console.error('Failed to upload profile photo:', err);
          }
        }}
      />

      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={() => setLangModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '100%', maxWidth: 460 }}>
                {/* Floating drag handle above sheet */}
                <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 8 }} />

                {/* White bottom sheet */}
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    paddingTop: 20,
                    paddingBottom: 36,
                    paddingHorizontal: 20,
                  }}
                >
                  {/* Header with Title & Close X */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                      {t('profile.chooseLanguage', 'Language')}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setLangModalVisible(false)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={{ padding: 4, borderRadius: 20 }}
                    >
                      <XMarkIcon size={22} color="#111827" />
                    </TouchableOpacity>
                  </View>

                  {/* Languages: English and Marathi (matching reference image) */}
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = language === lang.id;
                    return (
                      <TouchableOpacity
                        key={lang.id}
                        activeOpacity={0.7}
                        onPress={async () => {
                          await setLanguage(lang.id);
                          setLangModalVisible(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          height: 56,
                          paddingHorizontal: 16,
                          marginBottom: 12,
                          borderRadius: 14,
                          borderWidth: isSelected ? 1.5 : 1,
                          borderColor: isSelected ? '#5B3FC8' : '#E5E7EB',
                          backgroundColor: isSelected ? '#F5F3FF' : '#FFFFFF',
                        }}
                      >
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            borderWidth: isSelected ? 2.5 : 2,
                            borderColor: isSelected ? '#5B3FC8' : '#9CA3AF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                          }}
                        >
                          {isSelected && (
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#5B3FC8',
                              }}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? '#111827' : '#374151',
                          }}
                        >
                          {lang.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setDeleteModalVisible(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => !isDeleting && setDeleteModalVisible(false)}>
          <View className="flex-1 bg-black/60 justify-center items-center p-6">
            <TouchableWithoutFeedback>
              <View className="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl items-center">
                <View className="w-16 h-16 rounded-full bg-rose-100 justify-center items-center mb-4">
                  <TrashIcon size={32} color="#e11d48" />
                </View>

                <Text className="text-xl font-inter-bold text-dark text-center mb-2">
                  {t('profile.deleteModalTitle')}
                </Text>

                <Text className="text-sm font-inter text-muted text-center mb-6 leading-5">
                  {t('profile.deleteModalDesc')}
                </Text>

                {deleteError ? (
                  <Text className="text-xs font-inter-medium text-rose-600 text-center mb-4">
                    {deleteError}
                  </Text>
                ) : null}

                <View className="flex-row w-full gap-3">
                  <TouchableOpacity
                    disabled={isDeleting}
                    onPress={() => setDeleteModalVisible(false)}
                    className="flex-1 py-3.5 rounded-xl border border-border items-center justify-center bg-surface"
                    activeOpacity={0.7}
                  >
                    <Text className="text-sm font-inter-semibold text-dark">{t('profile.cancel')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={isDeleting}
                    onPress={handleDeleteAccount}
                    className="flex-1 py-3.5 rounded-xl bg-rose-600 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Text className="text-sm font-inter-semibold text-white">
                      {isDeleting ? t('profile.deleting') : t('profile.delete')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function DetailRow({
  icon: IconComponent,
  label,
  value,
  isLast = false
}: {
  icon: React.ComponentType<any>;
  label: string;
  value?: string | null;
  isLast?: boolean
}) {
  return (
    <View className={`flex-row items-center px-4 py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-4">
        <IconComponent size={20} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-inter-semibold text-muted mb-0.5">{label}</Text>
        <Text className="text-sm font-inter-medium text-dark">{value ? String(value) : '-'}</Text>
      </View>
    </View>
  );
}
