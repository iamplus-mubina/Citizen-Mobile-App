import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DocumentTextIcon,
  ChevronRightIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { ServiceCategoryIcon } from '@/components/ServiceCategoryIcon';
import { POPULAR_SERVICE_CATEGORIES } from '@/services/mock/popularServices.data';
import { popularService, CategorySummary, CATEGORY_MAP } from '@/services/popularService';
import { useLanguageStore } from '@/store/useLanguageStore';
import { colors } from '@/constants/Colors';

export default function PopularServicesHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();

  const [categoriesData, setCategoriesData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [myApplicationsCount, setMyApplicationsCount] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [cats, apps] = await Promise.all([
        popularService.getCategories(),
        popularService.getMyApplications(),
      ]);

      const countMap: Record<string, number> = {};
      if (Array.isArray(cats)) {
        cats.forEach((c: CategorySummary) => {
          countMap[c.category] = Number(c.serviceCount) || 0;
        });
      }
      setCategoriesData(countMap);
      setMyApplicationsCount(Array.isArray(apps) ? apps.length : 0);
    } catch (err) {
      console.error('[PopularServicesHub] Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const containerClass =
    Platform.OS === 'web'
      ? 'flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden'
      : 'flex-1 bg-background';

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={t('home.popularServices', 'Popular Services')}
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-5 pt-4"
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
          {/* My Applications Quick Banner */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/services/my-applications' as any)}
            className="mb-5 bg-primary/10 border border-primary/20 rounded-2xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-11 h-11 rounded-xl bg-primary items-center justify-center mr-3">
                <ClockIcon size={22} color="#ffffff" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-base font-inter-bold text-dark">
                    {t('services.myApplications', 'My Applications')}
                  </Text>
                  {myApplicationsCount !== null && myApplicationsCount > 0 && (
                    <View className="ml-2 px-2 py-0.5 bg-primary rounded-full">
                      <Text className="text-xs font-inter-bold text-white">
                        {myApplicationsCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs font-inter-regular text-secondary mt-0.5">
                  {t('services.trackRequests', 'Track status of your submitted service requests')}
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Section Title */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-inter-bold text-dark">
              {t('services.serviceCategories', 'Service Categories')}
            </Text>
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>

          {/* Categories Grid */}
          <View className="flex-row flex-wrap -mx-[1%]">
            {POPULAR_SERVICE_CATEGORIES.map((cat) => {
              const backendCat = CATEGORY_MAP[cat.id as keyof typeof CATEGORY_MAP];
              const count = categoriesData[backendCat];

              return (
                <Card
                  key={cat.id}
                  variant="quick"
                  title={t(`services.${cat.id}`, cat.title)}
                  badgeCount={typeof count === 'number' && count > 0 ? count : undefined}
                  Icon={(props) => (
                    <ServiceCategoryIcon
                      category={cat.id}
                      size={props.size}
                      color={props.color}
                    />
                  )}
                  onPress={() => router.push(`/services/category/${cat.id}` as any)}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
