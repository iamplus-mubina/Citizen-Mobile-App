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
  requestStatus?: string;
  liveStatus?: string;
  rejectionReason?: string | null;
  Icon?: React.ComponentType<{ size: number; color: string }>;
  badgeCount?: number;
  onPress?: () => void;
}

const getRequestStatusStyles = (status?: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'APPROVED') {
    return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Approved' };
  }
  if (s === 'REJECTED') {
    return { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', label: 'Rejected' };
  }
  return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Req: Pending' };
};

const getLiveStatusStyles = (status?: string) => {
  const s = (status || '').toUpperCase().replace(/[-_ ]/g, '');
  if (s.includes('UNSOLVED')) {
    return { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700', label: 'Unsolved' };
  }
  if (s.includes('PROGRESS') || s.includes('ASSIGN')) {
    return { bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-700', label: 'In Progress' };
  }
  if ((s.includes('SOLVED') && !s.includes('UNSOLVED')) || s.includes('RESOLVED') || s.includes('COMPLETE')) {
    return { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Solved' };
  }
  if (s.includes('HOLD')) {
    return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800', label: 'On Hold' };
  }
  if (s.includes('REJECT')) {
    return { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-700', label: 'Rejected' };
  }
  if (s.includes('PENDING')) {
    return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', label: 'Pending Approval' };
  }
  return { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700', label: status || 'Unknown' };
};

const getStatusStyles = (status: string) => {
  return getLiveStatusStyles(status);
};

export function Card({ 
  variant, 
  title, 
  description, 
  ticketId, 
  date, 
  status,
  requestStatus,
  liveStatus,
  rejectionReason,
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
    const reqStyle = requestStatus ? getRequestStatusStyles(requestStatus) : null;
    const effectiveLiveStatus = liveStatus || status;
    const liveStyle = effectiveLiveStatus ? getLiveStatusStyles(effectiveLiveStatus) : null;
    
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        className="bg-surface border border-border p-4 rounded-xl mb-3"
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-inter-bold text-header-bg">{ticketId}</Text>
          <View className="flex-row items-center gap-1.5 flex-wrap justify-end">
            {reqStyle && (
              <View className={`px-2 py-0.5 rounded border ${reqStyle.bg} ${reqStyle.border}`}>
                <Text className={`text-[10px] font-inter-semibold ${reqStyle.text}`}>{reqStyle.label}</Text>
              </View>
            )}
            {liveStyle && (
              <View className={`px-2 py-0.5 rounded border ${liveStyle.bg} ${liveStyle.border}`}>
                <Text className={`text-[10px] font-inter-semibold ${liveStyle.text}`}>{liveStyle.label}</Text>
              </View>
            )}
          </View>
        </View>

        <Text className="text-base font-inter-bold text-dark mb-1">{title}</Text>
        
        {description && (
          <Text className="text-xs font-inter text-muted mb-3" numberOfLines={3}>{description}</Text>
        )}

        {rejectionReason && (
          <View className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 mb-3">
            <Text className="text-xs font-inter-medium text-rose-700">
              <Text className="font-inter-bold">Reason: </Text>{rejectionReason}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center">
            <ClockIcon size={14} color={colors.muted} />
            <Text className="text-xs font-inter text-muted ml-1.5">{date ? `Updated ${date}` : 'Recently'}</Text>
          </View>
          <ChevronRightIcon size={16} color={colors.muted} />
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}
