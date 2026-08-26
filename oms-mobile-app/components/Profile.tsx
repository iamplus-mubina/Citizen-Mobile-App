import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRightIcon, UserIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';

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
      <Text className="text-base font-inter-medium text-text">{title}</Text>
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

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View className="flex-1 w-full bg-background pt-8 px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-slate-200 items-center justify-center mb-4">
            <UserIcon size={40} color={colors.muted} />
          </View>
          <Text className="text-xl font-inter-bold text-text mb-1">
            Rahul Sharma
          </Text>
          <Text className="text-base font-inter text-muted">
            98XXXXXXX
          </Text>
        </View>

        <View className="mb-8">
          <MenuItem 
            title="Personal Information" 
            onPress={() => router.push('/profile/edit')} 
          />
          <MenuItem 
            title="Address" 
            onPress={() => console.log('Address')} 
          />
          <MenuItem 
            title="Change Password" 
            onPress={() => console.log('Change Password')} 
          />
          <MenuItem 
            title="Language" 
            value="English"
            onPress={() => console.log('Language')} 
          />
          <MenuItem 
            title="About App" 
            onPress={() => console.log('About App')} 
            isLast
          />
        </View>

        <View className="pb-8">
          <Button 
            title="Logout" 
            onPress={handleLogout} 
            variant="secondary"
          />
        </View>

      </ScrollView>
    </View>
  );
}
