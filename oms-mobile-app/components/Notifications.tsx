import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Tabs } from '@/components/Tabs';
import { useComplaintStore, SubmittedComplaint } from '@/store/useComplaintStore';

type NotificationTab = 'All' | 'Unread';

const NOTIF_TABS: NotificationTab[] = ['All', 'Unread'];

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');
  const { submittedComplaints } = useComplaintStore();

  const notificationsList: NotificationItem[] = useMemo(() => {
    if (submittedComplaints.length === 0) return [];
    return submittedComplaints.map((c: SubmittedComplaint, index: number) => ({
      id: `notif-${c.ticketId}`,
      title: `Complaint Status: ${c.status}`,
      message: `Your complaint ${c.ticketId} (${c.title}) status is currently ${c.status}.`,
      time: `${c.date} • Submitted`,
      read: index > 0,
    }));
  }, [submittedComplaints]);

  const counts = useMemo(() => ({
    All: notificationsList.length,
    Unread: notificationsList.filter((n: NotificationItem) => !n.read).length,
  }), [notificationsList]);

  const filteredNotifications = useMemo(() =>
    notificationsList.filter(
      (notif: NotificationItem) => activeTab === 'All' || !notif.read
    ), [notificationsList, activeTab]);

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
            {filteredNotifications.map((notif: NotificationItem) => (
              <View 
                key={notif.id} 
                className="bg-surface border border-border rounded-lg p-4 mb-4"
              >
                <View className="flex-row items-start justify-between mb-1">
                  <Text className="text-base font-inter-bold text-dark flex-1 pr-2">{notif.title}</Text>
                  {!notif.read && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
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

