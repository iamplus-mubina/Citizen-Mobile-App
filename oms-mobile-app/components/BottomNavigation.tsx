import { View, Text, TouchableOpacity } from 'react-native';
import { 
  HomeIcon as HomeOutline, 
  DocumentTextIcon as DocumentOutline, 
  BellIcon as BellOutline
} from 'react-native-heroicons/outline';
import { 
  HomeIcon as HomeSolid, 
  DocumentTextIcon as DocumentSolid, 
  BellIcon as BellSolid
} from 'react-native-heroicons/solid';
import { colors } from '@/constants/Colors';

export type TabType = 'home' | 'complaints' | 'notifications';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', OutlineIcon: HomeOutline, SolidIcon: HomeSolid },
    { id: 'complaints' as TabType, label: 'Complaints', OutlineIcon: DocumentOutline, SolidIcon: DocumentSolid },
    { id: 'notifications' as TabType, label: 'Notifications', OutlineIcon: BellOutline, SolidIcon: BellSolid },
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
            <Icon size={24} color={color} />
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
