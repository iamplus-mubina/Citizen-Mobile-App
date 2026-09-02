import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerClass = Platform.OS === 'web'
    ? "flex-1 w-full max-w-md mx-auto bg-background"
    : "flex-1 bg-background";

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Please provide more details (min 10 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setDetails(title, description, priority);
    router.push('/complaint/location');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header showBack title="Raise a complaint" />

        <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
          
          <View className="mb-4">
            <View className="mt-2" />
            <FormStepper currentStep={2} totalSteps={5} />
          </View>

          
          <View className="mb-6">
            <Input 
              label="Complaint Title *"
              placeholder="Enter short title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (text.trim().length >= 5) setErrors(prev => ({ ...prev, title: '' }));
              }}
              error={errors.title}
            />

            <Input 
              label="Description *"
              placeholder="Describe your complaint in detail..."
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (text.trim().length >= 10) setErrors(prev => ({ ...prev, description: '' }));
              }}
              multiline={true}
              numberOfLines={4}
              error={errors.description}
            />
          </View>

          
          <View className="mb-8">
            <Text className="text-dark font-inter-semibold mb-2">Priority <Text className="text-error">*</Text></Text>
            <View className="space-y-3">
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
                    <Text className={`text-base font-inter ${isSelected ? 'text-dark font-inter-semibold' : 'text-dark'}`}>
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
            onPress={handleNext}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}
