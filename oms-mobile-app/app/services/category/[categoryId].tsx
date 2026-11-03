import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { ServiceCategoryIcon } from '@/components/ServiceCategoryIcon';
import { colors } from '@/constants/Colors';
import {
  getCategoryTitle,
  getServicesByCategory,
  ServiceCategoryKey,
} from '@/services/mock/popularServices.data';

export default function CategoryServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ categoryId: string }>();
  const categoryId = (params.categoryId || 'citizen') as ServiceCategoryKey;

  const categoryTitle = getCategoryTitle(categoryId);
  const allServices = useMemo(() => getServicesByCategory(categoryId), [categoryId]);
  const [searchQuery, setSearchQuery] = useState('');

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background";

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allServices;

    return allServices.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    );
  }, [allServices, searchQuery]);

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={categoryTitle}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {allServices.length > 0 && (
            <>
              <View className="px-5 pt-5 pb-1">
                <Text className="text-sm font-inter-semibold text-dark">
                  Search services
                </Text>
              </View>

              <View className="px-5 mb-4">
                <Input
                  placeholder="Service name"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  leftIcon={<MagnifyingGlassIcon size={18} color={colors.muted} />}
                  className="mb-0"
                />
              </View>
            </>
          )}

          {/* Empty State */}
          {allServices.length === 0 ? (
            <View className="px-5 pt-5">
              <View className="bg-surface border border-border rounded-xl p-8 items-center justify-center">
                <View className="w-14 h-14 rounded-full bg-primary-light items-center justify-center mb-3">
                  <Squares2X2Icon size={30} color={colors.primary} />
                </View>
                <Text className="text-base font-inter-bold text-dark text-center mb-1">
                  No services here yet
                </Text>
                <Text className="text-xs font-inter text-muted text-center leading-5 max-w-[260px]">
                  The municipality has not opened services of this kind. Try another type.
                </Text>
              </View>
            </View>
          ) : filteredServices.length > 0 ? (
            /* Service List */
            <View className="px-5">
              <View className="bg-surface border border-border rounded-xl overflow-hidden">
                {filteredServices.map((service, index) => {
                  const isLast = index === filteredServices.length - 1;
                  return (
                    <TouchableOpacity
                      key={service.id}
                      onPress={() => router.push(`/services/appointment/${service.id}` as any)}
                      activeOpacity={0.7}
                      className={`p-4 flex-row items-center ${
                        !isLast ? 'border-b border-border' : ''
                      }`}
                    >
                      <View className="w-11 h-11 rounded-xl bg-primary-light items-center justify-center mr-3.5">
                        <ServiceCategoryIcon category={service.categoryId} size={22} color={colors.primary} />
                      </View>

                      <View className="flex-1 mr-2">
                        <Text className="text-sm font-inter-bold text-dark leading-snug">
                          {service.title}
                        </Text>
                        <Text className="text-xs font-inter text-muted mt-1 leading-4">
                          {service.description}
                        </Text>
                        {service.subNotice && (
                          <Text className="text-xs font-inter text-muted mt-1">
                            {service.subNotice}
                          </Text>
                        )}
                      </View>

                      <ChevronRightIcon size={16} color={colors.muted} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            /* No search results */
            <View className="px-5 mt-2">
              <View className="bg-surface border border-border rounded-2xl p-6 items-center">
                <Text className="text-sm font-inter-semibold text-dark mb-1">
                  No matching services
                </Text>
                <Text className="text-xs font-inter text-muted text-center">
                  Try another service name.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
