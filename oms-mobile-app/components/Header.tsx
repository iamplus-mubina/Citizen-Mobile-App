import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  StatusBar,
  Modal,
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  ArrowLeftIcon, 
  BellIcon, 
  LanguageIcon, 
  XMarkIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useTranslation, SUPPORTED_LANGUAGES } from '@/store/useLanguageStore';
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
  variant?: 'home' | 'standard';
  onProfilePress?: () => void;
}

const DEFAULT_LOGO = require('../assets/images/citizen_logo.png');
const HEADER_BG = require('../assets/images/header_bg.jpg');

export function Header({ 
  className = '', 
  avatarUrl, 
  showBack, 
  title, 
  subtitle,
  notificationCount, 
  onNotificationPress, 
  onBack,
  variant = 'standard',
  onProfilePress
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useTranslation();
  const { firstName, lastName, profileName, profilePhoto } = useComplaintStore();
  const { config, fetchSystemConfig, getBrandingPhotoUrl } = useSystemConfigStore();
  const storeUnreadCount = useNotificationStore(state => state.unreadCount);
  const [imgError, setImgError] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const brandingTopBar = config?.BRANDING_TOPBAR_TITLE || config?.BRANDING_TITLE || 'Citizen E-Connect';
  const brandingSub = config?.BRANDING_SUB_TITLE || '';
  const photoUrl = getBrandingPhotoUrl('L');
  const cleanPhotoUrl = getCleanImageUrl(photoUrl);
  const cleanAvatarUrl = getCleanImageUrl(avatarUrl || profilePhoto);
  const [avatarImgError, setAvatarImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [cleanPhotoUrl]);

  useEffect(() => {
    setAvatarImgError(false);
  }, [cleanAvatarUrl]);

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

  const displayName = firstName?.trim() || profileName?.trim()?.split(/\s+/)[0] || '';

  // Home layout matches the reference structure (logo, title, language, bell, greeting, avatar).
  // Colors stay on the existing navy header, not the reference lavender background.
  if (variant === 'home') {
    return (
      <ImageBackground
        source={HEADER_BG}
        resizeMode="cover"
        style={{
          paddingTop: Math.max(insets.top, 16) + 6,
          paddingBottom: 20,
          paddingHorizontal: 20,
          backgroundColor: colors.headerBg,
        }}
        className={className}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.white,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.35)',
              }}
            >
              <Image
                key={cleanPhotoUrl || 'default'}
                source={cleanPhotoUrl && !imgError ? { uri: cleanPhotoUrl } : DEFAULT_LOGO}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => setImgError(true)}
              />
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.white,
                lineHeight: 21,
                flex: 1,
              }}
              numberOfLines={2}
            >
              {brandingTopBar}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setLangModalVisible(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 6, marginRight: 6 }}
            >
              <LanguageIcon size={26} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBellPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ padding: 6, position: 'relative' }}
            >
              <BellIcon size={26} color={colors.white} />
              {count > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                    borderWidth: 1.5,
                    borderColor: colors.headerBg,
                  }}
                >
                  <Text style={{ color: colors.white, fontSize: 10, fontWeight: '700', lineHeight: 12 }}>
                    {count > 99 ? '99+' : count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{
                fontSize: 23,
                fontWeight: '800',
                color: colors.white,
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {t('home.greeting', 'Namaskar')}{displayName ? `, ${displayName}` : ''}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.8}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {cleanAvatarUrl && !avatarImgError ? (
              <Image
                source={{ uri: cleanAvatarUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => setAvatarImgError(true)}
              />
            ) : (
              <UserIcon size={28} color={colors.dark} />
            )}
          </TouchableOpacity>
        </View>

        {/* Language Modal */}
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
                  <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 8 }} />
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
      </ImageBackground>
    );
  }

  // ==========================================
  // 2. STANDARD / INNER SCREENS VARIANT
  // ==========================================
  return (
    <ImageBackground
      source={HEADER_BG}
      resizeMode="cover"
      className={`px-4 pb-3 bg-header-bg z-10 overflow-hidden ${className}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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
              {subtitle || (title ? brandingTopBar : (brandingSub || t('header.citizenPortal')))}
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
    </ImageBackground>
  );
}
