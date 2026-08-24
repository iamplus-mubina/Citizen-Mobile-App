import { View, TouchableOpacity } from 'react-native';
import { Bars3Icon, BellIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

interface HeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  className?: string;
}

export function Header({ onMenuPress, onNotificationPress, className = '' }: HeaderProps) {
  return (
    <View className={`h-16 flex-row items-center justify-between px-6 bg-background ${className}`}>
      <TouchableOpacity 
        onPress={onMenuPress} 
        activeOpacity={0.7}
        className="p-1 -ml-1 rounded-full"
      >
        <Bars3Icon size={28} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onNotificationPress} 
        activeOpacity={0.7}
        className="p-1 -mr-1 rounded-full"
      >
        <BellIcon size={28} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}
