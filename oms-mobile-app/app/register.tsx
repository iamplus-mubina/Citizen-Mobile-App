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
  BackHandler,
  TextInput,
  Image
} from 'react-native';
import { useRef } from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { DatePickerInput } from '@/components/DatePickerInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { Dropdown } from '@/components/Dropdown';
import { AlertModal } from '@/components/AlertModal';
import { citizenService } from '@/services/citizenService';
import omsLogo from '../assets/images/citizen_logo.png';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';
import { getCleanImageUrl } from '@/utils/image';

export default function RegisterScreen() {
  const router = useRouter();
  const { config, fetchSystemConfig, getBrandingPhotoUrl } = useSystemConfigStore();
  const [logoError, setLogoError] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [voterID, setVoterID] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' as 'error' | 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const otpRef = useRef<TextInput>(null);

  const photoUrl = getBrandingPhotoUrl('L');
  const cleanPhotoUrl = getCleanImageUrl(photoUrl);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  useEffect(() => {
    setLogoError(false);
  }, [cleanPhotoUrl]);

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    const onBackPress = () => {
      if (step === 'otp') {
        setStep('details');
        return true;
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/login');
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [router, step]);

  const handleMobileChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMobile(numericText);
    if (numericText.length === 10) setErrors(prev => ({ ...prev, mobile: '' }));
  };

  const handleDobChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    setDob(formatted);
    if (formatted.length >= 8) {
      setErrors(prev => ({ ...prev, dob: '' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!gender) newErrors.gender = 'Please select your gender';
    if (!dob.trim() || dob.trim().length < 8) newErrors.dob = 'Date of birth is required (DD/MM/YYYY)';
    if (mobile.length !== 10) newErrors.mobile = 'Please enter a valid 10-digit mobile number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await citizenService.requestOnboardOtp(mobile);
      setStep('otp');
      setOtp('');
      setTimeLeft(45);
      setTimeout(() => {
        otpRef.current?.focus();
      }, 100);
    } catch (error: any) {
      console.log('Request Onboard OTP Error:', error?.response?.data || error?.message);
      const rawMsg = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMsg)
        ? rawMsg.join(', ')
        : (rawMsg || 'Failed to send OTP. Please try again.');
      setAlertConfig({ title: 'Notice', message: errorMessage, type: 'error' });
      setAlertVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setAlertConfig({ title: 'Invalid OTP', message: 'Please enter a 6-digit OTP', type: 'error' });
      setAlertVisible(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        phone: mobile.trim(),
        email: email.trim() ? email.trim() : undefined,
        gender,
        dob: dob.trim(),
        address: address.trim() || undefined,
        voterID: voterID.trim() ? voterID.trim().toUpperCase() : undefined,
        otpCode: otp,
      };
      
      await citizenService.onboard(payload);
      
      setAlertConfig({ 
        title: 'Registration Successful', 
        message: 'Your request has been submitted. Please wait for admin approval.', 
        type: 'success' 
      });
      setAlertVisible(true);
    } catch (error: any) {
      console.log('API Error:', error?.response?.data || error?.message);
      const rawMsg = error.response?.data?.message;
      const errorMessage = Array.isArray(rawMsg)
        ? rawMsg.join(', ')
        : (rawMsg || 'Failed to register. Please try again.');
      setAlertConfig({ title: 'Registration Failed', message: errorMessage, type: 'error' });
      setAlertVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft === 0) {
      setOtp('');
      try {
        await citizenService.requestOnboardOtp(mobile);
        setTimeLeft(45);
        setTimeout(() => {
          otpRef.current?.focus();
        }, 100);
      } catch (error: any) {
        console.log('Resend OTP Error:', error?.response?.data || error?.message);
        const rawMsg = error.response?.data?.message;
        const errorMessage = Array.isArray(rawMsg)
          ? rawMsg.join(', ')
          : (rawMsg || 'Failed to resend OTP.');
        setAlertConfig({ title: 'Notice', message: errorMessage, type: 'error' });
        setAlertVisible(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const containerClass = Platform.OS === 'web'
    ? "flex-1 px-6 w-full max-w-md mx-auto"
    : "flex-1 px-5 w-full";

  const renderContent = () => (
    <View className={containerClass}>
      <View className="h-14 justify-center">
        <TouchableOpacity
          onPress={() => {
            if (step === 'otp') {
              setStep('details');
            } else if (router.canGoBack()) {
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

      <View className="flex-1 mt-2">
        {step === 'details' && (
          <View className="mb-6">
            <Text className="text-3xl font-inter-bold text-dark mb-2">
              Create Your Account
            </Text>
            <Text className="text-muted text-base font-inter">
              Please fill the details to register
            </Text>
          </View>
        )}

        {step === 'otp' && (
          <View className="mb-8 items-center">
            <Image
              key={cleanPhotoUrl || 'default'}
              source={cleanPhotoUrl && !logoError ? { uri: cleanPhotoUrl } : omsLogo}
              style={{ width: 130, height: 130, marginBottom: 16 }}
              resizeMode="contain"
              onError={() => setLogoError(true)}
            />
            <Text className="text-2xl font-inter-bold text-dark mb-2 text-center">
              Enter OTP
            </Text>
            <Text className="text-muted text-base font-inter text-center">
              We have sent a 6-digit code to {mobile}
            </Text>
          </View>
        )}

        {step === 'details' ? (
          <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
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

            <Input
              label="Middle Name (Optional)"
              placeholder="Middle name"
              value={middleName}
              onChangeText={setMiddleName}
            />

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

            <DatePickerInput
              label="Date of Birth *"
              placeholder="DD/MM/YYYY"
              value={dob}
              onChangeDate={(val) => {
                setDob(val);
                setErrors(prev => ({ ...prev, dob: '' }));
              }}
              error={errors.dob}
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
              label="Address (Optional)"
              placeholder="Enter your residential address"
              value={address}
              onChangeText={setAddress}
              multiline={true}
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <Input
              label="Voter ID (Optional)"
              placeholder="Enter Voter ID"
              value={voterID}
              onChangeText={setVoterID}
              autoCapitalize="characters"
            />

          <View className="mt-8">
            <Button title={isSubmitting ? "Sending OTP..." : "Next"} onPress={handleSubmit} disabled={isSubmitting} />
          </View>
        </ScrollView>
        ) : (
          <View className="w-full items-center relative">
            <View className="flex-row justify-between w-full mb-8">
              {Array.from({ length: 6 }).map((_, index) => {
                const digit = otp[index] || '';
                const isFocused = otp.length === index;
                return (
                  <View
                    key={index}
                    className={`w-12 h-14 border rounded-md justify-center items-center bg-surface ${isFocused ? 'border-primary' : 'border-border'}`}
                  >
                    <Text className="text-xl font-inter-semibold text-dark">
                      {digit}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TextInput
              ref={otpRef}
              value={otp}
              onChangeText={(text) => {
                const cleanText = text.replace(/[^0-9]/g, '');
                setOtp(cleanText);
              }}
              maxLength={6}
              keyboardType="number-pad"
              style={{ 
                position: 'absolute', 
                width: '100%', 
                height: 56,
                opacity: 0,
                color: 'transparent'
              }}
              caretHidden
              autoFocus
            />

            <View className="items-center mb-8">
              <Text className="text-dark font-inter-medium text-base mb-2">
                {formatTime(timeLeft)}
              </Text>

              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={timeLeft > 0}
              >
                <Text
                  className={`text-base font-inter-semibold underline ${timeLeft > 0 ? 'text-muted opacity-50' : 'text-primary'}`}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full mt-2">
              <Button title={isSubmitting ? "Verifying..." : "Verify OTP & Register"} onPress={handleVerifyOtp} disabled={isSubmitting} />
            </View>
          </View>
        )}
      </View>

      <AlertModal 
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.type === 'success') {
            router.push('/pending-approval');
          }
        }}
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
