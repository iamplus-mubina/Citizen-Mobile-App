import React, { useEffect, useState } from 'react';
import { View, ScrollView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Header } from '@/components/Header';
import { Stepper, StepperStep } from '@/components/Stepper';
import { MapPinIcon, BuildingOfficeIcon, IdentificationIcon, CheckIcon } from 'react-native-heroicons/outline';
import { useComplaintStore } from '@/store/useComplaintStore';
import { colors } from '@/constants/Colors';
import { api } from '@/services/api';

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('pending')) {
    return { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700' };
  }
  if (s.includes('progress') || s.includes('assigned')) {
    return { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-700' };
  }
  if (s.includes('resolved') || s.includes('completed') || s.includes('solved')) {
    return { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' };
  }
  if (s.includes('reject') || s.includes('closed') || s.includes('fail')) {
    return { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700' };
  }
  return { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-700' };
};

const getComplaintHistory = (status: string): StepperStep[] => {
  const s = status.toLowerCase();

  if (s.includes('resolved') || s.includes('complete') || s.includes('solved')) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Verified', status: 'completed', theme: 'primary' },
      { id: 'step-3', title: 'Assigned', status: 'completed', theme: 'primary' },
      { id: 'step-4', title: 'Work', status: 'completed', theme: 'primary' },
      { id: 'step-5', title: 'Resolved', status: 'completed', theme: 'primary' },
      { id: 'step-6', title: 'Complete', status: 'current', theme: 'primary' }
    ];
  }

  if (s.includes('progress') || s.includes('work')) {
    return [
      { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
      { id: 'step-2', title: 'Verified', status: 'completed', theme: 'primary' },
      { id: 'step-3', title: 'Assigned', status: 'completed', theme: 'primary' },
      { id: 'step-4', title: 'Work', status: 'current', theme: 'primary' },
      { id: 'step-5', title: 'Resolved', status: 'future' },
      { id: 'step-6', title: 'Complete', status: 'future' }
    ];
  }

  // Default / Pending
  return [
    { id: 'step-1', title: 'Submitted', status: 'completed', theme: 'primary' },
    { id: 'step-2', title: 'Verified', status: 'completed', theme: 'primary' },
    { id: 'step-3', title: 'Assigned', status: 'current', theme: 'primary' },
    { id: 'step-4', title: 'Work', status: 'future' },
    { id: 'step-5', title: 'Resolved', status: 'future' },
    { id: 'step-6', title: 'Complete', status: 'future' }
  ];
};

export default function TimelineScreen() {
  const { id } = useLocalSearchParams();
  const ticketId = (id as string) || 'REQ-1';

  const submittedComplaints = useComplaintStore(state => state.submittedComplaints);
  
  const foundComplaint = submittedComplaints.find(
    c => c.ticketId === ticketId || 
         c.ticketId === `REQ-${ticketId}` || 
         (ticketId.replace(/\D/g, '') !== '' && c.ticketId.replace(/\D/g, '') === ticketId.replace(/\D/g, ''))
  );

  const initialComplaint = foundComplaint || {
    ticketId: ticketId.startsWith('REQ-') || ticketId.startsWith('CMP-') ? ticketId : `REQ-${ticketId}`,
    title: 'Complaint Details',
    category: 'General',
    date: '3 Sep 2026',
    status: 'Pending Approval',
    area: '',
    ward: '',
    description: 'Complaint description...'
  };

  const [complaint, setComplaint] = useState<any>(initialComplaint);

  useEffect(() => {
    // If complaint is already in store or is a local CMP- ID, use store data and bypass backend call
    if (foundComplaint || ticketId.startsWith('CMP-')) {
      if (foundComplaint) setComplaint(foundComplaint);
      return;
    }

    const numericId = parseInt(ticketId.replace(/\D/g, ''), 10);
    if (!isNaN(numericId) && numericId > 0) {
      const fetchDetails = async () => {
        try {
          const res = await api.get(`/complainbox/mobile/${numericId}`);
          if (res.data) {
            setComplaint((prev: any) => ({
              ...prev,
              title: res.data.description?.substring(0, 50) || prev.title,
              description: res.data.description || prev.description,
              status: res.data.status || prev.status,
              category: res.data.category?.name || prev.category,
            }));
          }
        } catch (err) {
          console.log('Background fetch for complaint details (optional endpoint):', err);
        }
      };
      fetchDetails();
    }
  }, [ticketId, foundComplaint]);

  const historySteps = getComplaintHistory(complaint.status);
  const statusStyle = getStatusStyles(complaint.status);
  const isAssigned = !complaint.status.toLowerCase().includes('pending');

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className={containerClass}>

        <Header showBack />

        <View className="px-6 pb-4 pt-2 border-b border-border mb-4">
          <Text className="text-2xl font-inter-bold text-dark mb-6">Complaint details</Text>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-inter-bold text-header-bg">{complaint.ticketId}</Text>
            <View className={`px-3 py-1.5 rounded-md border ${statusStyle.bg} ${statusStyle.border}`}>
              <Text className={`text-[11px] font-inter-semibold capitalize ${statusStyle.text}`}>{complaint.status}</Text>
            </View>
          </View>

          <Text className="text-xl font-inter-bold text-dark mb-1">{complaint.title}</Text>
          <Text className="text-xs font-inter text-muted">{complaint.category} • Submitted {complaint.date.split(',')[0]}</Text>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>


          <View className="bg-surface border border-border rounded-xl p-5 mb-4">
            <Text className="text-base font-inter-bold text-dark mb-4">Current position</Text>
            <Stepper steps={historySteps} />
          </View>


          <View className="bg-surface border border-border rounded-xl p-5 mb-4">
            <Text className="text-base font-inter-bold text-dark mb-3">Complaint</Text>
            <Text className="text-sm font-inter text-dark mb-4 border-b border-border pb-4">{complaint.description}</Text>

            <View className="flex-row mb-4">
              <MapPinIcon size={20} color={colors.primary} className="mt-0.5" />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Location</Text>
                <Text className="text-sm font-inter-medium text-dark">{complaint.title}</Text>
                <Text className="text-sm font-inter text-dark">{complaint.area} • {complaint.ward}</Text>
              </View>
            </View>

            <View className="flex-row mb-4">
              <BuildingOfficeIcon size={20} color={colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Department</Text>
                <Text className="text-sm font-inter-medium text-dark">{isAssigned ? `${complaint.category} Dept.` : 'Not assigned yet'}</Text>
              </View>
            </View>

            <View className="flex-row">
              <IdentificationIcon size={20} color={colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-xs font-inter text-muted mb-1">Responsible role</Text>
                <Text className="text-sm font-inter-medium text-dark">{isAssigned ? 'Field Worker' : 'Not assigned yet'}</Text>
              </View>
            </View>
          </View>


          <View className="bg-surface border border-border rounded-xl p-5 mb-8">
            <Text className="text-base font-inter-bold text-dark mb-4">Timeline</Text>

            <View>
              {(() => {
                const s = complaint.status.toLowerCase();
                const events = [];

                if (s.includes('resolved') || s.includes('complete') || s.includes('solved')) {
                  events.push({
                    id: 3,
                    date: 'Updated recently',
                    role: 'Field Worker',
                    text: 'Issue has been resolved and verified.'
                  });
                }

                if (s.includes('progress') || s.includes('work') || s.includes('resolved') || s.includes('complete') || s.includes('solved')) {
                  events.push({
                    id: 2,
                    date: 'Updated recently',
                    role: 'Operations Admin',
                    text: 'Complaint moved to In progress.'
                  });
                }

                events.push({
                  id: 1,
                  date: complaint.date,
                  role: 'Citizen',
                  text: 'Complaint submitted and waiting for verification.'
                });

                return events.map((event, index, arr) => (
                  <View key={event.id} className="flex-row mb-3 relative">
                    {/* Left Column: Icon and Line */}
                    <View className="mr-3 w-6 items-center relative z-10">
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center z-20">
                        <CheckIcon size={14} color="white" strokeWidth={3} />
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
