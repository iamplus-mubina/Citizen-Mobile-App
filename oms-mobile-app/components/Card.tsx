import { View, Text, TouchableOpacity } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

interface CardProps {
  variant: 'complaint' | 'quick' | 'recent';
  title: string;
  description?: string;
  ticketId?: string;
  date?: string;
  status?: string;
  Icon?: React.ComponentType<{ size: number; color: string }>;
  onPress?: () => void;
}

export function Card({ 
  variant, 
  title, 
  description, 
  ticketId, 
  date, 
  status,
  Icon, 
  onPress 
}: CardProps) {
  if (variant === 'complaint') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.9}
        className="bg-surface border border-border p-5 rounded-lg flex-row items-center justify-between mb-8"
      >
        <View className="flex-1 mr-4">
          <Text className="text-xl font-inter-bold text-dark mb-1">{title}</Text>
          {description && (
            <Text className="text-sm font-inter text-muted">{description}</Text>
          )}
        </View>
        <View className="w-12 h-12 rounded-full bg-primary justify-center items-center">
          <PlusIcon size={24} color={colors.dark} />
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'quick') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        className="w-[31%] mx-[1%] rounded-lg p-3 mb-4 bg-surface border border-border items-center"
      >
        <View className="w-10 h-10 rounded-full justify-center items-center mb-2 bg-primary-light">
          {Icon && <Icon size={20} color={colors.primary} />}
        </View>
        <Text className="text-xs font-inter-semibold text-dark text-center leading-tight" numberOfLines={2}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'recent') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        className="bg-surface border border-border p-4 rounded-lg mb-4"
      >
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-inter-bold text-dark">{ticketId || title}</Text>
          {date && <Text className="text-xs font-inter text-muted">{date}</Text>}
        </View>
        {description && (
          <Text className="text-sm font-inter text-muted mb-3">{description}</Text>
        )}
        {status && (
          <View className="flex-row justify-between items-center mt-2">
            <View className="px-3 py-1 rounded-full bg-warning-light">
              <Text className="text-xs font-inter-bold text-warning">{status.toUpperCase()}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return null;
}
