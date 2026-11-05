import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabPress: (tab: T) => void;
  counts?: Record<T, number>;
  className?: string;
  renderLabel?: (tab: T) => string;
}

export function Tabs<T extends string>({ 
  tabs, 
  activeTab, 
  onTabPress, 
  counts,
  className = '',
  renderLabel,
}: TabsProps<T>) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className={className}
      style={{ flexGrow: 0, flexShrink: 0 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 6, alignItems: 'flex-start' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count = counts ? counts[tab] : undefined;
        const labelText = renderLabel ? renderLabel(tab) : tab;
        const displayLabel = count !== undefined ? `${labelText} (${count})` : labelText;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
            className={`px-4 py-2.5 rounded-lg border ${
              isActive 
                ? 'bg-primary border-primary' 
                : 'bg-surface border-border'
            }`}
          >
            <Text 
              className={`text-sm font-inter-semibold ${
                isActive ? 'text-dark' : 'text-muted'
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
