import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Dropdown } from '@/components/Dropdown';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { citizenService } from '@/services/citizenService';
import type { ComplainCategory, ComplainType } from '@/services/types';

export default function CategoryScreen() {
  const router = useRouter();

  // Load from store so selection persists on back navigation
  const storeCategoryName = useComplaintStore((s) => s.selectedCategoryName);
  const storeCategoryId = useComplaintStore((s) => s.selectedCategoryId);
  const storeTypeName = useComplaintStore((s) => s.selectedTypeName);
  const storeTypeId = useComplaintStore((s) => s.selectedTypeId);
  const setComplaintForm = useComplaintStore((s) => s.setComplaintForm);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(storeCategoryName || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(storeCategoryId);
  const [categoriesList, setCategoriesList] = useState<ComplainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Sub-type state
  const [availableTypes, setAvailableTypes] = useState<ComplainType[]>([]);
  const [selectedTypeName, setSelectedTypeName] = useState(storeTypeName || '');
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(storeTypeId);

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/home');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await citizenService.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategoriesList(data);
      } else {
        setCategoriesList([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(true);
      setCategoriesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Restore available types if category was already selected in store
  useEffect(() => {
    if (categoriesList.length > 0 && selectedCategoryId) {
      const current = categoriesList.find((c) => c.id === selectedCategoryId);
      if (current && Array.isArray(current.types)) {
        setAvailableTypes(current.types);
      }
    }
  }, [categoriesList, selectedCategoryId]);

  const handleCategorySelect = (cat: ComplainCategory) => {
    setSelectedCategory(cat.name);
    setSelectedCategoryId(cat.id);
    // Set available types from the selected category
    if (Array.isArray(cat.types) && cat.types.length > 0) {
      setAvailableTypes(cat.types);
    } else {
      setAvailableTypes([]);
    }
    // Reset type selection when category changes
    setSelectedTypeName('');
    setSelectedTypeId(null);
  };

  const canContinue = !!(
    selectedCategory &&
    selectedCategoryId &&
    (availableTypes.length === 0 || (selectedTypeId !== null && selectedTypeName.trim() !== ''))
  );

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <Header showBack title="Raise a complaint" onBack={() => router.replace('/home')} />

        <ScrollView 
          className="flex-1 px-6 pt-4" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-4">
            <FormStepper currentStep={1} totalSteps={6} />
          </View>

          <View className="mb-6">
            <Text className="text-xl font-inter-bold text-dark mb-1">
              Select Category & Type
            </Text>
            <Text className="text-sm font-inter text-muted">
              Choose the category and issue type to categorize your complaint.
            </Text>
          </View>

          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-muted font-inter mt-4">Loading categories...</Text>
            </View>
          ) : error ? (
            <View className="py-12 items-center justify-center">
              <Text className="text-muted font-inter mb-4">Failed to load categories</Text>
              <Button title="Retry" onPress={fetchCategories} />
            </View>
          ) : categoriesList.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Text className="text-muted font-inter">No categories available</Text>
            </View>
          ) : (
            <View className="space-y-2">
              {/* 1. Complaint Category Dropdown */}
              <Dropdown
                label="Complaint Category *"
                value={selectedCategory || ''}
                options={categoriesList}
                placeholder="Select complaint category"
                onSelect={(name, id) => {
                  const cat = categoriesList.find((c) => c.id === id || c.name === name);
                  if (cat) {
                    handleCategorySelect(cat);
                  } else {
                    setSelectedCategory(name);
                    setSelectedCategoryId(id ?? null);
                    setAvailableTypes([]);
                    setSelectedTypeName('');
                    setSelectedTypeId(null);
                  }
                }}
              />

              {/* 2. Complaint Type Dropdown */}
              <Dropdown
                label="Complaint Type *"
                value={selectedTypeName}
                options={availableTypes}
                placeholder={
                  !selectedCategory
                    ? "Select category first"
                    : availableTypes.length > 0
                    ? "Select complaint type"
                    : "No sub-types for this category"
                }
                disabled={!selectedCategory || availableTypes.length === 0}
                onSelect={(name, id) => {
                  setSelectedTypeName(name);
                  setSelectedTypeId(id ?? null);
                }}
              />

              {selectedCategory && availableTypes.length === 0 && (
                <Text className="text-xs font-inter text-muted -mt-2 mb-2">
                  No sub-types required for this category. You can proceed to the next step.
                </Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom action bar — Back + Continue */}
        <View className="px-6 py-4 border-t border-border bg-background flex-row gap-x-3">
          <View className="flex-[0.8]">
            <Button
              title="Back"
              variant="outline"
              onPress={() => router.replace('/home')}
            />
          </View>
          <View className="flex-[1.2]">
            <Button
              title="Continue"
              onPress={() => {
                if (canContinue) {
                  setComplaintForm({
                    selectedCategoryId,
                    selectedCategoryName: selectedCategory || '',
                    selectedTypeId,
                    selectedTypeName,
                  });
                  
                  router.push('/complaint/details');
                }
              }}
              disabled={!canContinue}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
