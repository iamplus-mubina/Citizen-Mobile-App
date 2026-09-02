import { useState } from 'react';
import { View, Text, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { BottomNavigation, TabType } from '@/components/BottomNavigation';
import { Card } from '@/components/Card';
import { 
  ClipboardDocumentListIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { MyComplaints } from '@/components/MyComplaints';
import { Notifications } from '@/components/Notifications';
import { Profile } from '@/components/Profile';

import { useComplaintStore } from '@/store/useComplaintStore';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const router = useRouter();
  const { submittedComplaints, profilePhoto } = useComplaintStore();

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background justify-between";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView 
            className="flex-1 px-5 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >

            <Card 
              variant="complaint"
              title="Raise a complaint"
              description="Report a civic issue in six clear steps. You can add location and evidence."
              onPress={() => router.push('/complaint/category')}
            />

            <View className="mb-2 mt-6">
              <Text className="text-lg font-inter-bold text-dark mb-4">Quick Actions</Text>
              
              <View className="flex-row flex-wrap -mx-[1%]">
                <Card 
                  variant="quick"
                  title="My Complaints" 
                  Icon={ClipboardDocumentListIcon} 
                  onPress={() => setActiveTab('complaints')}
                />
                <Card 
                  variant="quick"
                  title="Track Status" 
                  Icon={MagnifyingGlassIcon} 
                  onPress={() => router.push({ pathname: '/complaint/timeline/[id]', params: { id: 'CMP-1025' } })}
                />
                <Card 
                  variant="quick"
                  title="Notifications" 
                  Icon={BellIcon} 
                  badgeCount={3}
                  onPress={() => setActiveTab('notifications')}
                />
                <Card 
                  variant="quick"
                  title="Help & Support" 
                  Icon={QuestionMarkCircleIcon} 
                  onPress={() => router.push('/help' as any)}
                />
                <Card 
                  variant="quick"
                  title="Updates" 
                  Icon={MegaphoneIcon} 
                  badgeCount={2}
                  onPress={() => router.push('/updates' as any)}
                />
                <Card 
                  variant="quick"
                  title="My Profile" 
                  Icon={UserIcon} 
                  onPress={() => setActiveTab('profile')}
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-lg font-inter-bold text-dark mb-4">Your complaint position</Text>
              
              <View className="flex-row justify-between mx-[-4px]">
                {(() => {
                  const totalCount = submittedComplaints.length;
                  const openCount = submittedComplaints.filter(c => c.status.toLowerCase().includes('pending')).length;
                  const inProgressCount = submittedComplaints.filter(c => c.status.toLowerCase().includes('progress') || c.status.toLowerCase().includes('assign')).length;
                  const resolvedCount = submittedComplaints.filter(c => c.status.toLowerCase().includes('resolv') || c.status.toLowerCase().includes('complet')).length;

                  return (
                    <>
                      <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                        <Text className="text-xl font-inter-bold text-dark mb-2">{totalCount}</Text>
                        <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Total</Text>
                      </View>
                      <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                        <Text className="text-xl font-inter-bold text-dark mb-2">{openCount}</Text>
                        <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Open</Text>
                      </View>
                      <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                        <Text className="text-xl font-inter-bold text-dark mb-2">{inProgressCount}</Text>
                        <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>In progress</Text>
                      </View>
                      <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                        <Text className="text-xl font-inter-bold text-dark mb-2">{resolvedCount}</Text>
                        <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Resolved</Text>
                      </View>
                    </>
                  );
                })()}
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-inter-bold text-dark">Recent activity</Text>
                <TouchableOpacity onPress={() => setActiveTab('complaints')}>
                  <Text className="text-sm font-inter text-primary">View all</Text>
                </TouchableOpacity>
              </View>

              {submittedComplaints.map((item) => (
                <View key={item.ticketId} className="mb-3">
                  <Card 
                    variant="recent"
                    ticketId={item.ticketId}
                    title={item.title}
                    description={item.category ? `${item.category} · ${item.ward || 'Ward 1'}` : undefined}
                    date={item.date}
                    status={item.status}
                    onPress={() => router.push(`/complaint/timeline/${item.ticketId}`)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'complaints':
        return <MyComplaints />;
      case 'updates':
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <View className="flex-1">
          <Header
            avatarUrl={profilePhoto || undefined}
            notificationCount={3}
            onNotificationPress={() => setActiveTab('notifications')}
          />
          {renderTabContent()}
        </View>
        
        <BottomNavigation 
          activeTab={activeTab} 
          onTabPress={(tab) => {
            if (tab === 'updates') {
              router.push('/updates' as any);
            } else {
              setActiveTab(tab);
            }
          }} 
          updatesBadgeCount={2}
        />
      </View>
    </SafeAreaView>
  );
}
