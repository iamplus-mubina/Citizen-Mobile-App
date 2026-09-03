import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Modal, TouchableWithoutFeedback } from 'react-native';
import { UserIcon, CameraIcon, PencilIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, MapIcon, ArrowRightStartOnRectangleIcon, GlobeAltIcon, BellIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { UploadModal } from '@/components/UploadModal';
import { useComplaintStore } from '@/store/useComplaintStore';

export function Profile() {
  const router = useRouter();
  const { profilePhoto, setProfilePhoto, phoneNumber, profileName, profileEmail, profileAddress, profilePincode } = useComplaintStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const LANGUAGES = ['English', 'हिंदी', 'मराठी'];

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View className="flex-1 w-full bg-background pt-6 px-5">
      <ScrollView showsVerticalScrollIndicator={false}>

        <View className="items-center mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            className="relative mb-4"
          >
            <View className="w-24 h-24 rounded-full bg-primary-light items-center justify-center overflow-hidden border-2 border-primary/20">
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <UserIcon size={40} color={colors.primary} />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-background">
              <CameraIcon size={16} color={colors.dark} />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-dark mb-1">{profileName}</Text>
          <Text className="text-sm font-inter text-muted">{phoneNumber}</Text>
        </View>


        <View
          className="bg-surface border border-border rounded-xl mb-4"
        >
          <View className="flex-row justify-between items-center px-4 pt-4 pb-3 border-b border-border">
            <Text className="text-sm font-inter-bold text-dark">Contact and address</Text>
            <TouchableOpacity
              onPress={() => router.push('/profile/edit')}
              activeOpacity={0.7}
              className="p-1.5 rounded-full bg-primary-light"
            >
              <PencilIcon size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <DetailRow icon={EnvelopeIcon} label="Email" value={profileEmail} />
          <DetailRow icon={MapPinIcon} label="Address" value={profileAddress} />
          <DetailRow icon={MapIcon} label="Ward / Pincode" value={profilePincode} isLast />
        </View>


        <View
          className="bg-surface border border-border rounded-xl mb-8"
        >
          <Text className="text-sm font-inter-bold text-dark px-4 pt-4 pb-3 border-b border-border">Preferences</Text>


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


          <View className="flex-row items-center px-4 py-3">
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
        </View>


        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          className="flex-row items-center justify-center border border-primary rounded-xl py-4 mb-8 bg-surface"
        >
          <ArrowRightStartOnRectangleIcon size={20} color={colors.primary} />
          <Text className="text-base font-inter-bold text-primary ml-2">Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      <UploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={(uri) => setProfilePhoto(uri)}
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
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-4 ${selectedLang === lang ? 'border-primary' : 'border-border'
                      }`}>
                      {selectedLang === lang && (
                        <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </View>
                    <Text className={`text-base font-inter-medium ${selectedLang === lang ? 'text-primary' : 'text-dark'
                      }`}>{lang}</Text>
                  </TouchableOpacity>
                ))}
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
  value: string;
  isLast?: boolean
}) {
  return (
    <View className={`flex-row items-center px-4 py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-4">
        <IconComponent size={20} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-inter-semibold text-muted mb-0.5">{label}</Text>
        <Text className="text-sm font-inter-medium text-dark">{value || '-'}</Text>
      </View>
    </View>
  );
}
