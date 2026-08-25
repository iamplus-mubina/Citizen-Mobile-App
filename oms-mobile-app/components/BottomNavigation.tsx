import { View, Text, TouchableOpacity } from 'react-native';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BellIcon, 
  UserIcon 
} from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

export type TabType = 'home' | 'complaints' | 'notifications' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', Icon: HomeIcon },
    { id: 'complaints' as TabType, label: 'Complaints', Icon: DocumentTextIcon },
    { id: 'notifications' as TabType, label: 'Notifications', Icon: BellIcon },
    { id: 'profile' as TabType, label: 'Profile', Icon: UserIcon },
  ];

  return (
    <View className="h-16 flex-row justify-around items-center border-t border-border bg-background">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? colors.primary : colors.muted;
        const fontClass = isActive ? 'font-inter-semibold' : 'font-inter-medium';

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
            className="items-center justify-center flex-1 py-2"
          >
            <tab.Icon size={24} color={color} />
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
