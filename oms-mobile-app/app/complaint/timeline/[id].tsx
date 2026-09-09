import React, { useEffect, useState } from 'react';
import { View, ScrollView, Platform, Text, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Stepper, StepperStep } from '@/components/Stepper';
import { MapPinIcon, BuildingOfficeIcon, IdentificationIcon, CheckIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useComplaintStore } from '@/store/useComplaintStore';
import { colors } from '@/constants/Colors';
import { citizenService } from '@/services/citizenService';

// Strict helper checks to prevent 'UNSOLVED' from matching 'SOLVED'
const isSolvedStatus = (status?: string) => {
  const s = (status || '').toUpperCase().trim();
  return (s.includes('SOLVED') && !s.includes('UNSOLVED')) || s.includes('RESOLVED') || s.includes('COMPLETE');
};

const isInProgressStatus = (status?: string) => {
  const s = (status || '').toUpperCase().trim();
  return s.includes('PROGRESS') || s.includes('ASSIGN') || s.includes('WORKING');
};

const isUnsolvedStatus = (status?: string) => {
  const s = (status || '').toUpperCase().trim();
  return s.includes('UNSOLVED') || s === 'PENDING APPROVAL';
};

const getRequestStatusStyles = (status?: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'APPROVED') {
    return { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Req: Approved' };
  }
  if (s === 'REJECTED') {
    return { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', label: 'Req: Rejected' };
  }
  return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Req: Pending Approval' };
};

const getLiveStatusStyles = (status?: string) => {
  const s = (status || '').toUpperCase().replace(/[-_ ]/g, '');
  if (s.includes('UNSOLVED')) {
    return { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700', label: 'Unsolved' };
  }
  if (isInProgressStatus(s)) {
    return { bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-700', label: 'In Progress' };
  }
  if (isSolvedStatus(s)) {
    return { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Solved' };
  }
  if (s.includes('HOLD')) {
    return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800', label: 'On Hold' };
  }
  if (s.includes('REJECT')) {
    return { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-700', label: 'Rejected' };
  }
  return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', label: 'Pending Approval' };
};

const getComplaintHistory = (reqStatus?: string, liveStatus?: string): StepperStep[] => {
  const req = (reqStatus || '').toUpperCase().trim();
  const live = (liveStatus || '').toUpperCase().trim();

  // 1. Rejected by Super Admin
  if (req === 'REJECTED' || live.includes('REJECT')) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Super Admin Rejected', status: 'completed', theme: 'primary' },
    ];
  }

  // 2. Pending Super Admin Approval
  if (req === 'PENDING') {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Pending Admin Approval', status: 'current', theme: 'primary' },
      { id: 'step-3', title: 'In Progress', status: 'future' },
      { id: 'step-4', title: 'Resolved', status: 'future' },
    ];
  }

  // 3. Approved by Super Admin:
  // 3a. Truly Solved
  if (isSolvedStatus(live)) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Admin Approved', status: 'completed', theme: 'primary' },
      { id: 'step-3', title: 'In Progress', status: 'completed', theme: 'primary' },
      { id: 'step-4', title: 'Resolved', status: 'completed', theme: 'primary' },
    ];
  }

  // 3b. Work In Progress / Worker Assigned
  if (isInProgressStatus(live)) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Admin Approved', status: 'completed', theme: 'primary' },
      { id: 'step-3', title: 'In Progress', status: 'current', theme: 'primary' },
      { id: 'step-4', title: 'Resolved', status: 'future' },
    ];
  }

  // 3c. On Hold
  if (live.includes('HOLD')) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Admin Approved', status: 'completed', theme: 'primary' },
      { id: 'step-3', title: 'On Hold', status: 'current', theme: 'primary' },
      { id: 'step-4', title: 'Resolved', status: 'future' },
    ];
  }

  // 3d. Approved & Unsolved (Awaiting field team assignment)
  return [
    { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
    { id: 'step-2', title: 'Admin Approved', status: 'completed', theme: 'primary' },
    { id: 'step-3', title: 'In Progress', status: 'future' },
    { id: 'step-4', title: 'Resolved', status: 'future' },
  ];
};

