import { View, Text, TouchableOpacity } from 'react-native';
import { PlusIcon, ClockIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

interface CardProps {
  variant: 'complaint' | 'quick' | 'recent';
  title: string;
  description?: string;
  ticketId?: string;
  date?: string;
  status?: string;
  Icon?: React.ComponentType<{ size: number; color: string }>;
  badgeCount?: number;
  onPress?: () => void;
}

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('pending')) {
    return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700' };
  }
  if (s.includes('progress') || s.includes('assigned')) {
    return { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700' };
  }
  if (s.includes('resolved') || s.includes('completed') || s.includes('solved')) {
    return { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' };
  }
  if (s.includes('reject') || s.includes('closed') || s.includes('fail')) {
    return { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700' };
  }
  return { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700' };
};

export function Card({ 
  variant, 
  title, 
  description, 
  ticketId, 
  date, 
  status,
  badgeCount,
  Icon, 
  onPress 
}: CardProps) {
  if (variant === 'complaint') {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.9}
        className="bg-primary-light border border-primary/20 p-5 rounded-lg flex-row items-center justify-between mb-8"
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
        <View className="w-10 h-10 rounded-full justify-center items-center mb-2 bg-primary-light relative">
          {Icon && <Icon size={20} color={colors.primary} />}
          {badgeCount !== undefined && badgeCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] px-[3px] items-center justify-center border-2 border-surface">
              <Text className="text-[10px] font-inter-bold text-white leading-none text-center">{badgeCount}</Text>
            </View>
          )}
        </View>
        <Text className="text-xs font-inter-semibold text-dark text-center leading-tight" numberOfLines={2}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'recent') {
    const statusStyle = status ? getStatusStyles(status) : null;
    
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        className="bg-surface border border-border p-4 rounded-xl mb-3"
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-inter-bold text-header-bg">{ticketId}</Text>
          {status && statusStyle && (
            <View className={`px-2 py-0.5 rounded border ${statusStyle.bg} ${statusStyle.border}`}>
              <Text className={`text-[11px] font-inter-medium capitalize ${statusStyle.text}`}>{status}</Text>
            </View>
          )}
        </View>

        <Text className="text-base font-inter-bold text-dark mb-1">{title}</Text>
        
        {description && (
          <Text className="text-xs font-inter text-muted mb-4">{description}</Text>
        )}

        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center">
            <ClockIcon size={14} color={colors.muted} />
            <Text className="text-xs font-inter text-muted ml-1.5">Updated {date}</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.muted} />
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}
