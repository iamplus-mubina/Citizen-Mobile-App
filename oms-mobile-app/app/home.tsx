import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Platform, ScrollView, TouchableOpacity, RefreshControl, BackHandler, ToastAndroid } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { BottomNavigation, TabType } from '@/components/BottomNavigation';
import { Card } from '@/components/Card';
import { 
  ClipboardDocumentListIcon,
  BellIcon,
  MegaphoneIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { MyComplaints } from '@/components/MyComplaints';
import { Notifications } from '@/components/Notifications';
import { Updates } from '@/components/Updates';
import { Profile } from '@/components/Profile';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useComplaintStore } from '@/store/useComplaintStore';
import { citizenService } from '@/services/citizenService';
import { getCleanImageUrl } from '@/utils/image';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [refreshing, setRefreshing] = useState(false);
  const lastBackPress = useRef(0);

  useEffect(() => {
    if (params?.tab && ['home', 'complaints', 'updates', 'profile', 'notifications'].includes(params.tab)) {
      setActiveTab(params.tab as TabType);
    }
  }, [params?.tab]);

  useEffect(() => {
    const onBackPress = () => {
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      const now = Date.now();
      if (now - lastBackPress.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      lastBackPress.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      }
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [activeTab]);
  const { 
    submittedComplaints, 
    totalComplaintsCount,
    profilePhoto, 
    setProfilePhoto, 
    setProfileFromApi, 
    setComplaints 
  } = useComplaintStore();

  const loadData = useCallback(async () => {
    try {
      // 1. Fetch Profile
      try {
        const profileRes = await citizenService.getProfile();
        if (profileRes) {
          setProfileFromApi(profileRes);
          const photo = getCleanImageUrl(profileRes.ProfileImage || (profileRes as any).profileImage);
          if (photo) {
            setProfilePhoto(photo);
            AsyncStorage.setItem('user_profile_photo', photo).catch(() => {});
          } else {
            setProfilePhoto(null);
            AsyncStorage.removeItem('user_profile_photo').catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Failed to load profile in home:', err);
      }

      // 2. Fetch Complaints
      try {
        const complaintsRes = await citizenService.getMyComplaints({
          page: { number: 0, size: 20 },
          status: ''
        });
        const list = complaintsRes.data || [];
        const total = complaintsRes.total ?? list.length;
        setComplaints(list, total);
      } catch (err) {
        console.warn('Failed to load complaints in home:', err);
      }
    } finally {
      setRefreshing(false);
    }
  }, [setProfileFromApi, setProfilePhoto, setComplaints]);

  useEffect(() => {
    const loadSavedPhoto = async () => {
      try {
        const savedPhoto = await AsyncStorage.getItem('user_profile_photo');
        const cleanPhoto = getCleanImageUrl(savedPhoto);
        if (cleanPhoto && !profilePhoto) {
          setProfilePhoto(cleanPhoto);
        }
      } catch (err) {
        console.error('Failed to load saved profile photo:', err);
      }
    };

    loadSavedPhoto();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background justify-between h-screen overflow-hidden"
    : "flex-1 bg-background justify-between";

  // Dynamic counts derived from actual dual-status data
  const totalCount = totalComplaintsCount || submittedComplaints.length;
  const pendingCount = submittedComplaints.filter(c => c.requestStatus === 'PENDING').length;
  const inProgressCount = submittedComplaints.filter(c => (c.liveStatus || '').toUpperCase().includes('PROGRESS')).length;
  const solvedCount = submittedComplaints.filter(c => {
    const live = (c.liveStatus || '').toUpperCase();
    return (live.includes('SOLVED') && !live.includes('UNSOLVED')) || live.includes('RESOLVED') || live.includes('COMPLETE');
  }).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView 
            className="flex-1 px-5 pt-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >

            <Card 
              variant="complaint"
              title="Raise a complaint"
              description="Report a civic issue in simple steps with photos and location details."
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
                  title="Notifications" 
                  Icon={BellIcon} 
                  onPress={() => setActiveTab('notifications')}
                />
                <Card 
                  variant="quick"
                  title="Updates" 
                  Icon={MegaphoneIcon} 
                  onPress={() => setActiveTab('updates')}
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
                <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                  <Text className="text-xl font-inter-bold text-dark mb-2">{totalCount}</Text>
                  <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Total</Text>
                </View>
                <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                  <Text className="text-xl font-inter-bold text-amber-600 mb-2">{pendingCount}</Text>
                  <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Pending</Text>
                </View>
                <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                  <Text className="text-xl font-inter-bold text-blue-600 mb-2">{inProgressCount}</Text>
                  <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>In progress</Text>
                </View>
                <View className="flex-1 bg-surface border border-border rounded-xl p-2 mx-1">
                  <Text className="text-xl font-inter-bold text-emerald-600 mb-2">{solvedCount}</Text>
                  <Text className="text-[10px] font-inter text-dark" numberOfLines={1} adjustsFontSizeToFit>Solved</Text>
                </View>
              </View>
            </View>

            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-inter-bold text-dark">Recent activity</Text>
                <TouchableOpacity onPress={() => setActiveTab('complaints')}>
                  <Text className="text-sm font-inter text-primary">View all</Text>
                </TouchableOpacity>
              </View>

              {submittedComplaints.length > 0 ? (
                submittedComplaints.slice(0, 5).map((item) => (
                  <View key={item.ticketId || item.id} className="mb-3">
                    <Card 
                      variant="recent"
                      ticketId={item.ticketId}
                      title={item.type || item.category || 'Complaint'}
                      description={item.description || (item.category ? `${item.category}` : undefined)}
                      date={item.date}
                      requestStatus={item.requestStatus}
                      liveStatus={item.liveStatus}
                      rejectionReason={item.rejectionReason}
                      onPress={() => router.push(`/complaint/timeline/${item.ticketId}`)}
                    />
                  </View>
                ))
              ) : (
                <View className="bg-surface border border-border rounded-xl p-6 items-center">
                  <Text className="text-base font-inter-semibold text-dark mb-1">No complaints yet</Text>
                  <Text className="text-xs font-inter text-muted text-center">
                    Tap "Raise a complaint" above to report a civic issue in your area.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        );
      case 'complaints':
        return <MyComplaints />;
      case 'updates':
        return <Updates />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className={containerClass}>
        <View className="flex-1">
          <Header
            avatarUrl={profilePhoto || undefined}
          />
          {renderTabContent()}
        </View>
        
        <BottomNavigation 
          activeTab={activeTab} 
          onTabPress={(tab) => {
            setActiveTab(tab);
          }} 
        />
      </View>
    </View>
  );
}
