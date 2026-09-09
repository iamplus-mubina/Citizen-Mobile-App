import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { FormStepper } from '@/components/FormStepper';
import { Input } from '@/components/Input';
import { colors } from '@/constants/Colors';
import { useComplaintStore } from '@/store/useComplaintStore';

export default function DetailsScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const setComplaintForm = useComplaintStore((s) => s.setComplaintForm);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/complaint/category');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

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

    setComplaintForm({ description });
    router.push('/complaint/location');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={containerClass}>
        <Header 
          showBack 
          title="Raise a complaint" 
          onBack={() => router.replace('/home')}
        />

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
        </ScrollView>

        {/* Bottom action bar — Back + Next */}
        <View className="px-6 py-4 border-t border-border bg-background flex-row gap-x-3">
          <View className="flex-[0.8]">
            <Button
              title="Back"
              variant="outline"
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/complaint/category');
                }
              }}
            />
          </View>
          <View className="flex-[1.2]">
            <Button title="Next" onPress={handleNext} />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
