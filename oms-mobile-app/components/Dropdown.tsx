import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  };

  return (
    <View className={`w-full mb-4 z-50 ${className}`}>
      {label && (
        <Text className="text-dark font-inter-semibold mb-2">
          {label}
        </Text>
      )}

      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={handleToggle}
        className={`flex-row items-center justify-between w-full bg-surface border ${
          error ? 'border-error' : (isOpen ? 'border-primary' : 'border-border')
        } rounded-md px-4 py-3`}
      >
        <Text className={`text-base font-inter ${value ? 'text-dark' : 'text-muted'}`}>
          {value || placeholder}
        </Text>
        {isOpen
          ? <ChevronUpIcon size={20} color={colors.primary} />
          : <ChevronDownIcon size={20} color={colors.dark} />
        }
      </TouchableOpacity>

      {error && (
        <Text className="text-error text-sm font-inter mt-1">{error}</Text>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <View 
          className="absolute top-[80px] left-0 right-0 bg-surface border border-border rounded-md z-50 overflow-hidden"
        >
          <View className="px-3 py-2 border-b border-border">
            <View className="flex-row items-center bg-background rounded-md px-3 py-2">
              <MagnifyingGlassIcon size={16} color={colors.muted} />
              <TextInput
                placeholder="Start typing..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-2 text-sm font-inter text-dark"
                style={{ outlineWidth: 0 } as any}
                autoFocus
              />
            </View>
          </View>

          <ScrollView 
            nestedScrollEnabled 
            showsVerticalScrollIndicator={false} 
            className="max-h-[200px]"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                    onPress={() => handleSelect(item)}
                  >
                    <Text className={`text-base font-inter ${isSelected ? 'text-primary font-inter-semibold' : 'text-dark'}`}>
                      {item}
                    </Text>
                    {isSelected && <CheckIcon size={18} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="px-4 py-5 items-center">
                <Text className="text-sm font-inter text-muted">No results found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
