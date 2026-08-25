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
  UserIcon,
  QuestionMarkCircleIcon
} from 'react-native-heroicons/outline';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const router = useRouter();

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
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between"
    : "flex-1 bg-background justify-between";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <Text className="text-xl font-inter text-muted mb-1">Good Morning,</Text>
              <Text className="text-3xl font-inter-bold text-text">Rahul Sharma</Text>
            </View>

            <Card 
              variant="complaint"
              title="Register Complaint"
              description="Raise a new complaint"
              onPress={() => router.push('/complaint/category')}
            />

            <View className="mb-8">
              <Text className="text-lg font-inter-bold text-text mb-4">Quick Actions</Text>
              
              <View className="flex-row flex-wrap justify-between">
                <Card 
                  variant="quick"
                  title="My Complaints" 
                  Icon={ClipboardDocumentListIcon} 
                  onPress={() => setActiveTab('complaints')}
                />

                <Card 
                  variant="quick"
                  title="Notifications" 
                  Icon={BellIcon} 
                  onPress={() => setActiveTab('notifications')}
                />

                <Card 
                  variant="quick"
                  title="Profile" 
                  Icon={UserIcon} 
                  onPress={() => setActiveTab('profile')}
                />

                <Card 
                  variant="quick"
                  title="Help & Support" 
                  Icon={QuestionMarkCircleIcon} 
                  onPress={() => console.log('Help pressed')}
                />
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-inter-bold text-text">Recent Complaints</Text>
                <TouchableOpacity onPress={() => setActiveTab('complaints')}>
                  <Text className="text-sm font-inter-semibold text-primary underline">View All</Text>
                </TouchableOpacity>
              </View>

              <Card 
                variant="recent"
                ticketId="CMP-1024"
                title="CMP-1024"
                description="Road Repair"
                date={getFormattedDate()}
                status="In Progress"
              />
            </View>
          </ScrollView>
        );
      case 'complaints':
        return (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-xl font-inter-semibold text-text">Complaints Screen</Text>
          </View>
        );
      case 'notifications':
        return (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-xl font-inter-semibold text-text">Notifications Screen</Text>
          </View>
        );
      case 'profile':
        return (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-xl font-inter-semibold text-text">Profile Screen</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className={containerClass}>
        <View className="flex-1">
          <Header />
          {renderTabContent()}
        </View>
        
        <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}
