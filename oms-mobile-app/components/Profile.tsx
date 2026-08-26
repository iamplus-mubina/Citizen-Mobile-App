import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ChevronRightIcon, UserIcon, CameraIcon, PencilIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, MapIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { UploadModal } from '@/components/UploadModal';
import { useComplaintStore } from '@/store/useComplaintStore';

interface MenuItemProps {
  title: string;
  value?: string;
  onPress: () => void;
  isLast?: boolean;
}

function MenuItem({ title, value, onPress, isLast = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`flex-row justify-between items-center py-4 ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <Text className="text-base font-inter-medium text-dark">{title}</Text>
      <View className="flex-row items-center">
        {value && (
          <Text className="text-sm font-inter text-muted mr-2">{value}</Text>
        )}
        <ChevronRightIcon size={16} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

export function Profile() {
  const router = useRouter();
  const { profilePhoto, setProfilePhoto, phoneNumber, profileName, profileEmail, profileAddress, profilePincode } = useComplaintStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View className="flex-1 w-full bg-background pt-8 px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View className="items-center mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            className="relative"
          >
            <View className="w-24 h-24 rounded-full bg-border/50 items-center justify-center overflow-hidden border border-border">
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <UserIcon size={40} color={colors.muted} />
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-background">
              <CameraIcon size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-dark mt-4 mb-1">
            {profileName}
          </Text>
          <Text className="text-base font-inter text-muted">
            {phoneNumber}
          </Text>
        </View>

        <View className="mb-8 px-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-inter-bold text-dark">Personal Details</Text>
            <TouchableOpacity 
              onPress={() => router.push('/profile/edit')} 
              activeOpacity={0.7}
              className="p-1.5 rounded-full bg-primary/10"
            >
              <PencilIcon size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <DetailRow icon={UserIcon} label="Full Name" value={profileName} />
          <DetailRow icon={PhoneIcon} label="Phone Number" value={phoneNumber} />
          <DetailRow icon={EnvelopeIcon} label="Email Address" value={profileEmail} />
          <DetailRow icon={MapPinIcon} label="Address" value={profileAddress} />
          <DetailRow icon={MapIcon} label="Pincode" value={profilePincode} isLast />
        </View>

        <View className="pb-8">
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            variant="primary"
          />
        </View>

      </ScrollView>

      <UploadModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={(uri) => setProfilePhoto(uri)}
      />
    </View>
  );
}

function DetailRow({ 
  icon: IconComponent, 
  label, 
  value, 
  isLast = false 
}: { 
  icon: React.ComponentType<any>; 
  label: string; 
  value: string; 
  isLast?: boolean 
}) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-9 h-9 rounded-xl bg-icon-muted/10 items-center justify-center mr-3">
        <IconComponent size={18} color={colors.iconMuted} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-inter-semibold text-muted mb-0.5">{label}</Text>
        <Text className="text-sm font-inter-medium text-dark">{value || '-'}</Text>
      </View>
    </View>
  );
}
