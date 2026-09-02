import { useState } from 'react';
import { View, Text, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { BottomNavigation, TabType } from '@/components/BottomNavigation';
import { Card } from '@/components/Card';
import { MenuDrawer } from '@/components/MenuDrawer';
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
import { useComplaintStore } from '@/store/useComplaintStore';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { submittedComplaints, profilePhoto } = useComplaintStore();

  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background justify-between";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>

            <Card 
              variant="complaint"
              title="Register Complaint"
              description="Raise a new complaint"
              onPress={() => router.push('/complaint/category')}
            />

            <View className="mb-8">
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
                  onPress={() => router.push('/updates' as any)}
                />
                <Card 
                  variant="quick"
                  title="My Profile" 
                  Icon={UserIcon} 
                  onPress={() => router.push('/profile' as any)}
                />
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-inter-bold text-dark">Recent Complaints</Text>
                <TouchableOpacity onPress={() => setActiveTab('complaints')}>
                  <Text className="text-sm font-inter-semibold text-primary underline">View All</Text>
                </TouchableOpacity>
              </View>

              {submittedComplaints.map((item) => (
                <View key={item.ticketId} className="mb-3">
                  <Card 
                    variant="recent"
                    ticketId={item.ticketId}
                    title={item.ticketId}
                    description={item.title}
                    date={item.date}
                    status={item.status}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'complaints':
        return <MyComplaints />;
      case 'notifications':
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className={containerClass}>
        <View className="flex-1">
          <Header
            avatarUrl={profilePhoto || undefined}
            onMenuPress={() => setDrawerOpen(true)}
          />
          {renderTabContent()}
        </View>
        
        <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
        
        <MenuDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSelectTab={(tab) => setActiveTab(tab as TabType)}
        />
      </View>
    </SafeAreaView>
  );
}
