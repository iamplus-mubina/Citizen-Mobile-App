import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

const PRIORITIES = ['Low', 'Medium', 'High'];

export default function DetailsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const setDetails = useComplaintStore((s) => s.setDetails);

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        
        
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
            activeOpacity={0.7}
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          
          <View className="mb-8">
            <View className="items-center mb-2">
              <Text className="text-lg font-inter-bold text-text">Register Complaint</Text>
            </View>
            <View className="items-end mb-2">
              <Text className="text-sm font-inter-semibold text-text">2 of 4</Text>
            </View>
          </View>

          
          <View className="mb-6">
            <Input 
              label="Complaint Title"
              placeholder="Enter short title"
              value={title}
              onChangeText={setTitle}
            />

            <Input 
              label="Description"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          
          <View className="mb-8">
            <Text className="text-text font-inter-semibold mb-4">Priority</Text>
            <View className="space-y-4">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    activeOpacity={0.7}
                    onPress={() => setPriority(p)}
                    className="flex-row items-center py-2"
                  >
                    <View 
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 
                        ${isSelected ? 'border-primary' : 'border-muted'}`}
                    >
                      {isSelected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </View>
                    <Text className={`text-base font-inter ${isSelected ? 'text-text font-inter-semibold' : 'text-text'}`}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>

        
        <View className="px-6 py-4 pb-8 border-t border-border bg-background">
          <Button 
            title="Next" 
            onPress={() => {
              setDetails(title, description, priority);
              router.push('/complaint/location');
            }}
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50' : ''}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