export default function ComplaintTimelineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const ticketId = Array.isArray(id) ? id[0] : (id || 'REQ-1');
  const submittedComplaints = useComplaintStore((state) => state.submittedComplaints);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({ pathname: '/home', params: { tab: 'complaints' } });
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const foundComplaint = submittedComplaints.find(
    c => c.ticketId === ticketId ||
      c.ticketId === `REQ-${ticketId}` ||
      (ticketId.replace(/\D/g, '') !== '' && c.ticketId.replace(/\D/g, '') === ticketId.replace(/\D/g, ''))
  );

  const initialComplaint = foundComplaint || {
    ticketId: ticketId.startsWith('REQ-') || ticketId.startsWith('CMP-') ? ticketId : `REQ-${ticketId}`,
    title: 'Complaint Details',
    category: 'General',
    type: 'Complaint',
    date: 'Recently',
    requestStatus: 'PENDING' as const,
    liveStatus: 'PENDING APPROVAL',
    rejectionReason: null,
    address: '',
    description: 'Complaint description...',
    comments: [],
    karyaKarta: null,
  };

  const [complaint, setComplaint] = useState<any>(initialComplaint);

  useEffect(() => {
    let isMounted = true;

    const loadComplaint = async () => {
      let current = foundComplaint;

      // If not present in store (e.g. direct link or refresh), load from my-complaints
      if (!current) {
        try {
          const res = await citizenService.getMyComplaints(0, 50, '');
          const list = Array.isArray(res) ? (Array.isArray(res[0]) ? res[0] : res) : (res?.data || []);
          current = list.find(
            (c: any) =>
              String(c.tokenNumber) === String(ticketId) ||
              String(c.id) === String(ticketId) ||
              String(c.requestId) === String(ticketId) ||
              String(c.complainId) === String(ticketId)
          );
        } catch (e) {
          console.log('Error locating complaint from list:', e);
        }
      }

      if (!isMounted) return;

      if (current) {
        setComplaint((prev: any) => ({ ...prev, ...current }));

        // ONLY fetch ComplainBox live details if request is APPROVED and has a valid live complainId
        if (current.requestStatus === 'APPROVED' && current.complainId) {
          try {
            const data = await citizenService.getComplaintDetails(current.complainId);
            if (data && isMounted) {
              setComplaint((prev: any) => ({
                ...prev,
                title: data.type?.name || data.category?.name || prev.title,
                description: data.description || prev.description,
                category: data.category?.name || prev.category,
                type: data.type?.name || prev.type,
                liveStatus: data.status || prev.liveStatus,
                address: data.address?.line1 || (typeof data.address === 'string' ? data.address : prev.address),
                karyaKarta: data.karyaKarta || prev.karyaKarta,
                comments: Array.isArray(data.comments) ? data.comments : prev.comments || [],
              }));
            }
          } catch (err) {
            console.log('Background fetch for live complaint details:', err);
          }
        }
      }
    };

    loadComplaint();

    return () => {
      isMounted = false;
    };
  }, [ticketId, foundComplaint]);

  const reqStyle = getRequestStatusStyles(complaint.requestStatus);
  const liveStyle = getLiveStatusStyles(complaint.liveStatus);
  const historySteps = getComplaintHistory(complaint.requestStatus, complaint.liveStatus);
  const isApproved = complaint.requestStatus === 'APPROVED';

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>

        <Header showBack onBack={handleBack} />

        <View className="px-6 pb-4 pt-2 border-b border-border mb-4">
          <Text className="text-2xl font-inter-bold text-dark mb-4">Complaint details</Text>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-inter-bold text-header-bg">{complaint.ticketId}</Text>
            <View className="flex-row items-center gap-1.5 flex-wrap justify-end">
              <View className={`px-2.5 py-1 rounded-md border ${liveStyle.bg} ${liveStyle.border}`}>
                <Text className={`text-[10px] font-inter-bold ${liveStyle.text}`}>{liveStyle.label}</Text>
              </View>
            </View>
          </View>

          <Text className="text-xl font-inter-bold text-dark mb-1">{complaint.type || complaint.category || complaint.title}</Text>
          <Text className="text-xs font-inter text-muted">
            {complaint.category ? `${complaint.category} • ` : ''}Submitted {complaint.date ? complaint.date.split(',')[0] : 'Recently'}
          </Text>

          {complaint.rejectionReason && (
            <View className="mt-3 bg-rose-50 border border-rose-200 rounded-lg p-3">
              <Text className="text-xs font-inter-bold text-rose-800 mb-0.5">Admin Rejection Reason:</Text>
              <Text className="text-xs font-inter text-rose-700">{complaint.rejectionReason}</Text>
            </View>
          )}
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

          <View className="bg-surface border border-border rounded-xl p-5 mb-4">
            <Text className="text-base font-inter-bold text-dark mb-4">Complaint Progress</Text>
            <Stepper steps={historySteps} />
          </View>

          <View className="bg-surface border border-border rounded-xl p-5 mb-4">
            <Text className="text-base font-inter-bold text-dark mb-3">Complaint Information</Text>
            <Text className="text-sm font-inter text-dark mb-4 border-b border-border pb-4">{complaint.description}</Text>

            {complaint.address ? (
              <View className="flex-row mb-4">
                <MapPinIcon size={20} color={colors.primary} className="mt-0.5" />
                <View className="flex-1 ml-3">
                  <Text className="text-xs font-inter text-muted mb-1">Location</Text>
                  <Text className="text-sm font-inter-medium text-dark">{complaint.address}</Text>
                </View>
              </View>
            ) : null}

            <View className="flex-row mb-4">
              <BuildingOfficeIcon size={20} color={colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Category & Department</Text>
                <Text className="text-sm font-inter-medium text-dark">
                  {complaint.category || 'General'} {complaint.type ? `(${complaint.type})` : ''}
                </Text>
              </View>
            </View>

            <View className="flex-row mb-4">
              <IdentificationIcon size={20} color={colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Super Admin Approval</Text>
                <Text className="text-sm font-inter-medium text-dark">
                  {complaint.requestStatus === 'REJECTED'
                    ? 'Request Rejected'
                    : isApproved 
                      ? 'Approved by Super Admin' 
                      : 'Awaiting Super Admin Approval'}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <IdentificationIcon size={20} color={colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Field Assignment</Text>
                <Text className="text-sm font-inter-medium text-dark">
                  {complaint.karyaKarta 
                    ? `Assigned to ${complaint.karyaKarta.fullName || complaint.karyaKarta.name || complaint.karyaKarta.firstName || 'Field Worker'}`
                    : isApproved
                      ? 'Awaiting Field Worker Assignment'
                      : 'Pending Approval'}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-surface border border-border rounded-xl p-5 mb-8">
            <Text className="text-base font-inter-bold text-dark mb-4">Activity Timeline</Text>

            <View>
              {(() => {
                const req = (complaint.requestStatus || '').toUpperCase().trim();
                const live = (complaint.liveStatus || '').toUpperCase().trim();
                const events: { id: string; date: string; role: string; text: string; isReject?: boolean }[] = [];

                // 1. Only if truly Solved / Resolved
                if (isSolvedStatus(live)) {
                  events.push({
                    id: 'ev-resolved',
                    date: complaint.updatedDate || 'Recently',
                    role: 'Field Worker',
                    text: 'Civic issue has been resolved and closed.'
                  });
                }

                // 2. Only if In Progress or truly Solved
                if (isInProgressStatus(live)) {
                  events.push({
                    id: 'ev-inprogress',
                    date: complaint.updatedDate || 'Recently',
                    role: 'Operations',
                    text: 'Field team assigned and work is in progress.'
                  });
                }

                // 3. If On Hold
                if (live.includes('HOLD')) {
                  events.push({
                    id: 'ev-hold',
                    date: complaint.updatedDate || 'Recently',
                    role: 'Operations',
                    text: 'Complaint resolution is temporarily on hold.'
                  });
                }

                // Real comments from backend if available
                if (Array.isArray(complaint.comments) && complaint.comments.length > 0) {
                  complaint.comments.forEach((c: any) => {
                    events.push({
                      id: `comment-${c.id}`,
                      date: c.createdDate ? new Date(c.createdDate).toLocaleDateString('en-IN') : 'Recently',
                      role: c.createdBy ? `${c.createdBy.firstName || ''} ${c.createdBy.lastName || ''}`.trim() || 'Staff' : 'Official',
                      text: c.comment,
                    });
                  });
                }

                // 4. Super Admin Approval or Rejection
                if (req === 'APPROVED') {
                  events.push({
                    id: 'ev-approved',
                    date: complaint.updatedDate || complaint.date || 'Recently',
                    role: 'Super Admin',
                    text: 'Complaint request approved and scheduled for resolution.'
                  });
                } else if (req === 'REJECTED') {
                  events.push({
                    id: 'ev-rejected',
                    date: complaint.updatedDate || complaint.date || 'Recently',
                    role: 'Super Admin',
                    text: `Complaint request rejected.${complaint.rejectionReason ? ` Reason: ${complaint.rejectionReason}` : ''}`,
                    isReject: true
                  });
                }

                // 5. Initial Submission
                events.push({
                  id: 'ev-submitted',
                  date: complaint.date || 'Recently',
                  role: 'Citizen',
                  text: 'Complaint submitted via Citizen App.'
                });

                return events.map((event, index, arr) => (
                  <View key={event.id} className="flex-row mb-3 relative">
                    <View className="mr-3 w-6 items-center relative z-10">
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center z-20">
                        {event.isReject ? (
                          <XMarkIcon size={14} color="white" strokeWidth={3} />
                        ) : (
                          <CheckIcon size={14} color="white" strokeWidth={3} />
                        )}
                      </View>

                      {index !== arr.length - 1 && (
                        <View className="absolute top-6 -bottom-3 w-[2px] bg-primary z-10 left-[11px]" />
                      )}
                    </View>

                    <View className="flex-1 border border-border rounded-lg p-3 bg-background">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xs font-inter text-muted">{event.date}</Text>
                        <View className="bg-gray-200/50 px-2 py-1 rounded">
                          <Text className="text-[10px] font-inter-medium text-gray-600">{event.role}</Text>
                        </View>
                      </View>
                      <Text className="text-sm font-inter-medium text-dark leading-snug">
                        {event.text}
                      </Text>
                    </View>
                  </View>
                ));
              })()}
            </View>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
