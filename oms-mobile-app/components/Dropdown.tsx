import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';

type OptionItem = string | { id: number; name: string; [key: string]: any };

interface DropdownProps {
  label?: string;
  value: string;
  options: OptionItem[];
  placeholder?: string;
  onSelect: (value: string, id?: number) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const getOptionLabel = (item: OptionItem): string => {
  if (typeof item === 'string') return item;
  return item.name || String(item.id);
};

const getOptionId = (item: OptionItem): number | undefined => {
  if (typeof item === 'string') return undefined;
  return item.id;
};

export function Dropdown({ 
  label, 
  value, 
  options, 
  placeholder = 'Select option', 
  onSelect, 
  error, 
  className = '',
  disabled = false,
  loading = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((item) =>
    getOptionLabel(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: OptionItem) => {
    onSelect(getOptionLabel(item), getOptionId(item));
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (disabled || loading) return;
    setIsOpen((prev) => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  };

  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && (
        <Text className="text-dark font-inter-semibold mb-2">
          {label}
        </Text>
      )}

      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={handleToggle}
        disabled={disabled || loading}
        className={`flex-row items-center justify-between w-full bg-surface border ${
          error ? 'border-error' : (isOpen ? 'border-primary' : 'border-border')
        } rounded-md px-4 py-3 ${disabled ? 'opacity-50' : ''}`}
      >
        {loading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color={colors.primary} />
            <Text className="text-muted text-base font-inter ml-2">Loading...</Text>
          </View>
        ) : (
          <Text className={`text-base font-inter ${value ? 'text-dark' : 'text-muted'}`}>
            {value || placeholder}
          </Text>
        )}
        {isOpen
          ? <ChevronUpIcon size={20} color={colors.primary} />
          : <ChevronDownIcon size={20} color={disabled ? colors.muted : colors.dark} />
        }
      </TouchableOpacity>

      {error && (
        <Text className="text-error text-sm font-inter mt-1">{error}</Text>
      )}

      {/* Dropdown Panel — renders in normal flow, no overlap */}
      {isOpen && (
        <View 
          className="w-full bg-surface border border-border rounded-md mt-1 overflow-hidden"
          style={{ elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
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
              filteredOptions.map((item, index) => {
                const itemLabel = getOptionLabel(item);
                const isSelected = itemLabel === value;
                return (
                  <TouchableOpacity
                    key={`${getOptionId(item) ?? itemLabel}-${index}`}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                    onPress={() => handleSelect(item)}
                  >
                    <Text className={`text-base font-inter ${isSelected ? 'text-primary font-inter-semibold' : 'text-dark'}`}>
                      {itemLabel}
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
