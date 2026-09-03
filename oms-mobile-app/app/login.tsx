import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import omsLogo from '../assets/images/oms_logo.png';
import { useComplaintStore } from '@/store/useComplaintStore';
import { api } from '@/services/api';
import { AlertModal } from '@/components/AlertModal';

export default function LoginScreen() {
  const router = useRouter();
  const { setPhoneNumber } = useComplaintStore();
  const [step, setStep] = useState<'splash' | 'mobile' | 'otp'>('splash');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'error' as 'error' | 'success' });

  const otpRef = useRef<TextInput>(null);
  const touchStartX = useRef(0);

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
    if (numericText.length === 10) {
      setError('');
    }
  };

  const handleSendOtp = async () => {
    if (mobile.length === 0) {
      setError('Mobile number is required');
    } else if (mobile.length < 10) {
      setError('Mobile number must be exactly 10 digits');
    } else {
      setError('');
      try {
        await api.post('/citizen/auth/request-otp', { phone: mobile });
        setStep('otp');
        setOtp('');
        setTimeLeft(45);
        setTimeout(() => {
          otpRef.current?.focus();
        }, 100);
      } catch (err: any) {
        console.error('Request OTP Error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
        setAlertConfig({ title: 'Error', message: errorMessage, type: 'error' });
        setAlertVisible(true);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('Please enter a 6-digit OTP');
    } else {
      setError('');
      try {
        await api.post('/citizen/auth/verify-otp', { phone: mobile, otpCode: otp });
        setPhoneNumber(`+91 ${mobile}`);
        console.log('Login successful with mobile:', mobile);
        router.replace('/home');
      } catch (err: any) {
        console.error('Verify OTP Error:', err);
        const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
        setAlertConfig({ title: 'Verification Failed', message: errorMessage, type: 'error' });
        setAlertVisible(true);
      }
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft === 0) {
      setOtp('');
      setError('');
      try {
        await api.post('/citizen/auth/request-otp', { phone: mobile });
        setTimeLeft(45);
        setTimeout(() => {
          otpRef.current?.focus();
        }, 100);
        console.log('OTP Resent to:', mobile);
      } catch (err: any) {
        console.error('Resend OTP Error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to resend OTP.';
        setAlertConfig({ title: 'Error', message: errorMessage, type: 'error' });
        setAlertVisible(true);
      }
    }
  };

  const handleBackToMobile = () => {
    setStep('mobile');
    setError('');
    setOtp('');
  };


  const handleGoToMobile = () => {
    setStep('mobile');
  };

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e: any) => {
    const touchEndX = e.nativeEvent.pageX;
    const dx = touchStartX.current - touchEndX;
    if (dx > 50) {
      handleGoToMobile();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    const splashClass = Platform.OS === 'web'
      ? "flex-1 justify-center px-6 w-full max-w-md mx-auto"
      : "flex-1 justify-center px-6";

    const mainClass = Platform.OS === 'web'
      ? "flex-1 px-6 w-full max-w-md mx-auto"
      : "flex-1 px-6";

    if (step === 'splash') {
      return (
        <View
          className={splashClass}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <View className="items-center px-6">
            <Image
              source={omsLogo}
              style={{ width: 160, height: 160, marginBottom: 32 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-inter-bold text-dark mb-10 text-center leading-10">
              {"Office Management\nCitizen App"}
            </Text>

            <View className="flex-row gap-x-2 mt-4">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
              <TouchableOpacity onPress={handleGoToMobile}>
                <View className="w-2.5 h-2.5 rounded-full bg-border" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoToMobile}>
                <View className="w-2.5 h-2.5 rounded-full bg-border" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className={mainClass}>
        <View className="h-14 justify-center">
          {step === 'otp' && (
            <TouchableOpacity
              onPress={handleBackToMobile}
              className="self-start p-2 -ml-2 rounded-full"
              activeOpacity={0.7}
            >
              <ArrowLeftIcon size={24} color={colors.dark} />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 justify-center pb-14">
          <View className="mb-10 items-center">
            <Image
              source={omsLogo}
              style={{ width: 150, height: 150, marginBottom: 24 }}
              resizeMode="contain"
            />
            <Text className="text-3xl font-inter-bold text-dark mb-2 text-center">
              {step === 'mobile' ? 'Welcome' : 'Enter OTP'}
            </Text>
            <Text className="text-muted text-lg font-inter text-center">
              {step === 'mobile'
                ? 'Please enter your mobile number.'
                : `We have sent a 6-digit code to ${mobile}`
              }
            </Text>
          </View>

          {step === 'mobile' && (
            <>
              <Input
                label="Mobile Number"
                placeholder="Enter your 10-digit number"
                keyboardType="number-pad"
                value={mobile}
                onChangeText={handleMobileChange}
                maxLength={10}
                error={error}
                leftIcon={<PhoneIcon size={20} color={colors.muted} />}
              />

              <View className="mt-6">
                <Button title="Send OTP" onPress={handleSendOtp} />
              </View>

              <View className="items-center mt-20">
                <Text className="text-muted font-inter text-base mb-2">
                  New user?
                </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text className="text-base font-inter-semibold text-primary underline">
                    Register Now
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'otp' && (
            <View className="w-full items-center relative">
              <View className="flex-row justify-between w-full mb-8">
                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = otp[index] || '';
                  const isFocused = otp.length === index;
                  return (
                    <View
                      key={index}
                      className={`w-12 h-14 border rounded-md justify-center items-center bg-surface ${isFocused ? 'border-primary' : 'border-border'
                        }`}
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
                  if (cleanText.length === 6) {
                    setError('');
                  }
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

              {error ? (
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
                    className={`text-base font-inter-semibold underline ${timeLeft > 0 ? 'text-muted opacity-50' : 'text-primary'
                      }`}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="w-full mt-2">
                <Button title="Verify OTP" onPress={handleVerifyOtp} />
              </View>
            </View>
          )}
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
  };

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
