import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { colors } from '@/constants/Colors';

type FilterTab = 'All' | 'Pending' | 'In Progress' | 'Resolved';

const TABS: FilterTab[] = ['All', 'Pending', 'In Progress', 'Resolved'];

const MOCK_COMPLAINTS = [
  {
    id: 'CMP-1025',
    title: 'Pipeline Leakage',
    status: 'Pending Verification',
    date: '12 May 2024',
  },
  {
    id: 'CMP-1024',
    title: 'Road Repair',
    status: 'In Progress',
    date: '12 May 2024',
  },
  {
    id: 'CMP-1023',
    title: 'Street Light Not Working',
    status: 'Resolved',
    date: '10 May 2024',
  },
  {
    id: 'CMP-1022',
    title: 'Garbage Collection Issue',
    status: 'Pending Verification',
    date: '08 May 2024',
  },
  {
    id: 'CMP-1021',
    title: 'Drainage Blockage',
    status: 'In Progress',
    date: '05 May 2024',
  },
];

export function MyComplaints() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = useMemo(() => {
    return MOCK_COMPLAINTS.filter((complaint) => {
      const matchesSearch = 
        complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' || 
        (activeTab === 'Pending' && complaint.status === 'Pending Verification') ||
        (activeTab === 'In Progress' && complaint.status === 'In Progress') ||
        (activeTab === 'Resolved' && complaint.status === 'Resolved');

      return matchesSearch && matchesTab;
    });
  }, [activeTab, searchQuery]);

  return (
    <View className="flex-1">
      <View className="pt-4 pb-2 bg-background z-10">
        <View className="px-6">
          <Input
            placeholder="Search by ID or Title..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<MagnifyingGlassIcon size={20} color={colors.muted} />}
            className="mb-4"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8, gap: 8 }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
                className={`px-4 py-2 rounded-full ${
                  isActive 
                    ? 'bg-primary' 
                    : 'bg-slate-100'
                }`}
              >
                <Text 
                  className={`text-sm font-inter-semibold ${
                    isActive ? 'text-white' : 'text-dark'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              variant="recent"
              ticketId={complaint.id}
              title={complaint.title}
              date={complaint.date}
              status={complaint.status}
              onPress={() => router.push({ pathname: '/complaint/view/[id]', params: { id: complaint.id } })}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-lg font-inter-medium text-muted mb-2">No complaints found</Text>
            <Text className="text-sm font-inter text-muted text-center">
              Try adjusting your filters or search query.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
