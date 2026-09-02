import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
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
          <View className="mb-4">
            <Text className="text-2xl font-inter-bold text-dark mb-4 mt-2">Register Complaint</Text>
            <FormStepper currentStep={1} totalSteps={5} />
          </View>

          <Text className="text-sm font-inter-semibold text-dark mb-3 mt-2">Select Category <Text className="text-error">*</Text></Text>

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
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-4 bg-surface 
                      ${isSelected ? 'border-primary' : 'border-muted'}`}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text className="text-base font-inter-medium text-dark">
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
