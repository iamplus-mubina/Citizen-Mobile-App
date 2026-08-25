import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/Colors';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
  showBack?: boolean;
}

export function Header({ className = '', avatarUrl, showBack }: HeaderProps) {
  const router = useRouter();

  return (
    <View className={`h-16 flex-row items-center justify-between px-6 bg-background border-b border-border ${className}`}>
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-3 mr-1 rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-inter-bold text-primary">OMS Citizen</Text>
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
          <UserCircleIcon size={36} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}
