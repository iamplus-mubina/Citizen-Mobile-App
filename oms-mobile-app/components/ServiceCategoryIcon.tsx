import { View } from 'react-native';
import {
  BuildingOffice2Icon,
  HeartIcon,
  IdentificationIcon,
  PencilSquareIcon,
  Squares2X2Icon,
} from 'react-native-heroicons/outline';
import type { ServiceCategoryKey } from '@/services/mock/popularServices.data';
import { colors } from '@/constants/Colors';

interface ServiceCategoryIconProps {
  category: ServiceCategoryKey;
  size?: number;
  color?: string;
  className?: string;
}

export function ServiceCategoryIcon({
  category,
  size = 26,
  color,
  className = '',
}: ServiceCategoryIconProps) {
  // Default icon color to primary
  const iconColor = color || colors.primary;

  const renderIcon = () => {
    switch (category) {
      case 'citizen':
        return <BuildingOffice2Icon size={size} color={iconColor} />;
      case 'schemes':
        return <HeartIcon size={size} color={iconColor} />;
      case 'certificates':
        return <IdentificationIcon size={size} color={iconColor} />;
      case 'permissions':
        return <PencilSquareIcon size={size} color={iconColor} />;
      case 'other':
      default:
        return <Squares2X2Icon size={size} color={iconColor} />;
    }
  };

  return <View className={className}>{renderIcon()}</View>;
}
