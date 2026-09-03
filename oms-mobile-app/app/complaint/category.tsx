import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import {
  MapIcon,
  TrashIcon,
  LightBulbIcon,
  BeakerIcon,
  FunnelIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon
} from 'react-native-heroicons/outline';

const CATEGORIES = [
  { id: 'Roads & Potholes', title: 'Roads & Potholes', subtitle: '48 hour service target', Icon: MapIcon },
  { id: 'Garbage / Solid Waste', title: 'Garbage / Solid Waste', subtitle: '24 hour service target', Icon: TrashIcon },
  { id: 'Street Lighting', title: 'Street Lighting', subtitle: '48 hour service target', Icon: LightBulbIcon },
  { id: 'Water Supply', title: 'Water Supply', subtitle: '24 hour service target', Icon: BeakerIcon },
  { id: 'Drainage / Sewerage', title: 'Drainage / Sewerage', subtitle: '24 hour service target', Icon: FunnelIcon },
  { id: 'Public Sanitation', title: 'Public Sanitation', subtitle: '24 hour service target', Icon: BuildingStorefrontIcon },
  { id: 'Encroachment', title: 'Encroachment', subtitle: 'Variable service target', Icon: ExclamationTriangleIcon }
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const setCategory = useComplaintStore((s) => s.setCategory);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <Header showBack title="Raise a complaint" />

        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <FormStepper currentStep={1} totalSteps={6} />
          </View>

          <View className="mb-8 mt-4">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`flex-row items-center justify-between p-4 mb-4 rounded-lg border ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                    }`}
                >
                  <View className="flex-row items-center flex-1">
                    <category.Icon size={24} color={colors.primary} />
                    <View className="ml-4 flex-1">
                      <Text className="text-base font-inter-semibold text-dark">
                        {category.title}
                      </Text>
                      <Text className="text-xs font-inter text-muted mt-0.5">
                        {category.subtitle}
                      </Text>
                    </View>
                  </View>


                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ml-4 
                      ${isSelected ? 'border-primary' : 'border-muted'}`}
                  >
                    {isSelected && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="px-6 py-4 border-t border-border bg-background">
          <Button
            title="Continue"
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
