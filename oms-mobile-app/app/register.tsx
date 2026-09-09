import { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { Dropdown } from '@/components/Dropdown';
import { AlertModal } from '@/components/AlertModal';
import { citizenService } from '@/services/citizenService';

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' as 'error' | 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/login');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router]);

  const handleMobileChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMobile(numericText);
    if (numericText.length === 10) setErrors(prev => ({ ...prev, mobile: '' }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (mobile.length !== 10) newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    if (!gender) newErrors.gender = 'Please select your gender';
    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = 'Please enter your complete address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        firstName,
        middleName,
        lastName,
        phone: mobile,
        email,
        gender,
        address,
      };
      
      await citizenService.onboard(payload);
      
      setAlertConfig({ 
        title: 'Registration Successful', 
        message: 'Your request has been submitted. Please wait for admin approval.', 
        type: 'success' 
      });
      setAlertVisible(true);
      
      // Navigate to pending approval after a short delay
      setTimeout(() => {
        router.push('/pending-approval');
      }, 1500);
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
      setAlertConfig({ title: 'Registration Failed', message: errorMessage, type: 'error' });
      setAlertVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => (
    <View className="flex-1 px-6 w-full max-w-md mx-auto">
      <View className="h-14 justify-center">
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/login');
            }
          }}
          className="self-start p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-4">
        <View className="mb-8">
          <Text className="text-3xl font-inter-bold text-dark mb-2">
            Create Your Account
          </Text>
          <Text className="text-muted text-lg font-inter">
            Please fill the details to register
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="flex-row gap-x-3">
            <View className="flex-1">
              <Input
                label="First Name *"
                placeholder="First name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (text.trim()) setErrors(prev => ({ ...prev, firstName: '' }));
                }}
                error={errors.firstName}
              />
            </View>
            <View className="flex-1">
              <Input
                label="Last Name *"
                placeholder="Last name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (text.trim()) setErrors(prev => ({ ...prev, lastName: '' }));
                }}
                error={errors.lastName}
              />
            </View>
          </View>

          <Input
            label="Middle Name (Optional)"
            placeholder="Middle name"
            value={middleName}
            onChangeText={setMiddleName}
          />

          <Dropdown
            label="Gender *"
            value={gender}
            options={['MALE', 'FEMALE', 'OTHER']}
            placeholder="Select Gender"
            onSelect={(val) => {
              setGender(val);
              setErrors(prev => ({ ...prev, gender: '' }));
            }}
            error={errors.gender}
          />

          <Input
            label="Mobile Number *"
            placeholder="Enter 10-digit number"
            keyboardType="number-pad"
            value={mobile}
            onChangeText={handleMobileChange}
            maxLength={10}
            leftIcon={<PhoneIcon size={20} color={colors.muted} />}
            error={errors.mobile}
          />

          <Input
            label="Email (Optional)"
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Address *"
            placeholder="Enter your residential address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (text.trim().length >= 5) setErrors(prev => ({ ...prev, address: '' }));
            }}
            multiline={true}
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
            error={errors.address}
          />

          <View className="mt-8">
            <Button title={isSubmitting ? "Submitting..." : "Register"} onPress={handleSubmit} disabled={isSubmitting} />
          </View>
        </ScrollView>
      </View>

      <AlertModal 
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {renderContent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {renderContent()}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
