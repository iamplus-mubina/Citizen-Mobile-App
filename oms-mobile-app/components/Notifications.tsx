import { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeOpenIcon,
} from 'react-native-heroicons/outline';
import { Tabs } from '@/components/Tabs';
import { useNotificationStore } from '@/store/useNotificationStore';
import type { CitizenNotificationItem } from '@/services/types';
import { colors } from '@/constants/Colors';

type NotificationTab = 'All' | 'Unread';
const NOTIF_TABS: NotificationTab[] = ['All', 'Unread'];

export function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    fetchNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const counts = useMemo(
    () => ({
      All: notifications.length,
      Unread: unreadCount,
    }),
    [notifications.length, unreadCount],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'Unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return 'Recently';
    }
  };

  const handleNotificationPress = async (item: CitizenNotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }

    // Smart routing based on type
    if (item.type === 'COMPLAINT_STATUS') {
      router.replace({ pathname: '/home', params: { tab: 'complaints' } });
    } else if (item.type === 'NEW_UPDATE') {
      router.replace({ pathname: '/home', params: { tab: 'updates' } });
    }
  };

  const renderIcon = (item: CitizenNotificationItem) => {
    const text = (item.title + ' ' + item.message).toLowerCase();

    if (text.includes('approved') || text.includes('मंजूर') || text.includes('solved')) {
      return (
        <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-3 border border-emerald-100">
          <CheckCircleIcon size={22} color="#059669" />
        </View>
      );
    }
    if (text.includes('reject') || text.includes('नाकारली')) {
      return (
        <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center mr-3 border border-rose-100">
          <ExclamationCircleIcon size={22} color="#E11D48" />
        </View>
      );
    }
    if (item.type === 'NEW_UPDATE' || text.includes('update') || text.includes('अपडेट')) {
      return (
        <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-3 border border-indigo-100">
          <MegaphoneIcon size={22} color="#4F46E5" />
        </View>
      );
    }
    return (
      <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3 border border-blue-100">
        <ClipboardDocumentCheckIcon size={22} color={colors.primary} />
      </View>
    );
  };

  return (
    <View className="flex-1 w-full bg-background pt-2">
      {/* Top action bar with tabs and mark-all-read */}
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Tabs
            tabs={NOTIF_TABS}
            activeTab={activeTab}
            onTabPress={setActiveTab}
            counts={counts}
          />
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            activeOpacity={0.7}
            className="flex-row items-center py-1.5 px-2.5 rounded-lg bg-primary/10 -mt-2 ml-2"
          >
            <EnvelopeOpenIcon size={14} color={colors.primary} />
            <Text className="text-xs font-inter-semibold text-primary ml-1.5">
              Read All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && notifications.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-sm font-inter-medium text-muted mt-3">
              Loading notifications...
            </Text>
          </View>
        ) : filteredNotifications.length > 0 ? (
          <View className="pb-28 pt-1">
            {filteredNotifications.map((notif: CitizenNotificationItem) => {
              const isUnread = !notif.isRead;
              return (
                <TouchableOpacity
                  key={notif.id}
                  activeOpacity={0.75}
                  onPress={() => handleNotificationPress(notif)}
                  className={`border rounded-xl p-4 mb-3 ${
                    isUnread
                      ? 'bg-white border-primary/30 shadow-sm'
                      : 'bg-surface border-border/80'
                  }`}
                >
                  <View className="flex-row items-start">
                    {renderIcon(notif)}

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text
                          className={`text-base flex-1 pr-2 ${
                            isUnread ? 'font-inter-bold text-dark' : 'font-inter-semibold text-dark/80'
                          }`}
                          numberOfLines={1}
                        >
                          {notif.title}
                        </Text>
                        {isUnread && (
                          <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </View>

                      <Text
                        className="text-sm font-inter text-dark/80 mb-2 leading-5"
                        numberOfLines={3}
                      >
                        {notif.message}
                      </Text>

                      <Text className="text-xs font-inter-medium text-muted">
                        {formatTimestamp(notif.createdDate)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-24 pb-20">
            <View className="w-16 h-16 rounded-full bg-surface border border-border items-center justify-center mb-3">
              <BellIcon size={28} color={colors.muted} />
            </View>
            <Text className="text-base font-inter-bold text-dark">
              {activeTab === 'Unread' ? 'No unread notifications' : 'No notifications yet'}
            </Text>
            <Text className="text-xs font-inter text-muted text-center max-w-[260px] mt-1.5 leading-4">
              {activeTab === 'Unread'
                ? 'All caught up! Any new updates or complaint status changes will show up here.'
                : 'Complaint updates and announcements from the office will be listed here.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
