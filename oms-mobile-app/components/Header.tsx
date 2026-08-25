import { View, Text, TouchableOpacity, Image } from 'react-native';
import { UserCircleIcon } from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

interface HeaderProps {
  className?: string;
  avatarUrl?: string;
}

export function Header({ className = '', avatarUrl }: HeaderProps) {
  return (
    <View className={`h-16 flex-row items-center justify-between px-6 bg-background ${className}`}>
      <View>
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
