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
          <Text className="text-xl font-inter-bold text-dark mb-1">{title}</Text>
          {description && (
            <Text className="text-sm font-inter text-muted">{description}</Text>
          )}
        </View>
        <View className="w-12 h-12 rounded-full bg-primary justify-center items-center">
          <PlusIcon size={24} color={colors.white} />
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'quick') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        className="w-[31%] mx-[1%] rounded-lg p-3 mb-4 bg-surface"
        style={{
          shadowColor: colors.dark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View className="w-8 h-8 rounded-full bg-border justify-center items-center mb-3">
          {Icon && <Icon size={16} color={colors.iconMuted} />}
        </View>
        <Text className="text-xs font-inter-semibold text-dark leading-tight" numberOfLines={2}>
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
        className="bg-white border border-border p-4 rounded-xl mb-4"
      >
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-inter-bold text-dark">{ticketId || title}</Text>
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
