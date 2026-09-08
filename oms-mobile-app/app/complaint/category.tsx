import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
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
  ExclamationTriangleIcon,
  TruckIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  TagIcon
} from 'react-native-heroicons/outline';
import { api } from '@/services/api';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  Icon: any;
  rawId?: number;
}

const getCategoryIconAndDetails = (name: string, rawId?: number) => {
  const n = name.toLowerCase();
  
  if (n.includes('पाणी') || n.includes('जल') || n.includes('water') || rawId === 1) {
    return { Icon: BeakerIcon, subtitle: '24 hour service target' };
  }
  if (n.includes('रस्ते') || n.includes('सड़क') || n.includes('सडक') || n.includes('road') || n.includes('pothole') || rawId === 3) {
    return { Icon: MapIcon, subtitle: '48 hour service target' };
  }
  if (n.includes('कचरा') || n.includes('कचरे') || n.includes('garbage') || n.includes('waste') || rawId === 4) {
    return { Icon: TrashIcon, subtitle: '24 hour service target' };
  }
  if (n.includes('परिवहन') || n.includes('ट्रान्सपोर्ट') || n.includes('transport') || n.includes('bus')) {
    return { Icon: TruckIcon, subtitle: '24-48 hour service target' };
  }
  if (n.includes('पत्र') || n.includes('letter') || n.includes('application')) {
    return { Icon: EnvelopeIcon, subtitle: '48 hour service target' };
  }
  if (n.includes('योजना') || n.includes('सरकारी') || n.includes('scheme')) {
    return { Icon: DocumentTextIcon, subtitle: 'Variable service target' };
  }
  if (n.includes('दिवाबत्ती') || n.includes('लाइट') || n.includes('light') || n.includes('street')) {
    return { Icon: LightBulbIcon, subtitle: '48 hour service target' };
  }
  if (n.includes('गटार') || n.includes('ड्रेनेज') || n.includes('drainage') || n.includes('sewer')) {
    return { Icon: FunnelIcon, subtitle: '24 hour service target' };
  }
  if (n.includes('स्वच्छता') || n.includes('sanitation') || n.includes('toilet')) {
    return { Icon: BuildingStorefrontIcon, subtitle: '24 hour service target' };
  }
  if (n.includes('अतिक्रमण') || n.includes('encroach')) {
    return { Icon: ExclamationTriangleIcon, subtitle: 'Variable service target' };
  }
  if (rawId === 7 || n.includes('इतर') || n.includes('अन्य') || n.includes('other')) {
    return { Icon: LightBulbIcon, subtitle: '48 hour service target' };
  }
  
  return { Icon: TagIcon, subtitle: '24-48 hour service target' };
};

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: 'Roads & Potholes', title: 'Roads & Potholes', subtitle: '48 hour service target', Icon: MapIcon, rawId: 3 },
  { id: 'Garbage / Solid Waste', title: 'Garbage / Solid Waste', subtitle: '24 hour service target', Icon: TrashIcon, rawId: 4 },
  { id: 'Street Lighting', title: 'Street Lighting', subtitle: '48 hour service target', Icon: LightBulbIcon, rawId: 7 },
  { id: 'Water Supply', title: 'Water Supply', subtitle: '24 hour service target', Icon: BeakerIcon, rawId: 1 },
  { id: 'Drainage / Sewerage', title: 'Drainage / Sewerage', subtitle: '24 hour service target', Icon: FunnelIcon, rawId: 1 },
  { id: 'Public Sanitation', title: 'Public Sanitation', subtitle: '24 hour service target', Icon: BuildingStorefrontIcon, rawId: 4 },
  { id: 'Encroachment', title: 'Encroachment', subtitle: 'Variable service target', Icon: ExclamationTriangleIcon, rawId: 7 }
];

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const setCategory = useComplaintStore((s) => s.setCategory);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/complainbox/categories');
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log('Production Dynamic Categories loaded:', response.data.length);
          const apiCats: CategoryItem[] = response.data.map((cat: any) => {
            const name = cat.name || cat.title || 'Category';
            const details = getCategoryIconAndDetails(name, cat.id);

            return {
              id: name,
              title: name,
              subtitle: details.subtitle,
              Icon: details.Icon,
              rawId: cat.id
            };
          });
          setCategoriesList(apiCats);
        } else {
          setCategoriesList(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        console.error('Error fetching categories dynamically:', error);
        setCategoriesList(FALLBACK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

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
            {categoriesList.map((category) => {
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
          <View className="mb-8">
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
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
