import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ArrowLeftIcon, BellIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { getCleanImageUrl } from '@/utils/image';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
  showBack?: boolean;
  title?: string;
  subtitle?: string;
  bottomText?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onBack?: () => void;
}

const DEFAULT_LOGO = require('../assets/images/citizen_logo.png');
const HEADER_BG = require('../assets/images/header_bg.jpg');

export function Header({ 
  className = '', 
  avatarUrl, 
  showBack, 
  title, 
  subtitle,
  bottomText,
  notificationCount, 
  onNotificationPress, 
  onBack 
}: HeaderProps) {
  const router = useRouter();
  const { profileName, profilePhoto } = useComplaintStore();
  const { config, fetchSystemConfig, getBrandingPhotoUrl } = useSystemConfigStore();
  const storeUnreadCount = useNotificationStore(state => state.unreadCount);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const displayName = profileName || 'Citizen User';
  const brandingTopBar = config?.BRANDING_TOPBAR_TITLE || config?.BRANDING_TITLE || 'Citizen E-Connect';
  const brandingSub = config?.BRANDING_SUB_TITLE || '';
  const photoUrl = getBrandingPhotoUrl('L');
  const cleanPhotoUrl = getCleanImageUrl(photoUrl);

  useEffect(() => {
    setImgError(false);
  }, [cleanPhotoUrl]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const handleBellPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.replace({ pathname: '/home', params: { tab: 'notifications' } });
    }
  };

  const count = typeof notificationCount === 'number' ? notificationCount : storeUnreadCount;

  return (
    <ImageBackground
      source={HEADER_BG}
      resizeMode="cover"
      className={`px-4 pt-3 pb-3 bg-header-bg z-10 overflow-hidden ${className}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              className="p-2 -ml-2 mr-2 rounded-full"
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={24} color={colors.white} />
            </TouchableOpacity>
          )}

          {/* Unified circular branding photo/logo on all pages */}
          <View className="w-11 h-11 bg-white rounded-full items-center justify-center mr-3 border-2 border-white/20 overflow-hidden shadow-sm">
            <Image
              key={cleanPhotoUrl || 'default'}
              source={cleanPhotoUrl && !imgError ? { uri: cleanPhotoUrl } : DEFAULT_LOGO}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          </View>

          <View className="flex-1">
            <Text className="text-base font-inter-bold text-white tracking-wide" numberOfLines={1}>
              {title || brandingTopBar}
            </Text>
            <Text className="text-xs font-inter-semibold text-white/70" numberOfLines={1}>
              {subtitle || (title ? brandingTopBar : (brandingSub || 'Citizen Portal'))}
            </Text>
          </View>
        </View>

        {/* Unified notification bell with badge on all pages */}
        <TouchableOpacity
          onPress={handleBellPress}
          activeOpacity={0.75}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center relative ml-2"
        >
          <BellIcon size={22} color={colors.white} />
          {count > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border-2 border-header-bg z-10">
              <Text className="text-[10px] font-inter-bold text-white leading-none text-center">
                {count > 99 ? '99+' : count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="bg-black/20 border border-black/10 rounded-md px-3 py-2 mt-3 flex-row items-center">
        <Text className="text-xs font-inter-medium text-white/90" numberOfLines={1}>
          {bottomText || `Welcome, ${displayName}`}
        </Text>
      </View>
    </ImageBackground>
  );
}
