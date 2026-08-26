import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, CameraIcon, UserIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import { UploadModal } from '@/components/UploadModal';
import omsLogo from '../assets/images/oms_logo.png';

export default function RegisterScreen() {
  const router = useRouter();
  

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [error, setError] = useState('');
  

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const otpRef = useRef<TextInput>(null);

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleMobileChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setMobile(numericText);
    if (numericText.length === 10) setError('');
  };

  const handleNext = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your address');
      return;
    }
    

    setError('');
    setStep('otp');
    setOtp('');
    setTimeLeft(45);
    setTimeout(() => {
      otpRef.current?.focus();
    }, 100);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      setError('Please enter a 6-digit OTP');
    } else if (otp !== '123456') {
      setError('Incorrect OTP. Please use 123456');
    } else {
      setError('');
      console.log('Registration Data:', { fullName, mobile, email, address, profilePhoto });
      router.push('/pending-approval');
    }
  };

  const handleResendOtp = () => {
    if (timeLeft === 0) {
      setOtp('');
      setError('');
      setTimeLeft(45);
      setTimeout(() => {
        otpRef.current?.focus();
      }, 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => (
    <View className="flex-1 px-6 w-full max-w-md mx-auto">
      <View className="h-14 justify-center">
        <TouchableOpacity
          onPress={() => {
            if (step === 'otp') {
              setStep('details');
              setError('');
            } else {
              router.back();
            }
          }}
          className="self-start p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <ArrowLeftIcon size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-4">
        {step === 'details' && (
          <View className="mb-8">
            <Text className="text-3xl font-inter-bold text-dark mb-2">
              Create Your Account
            </Text>
            <Text className="text-muted text-lg font-inter">
              Please fill the details to register
            </Text>
          </View>
        )}

        {step === 'otp' && (
          <View className="mb-10 items-center">
            <Image
              source={omsLogo}
              style={{ width: 150, height: 150, marginBottom: 24 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-inter-bold text-dark mb-2 text-center">
              Enter OTP
            </Text>
            <Text className="text-muted text-lg font-inter text-center">
              We have sent a 6-digit code to {mobile}
            </Text>
          </View>
        )}

        {step === 'details' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>


            <Input
              label="Full Name *"
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <Input
              label="Mobile Number *"
              placeholder="Enter 10-digit number"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={handleMobileChange}
              maxLength={10}
              leftIcon={<PhoneIcon size={20} color={colors.muted} />}
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
              onChangeText={setAddress}
              multiline={true}
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />

            {error && step === 'details' ? (
              <Text className="text-error text-sm font-inter mt-2">{error}</Text>
            ) : null}

            <View className="mt-8">
              <Button title="Next" onPress={handleNext} />
            </View>
          </ScrollView>
        )}

        {step === 'otp' && (
          <View className="w-full items-center relative mt-4">
            <View className="flex-row justify-between w-full mb-8">
              {Array.from({ length: 6 }).map((_, index) => {
                const digit = otp[index] || '';
                const isFocused = otp.length === index;
                return (
                  <View
                    key={index}
                    className={`w-12 h-14 border-2 rounded-xl justify-center items-center bg-input-bg ${isFocused ? 'border-primary' : 'border-border'}`}
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
                if (cleanText.length === 6) setError('');
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

            {error && step === 'otp' ? (
              <Text className="text-error text-sm font-inter mb-6 self-start">{error}</Text>
            ) : null}

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
              <Button title="Verify OTP & Register" onPress={handleVerifyOtp} />
            </View>
          </View>
        )}
      </View>


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
