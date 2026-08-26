import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

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
  const setCategory = useComplaintStore((s) => s.setCategory);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header showBack />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <View className="items-center mb-2">
              <Text className="text-lg font-inter-bold text-dark">Register Complaint</Text>
            </View>
            <View className="items-end mb-2">
              <Text className="text-sm font-inter-semibold text-dark">1 of 4</Text>
            </View>
            <View className="h-[1px] bg-border w-full mb-6" />
            <Text className="text-base font-inter-semibold text-dark mb-4">Select Category</Text>
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
                  <Text className={`text-lg font-inter ${isSelected ? 'text-primary' : 'text-dark'}`}>
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
            onPress={() => {
              if (selectedCategory) {
                setCategory(selectedCategory);
                router.push('/complaint/details');
              }
            }}
            disabled={!selectedCategory}
            className={!selectedCategory ? 'opacity-50' : ''}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
