import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  UserIcon,
} from 'react-native-heroicons/outline';
import { UserCircleIcon as UserCircleSolid } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
  danger?: boolean;
}

export function MenuDrawer({ visible, onClose }: MenuDrawerProps) {
  const router = useRouter();
  const { profileName, profileEmail, profilePhoto } = useComplaintStore();
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const menuItems: MenuItem[] = [
    {
      id: 'complaints',
      label: 'My Complaints',
      Icon: ClipboardDocumentListIcon,
      onPress: () => { onClose(); router.push('/home'); },
    },
    {
      id: 'updates',
      label: 'Updates',
      Icon: MegaphoneIcon,
      onPress: () => { onClose(); router.push('/updates' as never); },
    },
    {
      id: 'profile',
      label: 'My Profile',
      Icon: UserIcon,
      onPress: () => { onClose(); router.push('/profile' as never); },
    },
    {
      id: 'help',
      label: 'Help & Support',
      Icon: QuestionMarkCircleIcon,
      onPress: () => { onClose(); },
    },
    {
      id: 'signout',
      label: 'Sign Out',
      Icon: ArrowRightOnRectangleIcon,
      onPress: () => { onClose(); router.replace('/login'); },
      danger: true,
    },
  ];

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.dark,
            opacity: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          }}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: colors.surface,
          transform: [{ translateX }],
        }}
      >
        <View className="bg-header-bg px-5 pt-12 pb-5">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="self-end mb-4 p-1"
          >
            <XMarkIcon size={24} color={colors.white} />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <View className="mr-3">
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                  resizeMode="cover"
                />
              ) : (
                <UserCircleSolid size={52} color={colors.white} />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-inter-bold text-white" numberOfLines={1}>
                {profileName || 'Rahul Sharma'}
              </Text>
              <Text className="text-xs font-inter text-white/70 mt-0.5" numberOfLines={1}>
                {profileEmail || 'OMS Citizen'}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-2 pt-2">
          {menuItems.map((item, index) => (
            <View key={item.id}>
              {index === menuItems.length - 1 && (
                <View className="h-px bg-border mx-3 my-2" />
              )}
              <TouchableOpacity
                onPress={item.onPress}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-4 rounded-xl"
              >
                <item.Icon
                  size={20}
                  color={item.danger ? colors.error : colors.dark}
                />
                <Text
                  className={`ml-3 text-sm font-inter-semibold ${item.danger ? 'text-error' : 'text-dark'}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="px-5 pb-8 items-center">
          <Text className="text-xs font-inter text-muted">
            Powered by OMS
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
