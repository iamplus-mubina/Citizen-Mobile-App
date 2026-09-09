import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { ArrowLeftIcon, BellIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
  showBack?: boolean;
  title?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onBack?: () => void;
}

const DEFAULT_LOGO = require('../assets/images/oms_logo.png');

export function Header({ className = '', avatarUrl, showBack, title, notificationCount, onNotificationPress, onBack }: HeaderProps) {
  const router = useRouter();
  const { profileName, profilePhoto } = useComplaintStore();
  const { config, fetchSystemConfig, getBrandingPhotoUrl } = useSystemConfigStore();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const displayName = profileName || 'Citizen User';
  const displayAvatar = avatarUrl || profilePhoto;

  const brandingTopBar = config?.BRANDING_TOPBAR_TITLE || config?.BRANDING_TITLE || 'Office Management System';
  const brandingSub = config?.BRANDING_SUB_TITLE || 'OMS Citizen';
  const photoUrl = getBrandingPhotoUrl('L');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <View
      className={`px-4 pt-4 pb-4 bg-header-bg z-10 ${className}`}
    >
      {showBack ? (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={handleBack}
              className="p-2 -ml-3 mr-1 rounded-full"
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={24} color={colors.white} />
            </TouchableOpacity>
            <Text className="text-xl font-inter-bold text-white flex-1" numberOfLines={1}>
              {title || brandingTopBar}
            </Text>
          </View>
        </View>
      ) : (
        <View className="justify-center pt-2">

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3 border-2 border-white/10 overflow-hidden">
                <Image
                  source={photoUrl && !imgError ? { uri: Array.isArray(photoUrl) ? photoUrl[0] : photoUrl } : DEFAULT_LOGO}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() => setImgError(true)}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-inter-bold text-white tracking-wide" numberOfLines={1}>
                  {brandingTopBar}
                </Text>
                <Text className="text-xs font-inter-semibold text-white/70">
                  {brandingSub}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-black/20 border border-black/10 rounded-md px-3 py-2.5 flex-row items-center">
            {/* <UserCircleIcon size={18} color={colors.white} /> */}
            <Text className="text-xs font-inter-medium text-white/90">Welcome, {displayName}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
