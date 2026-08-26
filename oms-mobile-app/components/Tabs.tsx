import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  counts?: Record<T, number>;
  className?: string;
}

export function Tabs<T extends string>({ 
  tabs, 
  activeTab, 
  onTabPress, 
  counts,
  className = ''
}: TabsProps<T>) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className={className}
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8, gap: 8 }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts ? counts[tab] : undefined;
        const displayLabel = count !== undefined ? `${tab} (${count})` : tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
            className={`px-4 py-2.5 rounded-lg border ${
              isActive 
                ? 'bg-primary border-primary' 
                : 'bg-white border-slate-300'
            }`}
          >
            <Text 
              className={`text-sm font-inter-semibold ${
                isActive ? 'text-black' : 'text-dark'
              }`}
            >
              {displayLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
