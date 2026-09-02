import { View, Text, TouchableOpacity } from 'react-native';
import { 
  HomeIcon as HomeOutline, 
  DocumentTextIcon as DocumentOutline,
  MegaphoneIcon as MegaphoneOutline,
  UserIcon as UserOutline,
} from 'react-native-heroicons/outline';
import { 
  HomeIcon as HomeSolid, 
  DocumentTextIcon as DocumentSolid,
  MegaphoneIcon as MegaphoneSolid,
  UserIcon as UserSolid,
} from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

export type TabType = 'home' | 'complaints' | 'updates' | 'profile' | 'notifications';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  updatesBadgeCount?: number;
}

export function BottomNavigation({ activeTab, onTabPress, updatesBadgeCount }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', OutlineIcon: HomeOutline, SolidIcon: HomeSolid },
    { id: 'complaints' as TabType, label: 'Complaints', OutlineIcon: DocumentOutline, SolidIcon: DocumentSolid },
    { id: 'updates' as TabType, label: 'Updates', OutlineIcon: MegaphoneOutline, SolidIcon: MegaphoneSolid, badge: updatesBadgeCount },
    { id: 'profile' as TabType, label: 'Profile', OutlineIcon: UserOutline, SolidIcon: UserSolid },
  ];

  return (
    <View className="h-16 flex-row justify-around items-center border-t border-border bg-background">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? colors.primary : colors.muted;
        const fontClass = isActive ? 'font-inter-semibold' : 'font-inter-medium';
        const Icon = isActive ? tab.SolidIcon : tab.OutlineIcon;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
            className="items-center justify-center flex-1 py-2"
          >
            <View className="relative">
              <Icon size={24} color={color} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <View className="absolute -top-1 -right-2 bg-red-500 rounded-full min-w-[16px] h-[16px] px-[3px] items-center justify-center border-[1.5px] border-background z-10">
                  <Text className="text-[9px] font-inter-bold text-white leading-none text-center">{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text 
              className={`text-xs mt-1 ${fontClass}`} 
              style={{ color }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
