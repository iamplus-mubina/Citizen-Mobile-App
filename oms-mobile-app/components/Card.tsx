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
        className="bg-input-bg border border-border p-6 rounded-2xl flex-row items-center justify-between mb-8"
      >
        <View className="flex-1 mr-4">
          <Text className="text-xl font-inter-bold text-text mb-1">{title}</Text>
          {description && (
            <Text className="text-sm font-inter text-muted">{description}</Text>
          )}
        </View>
        <View className="w-12 h-12 rounded-full bg-primary justify-center items-center">
          <PlusIcon size={24} color="#ffffff" />
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'quick') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        className="w-[48%] bg-background border border-border p-4 rounded-xl flex-row items-center gap-x-3 mb-4"
      >
        {Icon && <Icon size={20} color="#a5a4bf" />}
        <Text className="text-sm font-inter-semibold text-text flex-1" numberOfLines={1}>
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
        className="bg-background border border-border p-4 rounded-xl mb-4"
      >
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-inter-bold text-text">{ticketId || title}</Text>
          {date && <Text className="text-xs font-inter text-muted">{date}</Text>}
        </View>
        {description && (
          <Text className="text-sm font-inter text-muted mb-3">{description}</Text>
        )}
        {status && (
          <View className="flex-row justify-between items-center">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-inter-semibold text-primary">{status}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return null;
}
