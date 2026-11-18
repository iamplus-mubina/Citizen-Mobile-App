import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ClockIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  Squares2X2Icon,
} from 'react-native-heroicons/outline';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors } from '@/constants/Colors';
import {
  popularService,
  PopularServiceApplication,
  getCategoryTitle,
} from '@/services/popularService';
import { useLanguageStore } from '@/store/useLanguageStore';

const getStatusBadge = (status: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'APPROVED') {
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      label: 'Approved',
      Icon: CheckCircleIcon,
    };
  }
  if (s === 'REJECTED') {
    return {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      label: 'Rejected',
      Icon: XCircleIcon,
    };
  }
  if (s === 'IN_PROGRESS') {
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-700',
      label: 'Under Scrutiny',
      Icon: ClockIcon,
    };
  }
  return {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    label: 'Pending',
    Icon: ClockIcon,
  };
};

export default function MyApplicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();

  const [applications, setApplications] = useState<PopularServiceApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchApplications = useCallback(async () => {
    try {
      const data = await popularService.getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[MyApplicationsScreen] fetchApplications error:', err);
      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'ALL') return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  const filterTabs = [
    { key: 'ALL', label: t('common.all', 'All') },
    { key: 'PENDING', label: t('services.pending', 'Pending') },
    { key: 'IN_PROGRESS', label: t('services.underScrutiny', 'In Progress') },
    { key: 'APPROVED', label: t('services.approved', 'Approved') },
    { key: 'REJECTED', label: t('services.rejected', 'Rejected') },
  ];

  const containerClass =
    Platform.OS === 'web'
      ? 'flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden'
      : 'flex-1 bg-background';

  return (
    <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <Header
          showBack
          title={t('services.myApplications', 'My Service Requests')}
          onBack={() => router.back()}
        />

        {/* Filter Chips */}
        <View className="py-2.5 px-5 border-b border-border bg-background">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {filterTabs.map((tab) => {
              const isSelected = statusFilter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setStatusFilter(tab.key)}
                  activeOpacity={0.7}
                  className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={`text-xs font-inter-semibold ${
                      isSelected ? 'text-white' : 'text-secondary'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-xs font-inter text-secondary mt-3">
                {t('common.loading', 'Loading applications...')}
              </Text>
            </View>
          ) : filteredApplications.length === 0 ? (
            <View className="py-12 px-4 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-primary-light items-center justify-center mb-4">
                <Squares2X2Icon size={32} color={colors.primary} />
              </View>
              <Text className="text-base font-inter-bold text-dark text-center mb-1">
                {t('services.noRequestsFound', 'No service requests found')}
              </Text>
              <Text className="text-xs font-inter text-secondary text-center max-w-[260px] mb-6">
                {statusFilter === 'ALL'
                  ? t('services.noRequestsDesc', 'You have not submitted any service applications yet.')
                  : t('services.noFilterRequests', 'No requests match the selected filter.')}
              </Text>
              <Button
                title={t('services.exploreServices', 'Browse Popular Services')}
                onPress={() => router.push('/services' as any)}
                className="w-full max-w-[240px]"
              />
            </View>
          ) : (
            <View className="space-y-3">
              {filteredApplications.map((app) => {
                const statusStyle = getStatusBadge(app.status);
                const StatusIcon = statusStyle.Icon;
                const formattedDate = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';
                const categoryTitle = getCategoryTitle(app.service?.category || '');

                return (
                  <TouchableOpacity
                    key={app.id}
                    onPress={() =>
                      router.push({
                        pathname: '/services/request/[requestId]' as any,
                        params: { requestId: String(app.id) },
                      })
                    }
                    activeOpacity={0.7}
                    className="bg-surface border border-border rounded-2xl p-4"
                  >
                    {/* Header: Token & Status Badge */}
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="bg-primary-light px-2.5 py-1 rounded-md">
                        <Text className="text-xs font-inter-bold text-primary">
                          {app.tokenNumber}
                        </Text>
                      </View>
                      <View
                        className={`flex-row items-center px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}
                      >
                        <StatusIcon size={12} className={statusStyle.text} />
                        <Text
                          className={`text-[10px] font-inter-bold ml-1 ${statusStyle.text}`}
                        >
                          {statusStyle.label}
                        </Text>
                      </View>
                    </View>

                    {/* Service Name & Category */}
                    <Text className="text-base font-inter-bold text-dark leading-snug">
                      {app.service?.name || t('services.serviceRequest', 'Service Request')}
                    </Text>
                    {categoryTitle ? (
                      <Text className="text-xs font-inter-medium text-secondary mt-0.5">
                        {categoryTitle}
                      </Text>
                    ) : null}

                    {/* Rejection Note */}
                    {app.status === 'REJECTED' && app.rejectionReason && (
                      <View className="mt-2.5 bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex-row items-start">
                        <ExclamationCircleIcon size={16} color="#e11d48" className="mt-0.5" />
                        <View className="ml-2 flex-1">
                          <Text className="text-[11px] font-inter-bold text-rose-700">
                            {t('services.reasonForRejection', 'Reason for rejection')}:
                          </Text>
                          <Text className="text-[11px] font-inter text-rose-600 mt-0.5">
                            {app.rejectionReason}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Footer Info */}
                    <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-border/60">
                      <View className="flex-row items-center">
                        <DocumentTextIcon size={14} color={colors.secondary} />
                        <Text className="text-[11px] font-inter text-secondary ml-1">
                          {app.documents?.length || 0} {t('services.docs', 'docs')}
                        </Text>
                        {formattedDate ? (
                          <>
                            <Text className="text-secondary mx-1.5">•</Text>
                            <Text className="text-[11px] font-inter text-secondary">
                              {formattedDate}
                            </Text>
                          </>
                        ) : null}
                      </View>

                      <View className="flex-row items-center">
                        <Text className="text-xs font-inter-bold text-primary mr-0.5">
                          {t('services.viewDetails', 'View')}
                        </Text>
                        <ChevronRightIcon size={14} color={colors.primary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
