import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  DocumentTextIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { ServiceCategoryIcon } from '@/components/ServiceCategoryIcon';
import { colors } from '@/constants/Colors';
import {
  popularService,
  PopularServiceItem,
  getCategoryTitle as getTitle,
  toFrontendCategory,
} from '@/services/popularService';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function CategoryServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const params = useLocalSearchParams<{ categoryId: string }>();
  const categoryId = params.categoryId || 'citizen';

  const categoryTitle = getTitle(categoryId);
  const [services, setServices] = useState<PopularServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = useCallback(async () => {
    try {
      const data = await popularService.getServicesByCategory(categoryId);
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[CategoryServicesScreen] fetchServices error:', err);
      setServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const containerClass =
    Platform.OS === 'web'
      ? 'flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden'
      : 'flex-1 bg-background';

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return services;

    return services.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
    );
  }, [services, searchQuery]);

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={t(`services.${categoryId}`, categoryTitle)}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-xs font-inter text-secondary mt-3">
                {t('common.loading', 'Loading services...')}
              </Text>
            </View>
          ) : (
            <>
              {services.length > 0 && (
                <View className="px-5 pt-4 mb-2">
                  <Input
                    placeholder={t('services.searchPlaceholder', 'Search service by name...')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon={<MagnifyingGlassIcon size={18} color={colors.muted} />}
                    className="mb-0"
                  />
                </View>
              )}

              {/* Empty State */}
              {services.length === 0 ? (
                <View className="px-5 pt-8">
                  <View className="bg-surface border border-border rounded-2xl p-8 items-center justify-center">
                    <View className="w-14 h-14 rounded-full bg-primary-light items-center justify-center mb-3">
                      <Squares2X2Icon size={30} color={colors.primary} />
                    </View>
                    <Text className="text-base font-inter-bold text-dark text-center mb-1">
                      {t('services.noServices', 'No services here yet')}
                    </Text>
                    <Text className="text-xs font-inter text-secondary text-center leading-5 max-w-[260px]">
                      {t(
                        'services.noServicesDesc',
                        'The municipality has not published any active services under this category.'
                      )}
                    </Text>
                  </View>
                </View>
              ) : filteredServices.length > 0 ? (
                /* Service List */
                <View className="px-5 pt-2">
                  <View className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border">
                    {filteredServices.map((service) => {
                      const frontendKey = toFrontendCategory(String(service.category));
                      const docCount = service.requiredDocuments?.length || 0;

                      return (
                        <TouchableOpacity
                          key={service.id}
                          onPress={() => router.push(`/services/apply/${service.id}` as any)}
                          activeOpacity={0.7}
                          className="p-4 flex-row items-center"
                        >
                          <View className="w-11 h-11 rounded-xl bg-primary-light items-center justify-center mr-3.5">
                            <ServiceCategoryIcon
                              category={frontendKey}
                              size={22}
                              color={colors.primary}
                            />
                          </View>

                          <View className="flex-1 mr-2">
                            <Text className="text-sm font-inter-bold text-dark leading-snug">
                              {service.name}
                            </Text>
                            {service.description ? (
                              <Text
                                className="text-xs font-inter text-secondary mt-1 leading-4"
                                numberOfLines={2}
                              >
                                {service.description}
                              </Text>
                            ) : null}

                            {docCount > 0 && (
                              <View className="flex-row items-center mt-2">
                                <DocumentTextIcon size={13} color={colors.primary} />
                                <Text className="text-[11px] font-inter-medium text-primary ml-1">
                                  {docCount} {docCount === 1 ? 'document required' : 'documents required'}
                                </Text>
                              </View>
                            )}
                          </View>

                          <ChevronRightIcon size={18} color={colors.muted} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : (
                /* No search results */
                <View className="px-5 mt-6">
                  <View className="bg-surface border border-border rounded-2xl p-6 items-center">
                    <Text className="text-sm font-inter-semibold text-dark mb-1">
                      {t('services.noMatching', 'No matching services')}
                    </Text>
                    <Text className="text-xs font-inter text-secondary text-center">
                      {t('services.tryAnother', 'Try searching with another keyword.')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
