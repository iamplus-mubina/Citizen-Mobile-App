import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDownIcon, CheckIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

interface DropdownProps {
  label?: string;
  value: string;
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  error?: string;
  className?: string;
}

export function Dropdown({ 
  label, 
  value, 
  options, 
  placeholder = 'Select option', 
  onSelect, 
  error, 
  className = '' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className={`w-full mb-4 z-50 ${className}`}>
      {label && <Text className="text-dark font-inter-semibold mb-2">{label}</Text>}
      
      
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center justify-between w-full bg-surface border ${error ? 'border-error' : (isOpen ? 'border-primary' : 'border-border')} rounded-md px-4 py-3`}
      >
        <Text className={`text-base font-inter ${value ? 'text-dark' : 'text-muted'}`}>
          {value || placeholder}
        </Text>
        <ChevronDownIcon size={20} color={isOpen ? colors.primary : colors.dark} />
      </TouchableOpacity>
      
      {error && <Text className="text-error text-sm font-inter mt-1">{error}</Text>}

      
      {isOpen && (
        <View 
          className="absolute top-[80px] left-0 right-0 bg-surface border border-border rounded-md shadow-sm z-50 overflow-hidden"
        >
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} className="max-h-[200px]">
            {options.map((item) => {
              const isSelected = item === value;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  className={`flex-row items-center justify-between px-4 py-3 ${isSelected ? 'bg-primary/10' : ''}`}
                  onPress={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                >
                  <Text className={`text-base font-inter ${isSelected ? 'text-primary font-inter-semibold' : 'text-dark'}`}>
                    {item}
                  </Text>
                  {isSelected && <CheckIcon size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
