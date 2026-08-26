import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { ArrowLeftIcon, Bars3Icon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
  showBack?: boolean;
}

export function Header({ className = '', avatarUrl, showBack }: HeaderProps) {
  const router = useRouter();
  const { profileName } = useComplaintStore();
  const displayName = profileName || 'Rahul Sharma';

  return (
    <View className={`h-36 justify-between px-6 pt-4 pb-5 bg-header-bg ${className}`}>
      {showBack ? (
        <View className="flex-row items-center justify-between flex-1">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-2 -ml-3 mr-1 rounded-full"
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={24} color={colors.white} />
            </TouchableOpacity>
            <Text className="text-xl font-inter-bold text-white">OMS Citizen</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.7}
            className="p-1 -mr-1"
          >
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <UserCircleIcon size={36} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity 
                activeOpacity={0.7}
                className="p-0.5 rounded-full border border-white/20 mr-3"
              >
                {avatarUrl ? (
                  <Image 
                    source={{ uri: avatarUrl }} 
                    className="w-11 h-11 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <UserCircleIcon size={44} color={colors.white} />
                )}
              </TouchableOpacity>
              <View>
                <Text className="text-xs font-inter text-white/70 mb-0.5">Welcome,</Text>
                <Text className="text-base font-inter-bold text-white leading-5">{displayName}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm font-inter-bold text-white/80 mr-3">OMS Citizen</Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                className="p-1 -mr-1 rounded-full"
                onPress={() => console.log('Menu pressed')}
              >
                <Bars3Icon size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-black/20 rounded-xl px-4 py-2.5 flex-row items-center">
            <Text className="text-xs font-inter-semibold text-white/90">
              User from : Office Management System
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
