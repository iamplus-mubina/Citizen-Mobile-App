import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { ArrowLeftIcon, BellIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
  showBack?: boolean;
  title?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export function Header({ className = '', avatarUrl, showBack, title, notificationCount, onNotificationPress }: HeaderProps) {
  const router = useRouter();
  const { profileName } = useComplaintStore();
  const displayName = profileName || 'Rahul Sharma';

  return (
    <View
      className={`px-4 pt-4 pb-4 bg-header-bg z-10 ${className}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {showBack ? (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-3 mr-1 rounded-full"
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={24} color={colors.white} />
            </TouchableOpacity>
            <Text className="text-xl font-inter-bold text-white">{title || 'OMS Citizen'}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-1 -mr-1"
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-10 h-10 rounded-full border-2 border-white/20"
                resizeMode="cover"
              />
            ) : (
              <UserCircleIcon size={36} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="justify-center pt-2">

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-3 shadow-sm border-2 border-white/10 overflow-hidden">
                <Image
                  source={require('../assets/images/oms_logo.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-inter-bold text-white tracking-wide" numberOfLines={1}>Office Management System</Text>
                <Text className="text-xs font-inter-semibold text-white/70">OMS Citizen</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              className="p-2 ml-2 rounded-full relative"
              onPress={onNotificationPress}
            >
              <BellIcon size={26} color={colors.white} />
              {notificationCount !== undefined && notificationCount > 0 && (
                <View className="absolute top-1.5 right-1.5 bg-red-500 rounded-full min-w-[16px] h-[16px] px-[3px] items-center justify-center border-[1.5px] border-header-bg">
                  <Text className="text-[9px] font-inter-bold text-white leading-none text-center">{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>


          <View className="bg-black/20 border border-black/10 rounded-md px-3 py-2.5 flex-row items-center">
            <UserCircleIcon size={18} color={colors.white} />
            <Text className="text-xs font-inter-medium text-white/90 ml-2">Welcome, {displayName}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
