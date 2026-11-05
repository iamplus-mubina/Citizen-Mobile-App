import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { colors } from '@/constants/Colors';
import { useComplaintStore, SubmittedComplaint } from '@/store/useComplaintStore';
import { Tabs } from '@/components/Tabs';
import { citizenService } from '@/services/citizenService';
import { useTranslation } from '@/store/useLanguageStore';

type FilterTab = 'All' | 'Pending Approval' | 'Unsolved' | 'In-Progress' | 'Solved' | 'Rejected';

const TABS: FilterTab[] = ['All', 'Pending Approval', 'Unsolved', 'In-Progress', 'Solved', 'Rejected'];

export function MyComplaints() {
  const router = useRouter();
  const { t } = useTranslation();
  const { submittedComplaints, setComplaints } = useComplaintStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getTabLabel = (tab: FilterTab): string => {
    switch (tab) {
      case 'All': return t('complaints.all');
      case 'Pending Approval': return t('complaints.pendingApproval');
      case 'Unsolved': return t('complaints.unsolved');
      case 'In-Progress': return t('complaints.inProgress');
      case 'Solved': return t('complaints.solved');
      case 'Rejected': return t('complaints.rejected');
      default: return tab;
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await citizenService.getMyComplaints({
        page: { number: 0, size: 50 },
        status: ''
      });
      const list = res.data || [];
      const total = res.total ?? list.length;
      setComplaints(list, total);
    } catch (err) {
      console.warn('Failed to refresh complaints:', err);
    } finally {
      setRefreshing(false);
    }
  }, [setComplaints]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints();
  }, [fetchComplaints]);

  const matchesTabStatus = (complaint: SubmittedComplaint, tab: FilterTab) => {
    if (tab === 'All') return true;
    const req = (complaint.requestStatus || '').toUpperCase();
    const live = (complaint.liveStatus || '').toUpperCase();

    if (tab === 'Pending Approval') {
      return req === 'PENDING';
    }
    if (tab === 'Rejected') {
      return req === 'REJECTED' || live.includes('REJECT');
    }
    if (tab === 'Unsolved') {
      return live.includes('UNSOLVED') || (req === 'APPROVED' && (live === '' || live.includes('UNSOLVED')));
    }
    if (tab === 'In-Progress') {
      return live.includes('PROGRESS') || live.includes('ASSIGN');
    }
    if (tab === 'Solved') {
      return (live.includes('SOLVED') && !live.includes('UNSOLVED')) || live.includes('RESOLVED');
    }
    return true;
  };

  const counts = useMemo(() => {
    return {
      All: submittedComplaints.length,
      'Pending Approval': submittedComplaints.filter(c => matchesTabStatus(c, 'Pending Approval')).length,
      Unsolved: submittedComplaints.filter(c => matchesTabStatus(c, 'Unsolved')).length,
      'In-Progress': submittedComplaints.filter(c => matchesTabStatus(c, 'In-Progress')).length,
      Solved: submittedComplaints.filter(c => matchesTabStatus(c, 'Solved')).length,
      Rejected: submittedComplaints.filter(c => matchesTabStatus(c, 'Rejected')).length,
    };
  }, [submittedComplaints]);

  const filteredComplaints = useMemo(() => {
    return submittedComplaints.filter((complaint) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query ||
        (complaint.ticketId ? complaint.ticketId.toLowerCase().includes(query) : false) ||
        (complaint.type || '').toLowerCase().includes(query) ||
        (complaint.category || '').toLowerCase().includes(query) ||
        (complaint.description || '').toLowerCase().includes(query);
      
      const matchesTab = matchesTabStatus(complaint, activeTab);

      return matchesSearch && matchesTab;
    });
  }, [submittedComplaints, activeTab, searchQuery]);

  return (
    <View className="flex-1">
      <View className="pt-4 pb-2 bg-background z-10">
        <View className="px-6">
          <Input
            placeholder={t('complaints.searchPlaceholder')}
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
          renderLabel={getTabLabel}
        />
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <Card
              key={complaint.tokenNumber || complaint.requestId || complaint.id}
              variant="recent"
              ticketId={complaint.ticketId}
              title={complaint.type || complaint.category || 'Complaint'}
              description={complaint.description || (complaint.category ? `${complaint.category}` : undefined)}
              date={complaint.date}
              requestStatus={complaint.requestStatus}
              liveStatus={complaint.liveStatus}
              rejectionReason={complaint.rejectionReason}
              onPress={() => router.push(`/complaint/timeline/${complaint.tokenNumber || complaint.requestId || complaint.id}` as any)}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-lg font-inter-medium text-muted mb-2">
              {t('complaints.noComplaintsFound')}
            </Text>
            <Text className="text-sm font-inter text-muted text-center">
              {t('complaints.noComplaintsMatch')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
