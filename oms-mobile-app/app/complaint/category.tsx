import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';

const CATEGORIES = [
  'Road',
  'Water Supply',
  'Electricity',
  'Drainage',
  'Sanitation',
  'Other'
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <View className="flex-row justify-between items-end mb-2">
              <Text className="text-2xl font-inter-bold text-text">Register Complaint</Text>
              <Text className="text-sm font-inter-semibold text-muted">1 of 4</Text>
            </View>
            <View className="h-[1px] bg-border w-full mb-6" />
            <Text className="text-base font-inter-semibold text-text mb-4">Select Category</Text>
          </View>

          <View className="space-y-4 mb-8">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(category)}
                  className="flex-row items-center py-3"
                >
                  <View 
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 
                      ${isSelected ? 'border-primary' : 'border-muted'}`}
                  >
                    {isSelected && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text className={`text-lg font-inter ${isSelected ? 'text-primary' : 'text-text'}`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="px-6 py-4 pb-8 border-t border-border bg-background">
          <Button 
            title="Next" 
            onPress={() => console.log('Next to step 2 with:', selectedCategory)}
            disabled={!selectedCategory}
            className={!selectedCategory ? 'opacity-50' : ''}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
