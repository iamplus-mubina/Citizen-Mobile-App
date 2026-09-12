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
  TagIcon
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { UploadModal } from '@/components/UploadModal';
import { ContactUsModal } from '@/components/ContactUsModal';
import { useComplaintStore } from '@/store/useComplaintStore';
import { citizenService } from '@/services/citizenService';
import { removeStoredToken } from '@/services/api';
import { getCleanImageUrl } from '@/utils/image';

export function Profile() {
  const router = useRouter();
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
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [refreshing, setRefreshing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cleanProfileUri = getCleanImageUrl(profilePhoto);

  React.useEffect(() => {
    setImgError(false);
  }, [cleanProfileUri]);

  const avatarUri = !imgError ? cleanProfileUri : null;

  const LANGUAGES = ['English', 'हिंदी', 'मराठी'];

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
            <Text className="text-sm font-inter-bold text-dark">Contact and Address</Text>
            <TouchableOpacity
              onPress={() => router.push('/profile/edit')}
              activeOpacity={0.7}
              className="p-1.5 rounded-full bg-primary-light"
            >
              <PencilIcon size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <DetailRow icon={PhoneIcon} label="Registered Mobile Number" value={phoneNumber} />
          {/* {alternatePhone ? <DetailRow icon={PhoneIcon} label="Alternate Phone" value={alternatePhone} /> : null} */}
          <DetailRow icon={EnvelopeIcon} label="Email" value={profileEmail} />
          <DetailRow icon={MapPinIcon} label="Address" value={profileAddress} isLast />
          {/* <DetailRow icon={MapIcon} label="Pincode" value={profilePincode} isLast /> */}
        </View>

        {/* 2. Personal Details */}
        <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">Personal Details</Text>
          </View>

          <DetailRow icon={CakeIcon} label="Date of Birth" value={dob} />
          <DetailRow icon={UserIcon} label="Gender" value={gender} isLast />
          {/* <DetailRow icon={TagIcon} label="Blood Group" value={bloodGroup} /> */}
          {/* <DetailRow icon={AcademicCapIcon} label="Education" value={education} /> */}
          {/* <DetailRow icon={BriefcaseIcon} label="Occupation" value={occupation} isLast /> */}
        </View>

        {/* 3. Identity Documents */}
        <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">Identity Documents</Text>
          </View>

          {/* <DetailRow icon={IdentificationIcon} label="Aadhar Card" value={aadharCard} /> */}
          {/* <DetailRow icon={IdentificationIcon} label="PAN Card" value={panCard} /> */}
          <DetailRow icon={IdentificationIcon} label="Voter ID" value={voterId} isLast />
          {/* <DetailRow icon={IdentificationIcon} label="Driving Licence" value={drivingLicence} /> */}
          {/* <DetailRow icon={IdentificationIcon} label="Ration Card" value={rationCard} isLast /> */}
        </View>

        {/* 4. Caste & Religion */}
        {/* <View className="bg-surface border border-border rounded-xl mb-4">
          <View className="px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">Caste & Religion</Text>
          </View>

          <DetailRow icon={TagIcon} label="Religion" value={religionName} />
          <DetailRow icon={TagIcon} label="Caste" value={castName || caste} />
          <DetailRow icon={TagIcon} label="Sub-Caste" value={subCastName || subCaste} isLast />
        </View> */}

        {/* Preferences */}
        <View className="bg-surface border border-border rounded-xl mb-6">
          <Text className="text-sm font-inter-bold text-dark px-4 pt-4 pb-3 border-b border-border">Preferences</Text>

          {/* TEMPORARILY HIDDEN - Language option
          <TouchableOpacity activeOpacity={0.7} onPress={() => setLangModalVisible(true)} className="flex-row items-center px-4 py-3 border-b border-border">
            <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-4">
              <GlobeAltIcon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-inter-bold text-dark">Language</Text>
              <Text className="text-xs font-inter text-muted">{selectedLang}</Text>
            </View>
            <Text className="text-xs font-inter text-muted mr-1">›</Text>
          </TouchableOpacity>
          */}

          <View className="flex-row items-center px-4 py-3 border-b border-border">
            <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-4">
              <BellIcon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-inter-bold text-dark">In-app notifications</Text>
              <Text className="text-xs font-inter text-muted">Status and registration updates</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Contact Us Option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setContactModalVisible(true)}
            className="flex-row items-center px-4 py-3"
          >
            <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-4">
              <PhoneIcon size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-inter-bold text-dark">Contact Us</Text>
              <Text className="text-xs font-inter text-muted">Helpline, office address & support</Text>
            </View>
            <Text className="text-base font-inter text-muted mr-1">›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="flex-row items-center justify-center border border-primary rounded-xl py-4 mb-4 bg-surface"
        >
          <ArrowRightStartOnRectangleIcon size={20} color={colors.primary} />
          <Text className="text-base font-inter-bold text-primary ml-2">Log out</Text>
        </TouchableOpacity>

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
              AsyncStorage.setItem('user_profile_photo', serverPath).catch(() => {});
              
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
          <View className="flex-1 bg-black/60 justify-end items-center">
            <TouchableWithoutFeedback>
              <View className="bg-surface w-full max-w-md rounded-t-2xl pt-4 pb-10 border-t border-border">
                <View className="w-10 h-1 rounded-full bg-border self-center mb-5" />
                <Text className="text-base font-inter-bold text-dark px-6 mb-4">Choose language</Text>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    activeOpacity={0.7}
                    onPress={() => { setSelectedLang(lang); setLangModalVisible(false); }}
                    className="flex-row items-center px-6 py-4"
                  >
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-4 ${selectedLang === lang ? 'border-primary' : 'border-border'}`}>
                      {selectedLang === lang && (
                        <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </View>
                    <Text className={`text-base font-inter-medium ${selectedLang === lang ? 'text-primary' : 'text-dark'}`}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ContactUsModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
      />
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
