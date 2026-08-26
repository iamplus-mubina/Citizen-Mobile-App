import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

type NotificationTab = 'All' | 'Unread';

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

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(
    (notif) => activeTab === 'All' || !notif.read
  );

  return (
    <View className="flex-1 w-full bg-background pt-4">
      <View className="flex-row px-6 mb-6">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('All')}
          className={`flex-1 py-2 items-center rounded-md ${
            activeTab === 'All' ? 'bg-secondary border border-border' : ''
          }`}
        >
          <Text
            className={`text-base ${
              activeTab === 'All' ? 'font-inter-bold text-dark' : 'font-inter-medium text-muted'
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('Unread')}
          className={`flex-1 py-2 items-center rounded-md ${
            activeTab === 'Unread' ? 'bg-secondary border border-border' : ''
          }`}
        >
          <Text
            className={`text-base ${
              activeTab === 'Unread' ? 'font-inter-bold text-dark' : 'font-inter-medium text-muted'
            }`}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          <View className="space-y-4 pb-24">
            {filteredNotifications.map((notif) => (
              <View 
                key={notif.id} 
                className="bg-background border border-border rounded-xl p-4 shadow-sm mb-4"
              >
                <Text className="text-base font-inter-bold text-dark mb-1">
                  {notif.title}
                </Text>
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
