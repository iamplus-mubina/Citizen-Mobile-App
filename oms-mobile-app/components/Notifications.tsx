import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Tabs } from '@/components/Tabs';

type NotificationTab = 'All' | 'Unread';

const NOTIF_TABS: NotificationTab[] = ['All', 'Unread'];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Complaint Submitted',
    message: 'Your complaint CMP-1025 has been submitted successfully.',
    time: '13 May 2024 • 10:30 AM',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Complaint Under Review',
    message: 'Your complaint CMP-1025 is under review.',
    time: '13 May 2024 • 11:15 AM',
    read: true,
  },
  {
    id: 'notif-3',
    title: 'System Notification',
    message: 'New update available in the app.',
    time: '12 May 2024 • 08:00 AM',
    read: true,
  },
];

export function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');

  const counts = useMemo(() => ({
    All: MOCK_NOTIFICATIONS.length,
    Unread: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  }), []);

  const filteredNotifications = useMemo(() =>
    MOCK_NOTIFICATIONS.filter(
      (notif) => activeTab === 'All' || !notif.read
    ), [activeTab]);

  return (
    <View className="flex-1 w-full bg-background pt-2">
      <Tabs
        tabs={NOTIF_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        counts={counts}
        className="mb-2"
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          <View className="pb-24">
            {filteredNotifications.map((notif) => (
              <View 
                key={notif.id} 
                className="bg-surface border border-border rounded-lg p-4 mb-4"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-base font-inter-bold text-dark">{notif.title}</Text>
                  {!notif.read && (
                    <View className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </View>
                <Text className="text-sm font-inter text-dark mb-3 leading-5">
                  {notif.message}
                </Text>
                <Text className="text-xs font-inter-medium text-muted">
                  {notif.time}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-lg font-inter-medium text-muted">No unread notifications</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

