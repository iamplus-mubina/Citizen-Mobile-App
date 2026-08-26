import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';
import { Tabs } from '@/components/Tabs';

type FilterTab = 'All' | 'Unsolved' | 'In-Progress' | 'Solved';

const TABS: FilterTab[] = ['All', 'Unsolved', 'In-Progress', 'Solved'];

const MOCK_COMPLAINTS = [
  {
    ticketId: 'CMP-1025',
    title: 'Pipeline Leakage',
    status: 'Pending Verification',
    date: '12 May 2024',
  },
  {
    ticketId: 'CMP-1024',
    title: 'Road Repair',
    status: 'In Progress',
    date: '12 May 2024',
  },
  {
    ticketId: 'CMP-1023',
    title: 'Street Light Not Working',
    status: 'Resolved',
    date: '10 May 2024',
  },
  {
    ticketId: 'CMP-1022',
    title: 'Garbage Collection Issue',
    status: 'Pending Verification',
    date: '08 May 2024',
  },
  {
    ticketId: 'CMP-1021',
    title: 'Drainage Blockage',
    status: 'In Progress',
    date: '05 May 2024',
  },
];

export function MyComplaints() {
  const router = useRouter();
  const { submittedComplaints } = useComplaintStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allComplaints = useMemo(() => {
    const submittedIds = new Set(submittedComplaints.map((c) => c.ticketId));
    const uniqueMocks = MOCK_COMPLAINTS.filter((c) => !submittedIds.has(c.ticketId));
    return [...submittedComplaints, ...uniqueMocks];
  }, [submittedComplaints]);

  const counts = useMemo(() => {
    return {
      All: allComplaints.length,
      Unsolved: allComplaints.filter(
        (c) => c.status === 'Pending Verification' || c.status === 'Pending'
      ).length,
      'In-Progress': allComplaints.filter((c) => c.status === 'In Progress').length,
      Solved: allComplaints.filter((c) => c.status === 'Resolved').length,
    };
  }, [allComplaints]);

  const filteredComplaints = useMemo(() => {
    return allComplaints.filter((complaint) => {
      const matchesSearch = 
        complaint.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = 
        activeTab === 'All' || 
        (activeTab === 'Unsolved' && 
          (complaint.status === 'Pending Verification' || complaint.status === 'Pending')) ||
        (activeTab === 'In-Progress' && complaint.status === 'In Progress') ||
        (activeTab === 'Solved' && complaint.status === 'Resolved');

      return matchesSearch && matchesTab;
    });
  }, [allComplaints, activeTab, searchQuery]);

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

        <Tabs 
          tabs={TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          counts={counts}
        />
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <Card
              key={complaint.ticketId}
              variant="recent"
              ticketId={complaint.ticketId}
              title={complaint.title}
              date={complaint.date}
              status={complaint.status}
              onPress={() => router.push({ pathname: '/complaint/view/[id]', params: { id: complaint.ticketId } })}
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
