import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator, BackHandler, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Dropdown } from '@/components/Dropdown';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { TagIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { citizenService } from '@/services/citizenService';
import type { ComplainCategory, ComplainType } from '@/services/types';

export default function CategoryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoriesList, setCategoriesList] = useState<ComplainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onBackPress = () => {
      router.replace('/home');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  // Sub-type state
  const [availableTypes, setAvailableTypes] = useState<ComplainType[]>([]);
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const setComplaintForm = useComplaintStore((s) => s.setComplaintForm);

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

  const canContinue = selectedCategory && selectedCategoryId && 
    (availableTypes.length === 0 || (selectedTypeId !== null));

  // Filter categories by search query
  const filteredCategories = searchQuery.trim()
    ? categoriesList.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.prefix && cat.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoriesList;

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background h-screen overflow-hidden"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <Header showBack title="Raise a complaint" onBack={() => router.replace('/home')} />

        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <FormStepper currentStep={1} totalSteps={6} />
          </View>

          {/* Search Bar */}
          {!loading && !error && categoriesList.length > 0 && (
            <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 mb-4">
              <MagnifyingGlassIcon size={18} color={colors.muted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search category..."
                placeholderTextColor={colors.muted}
                className="flex-1 py-3 px-2 text-sm font-inter text-dark"
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                  <XMarkIcon size={18} color={colors.muted} />
                </TouchableOpacity>
              )}
            </View>
          )}

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
            <>
              {/* Category list — filtered by search */}
              {filteredCategories.length === 0 ? (
                <View className="py-10 items-center justify-center">
                  <Text className="text-muted font-inter text-sm">
                    No categories found for "{searchQuery}"
                  </Text>
                  <TouchableOpacity onPress={() => setSearchQuery('')} className="mt-2">
                    <Text className="text-primary font-inter-semibold text-sm">Clear search</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="mb-4 mt-4">
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        activeOpacity={0.7}
                        onPress={() => handleCategorySelect(category)}
                        className={`flex-row items-center justify-between p-4 mb-4 rounded-lg border ${
                          isSelected ? 'border-primary bg-primary/10' : 'border-border bg-surface'
                        }`}
                      >
                        <View className="flex-row items-center flex-1">
                          <TagIcon size={24} color={colors.primary} />
                          <View className="ml-4 flex-1">
                            <Text className="text-base font-inter-semibold text-dark">
                              {category.name}
                            </Text>
                            {category.prefix && (
                              <Text className="text-xs font-inter text-muted mt-0.5">
                                {category.prefix}
                              </Text>
                            )}
                          </View>
                        </View>

                        <View
                          className={`w-5 h-5 rounded-full border-2 items-center justify-center ml-4 ${
                            isSelected ? 'border-primary' : 'border-muted'
                          }`}
                        >
                          {isSelected && (
                            <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Complaint Type sub-dropdown */}
              {selectedCategory && availableTypes.length > 0 && (
                <View className="mb-4">
                  <Dropdown
                    label="Complaint Type *"
                    value={selectedTypeName}
                    options={availableTypes}
                    placeholder="Select complaint type"
                    onSelect={(name, id) => {
                      setSelectedTypeName(name);
                      setSelectedTypeId(id ?? null);
                    }}
                  />
                </View>
              )}
            </>
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
