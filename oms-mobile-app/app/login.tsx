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
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhoneIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { colors } from '@/constants/Colors';
import omsLogo from '../assets/images/oms_logo.png';

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'splash' | 'mobile' | 'otp'>('splash');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const router = useRouter();

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

  const handleSendOtp = () => {
    if (mobile.length === 0) {
      setError('Mobile number is required');
    } else if (mobile.length < 10) {
      setError('Mobile number must be exactly 10 digits');
    } else {
      setError('');
      setStep('otp');
      setOtp('');
      setTimeLeft(45);
      setTimeout(() => {
        otpRef.current?.focus();
      }, 100);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      setError('Please enter a 6-digit OTP');
    } else if (otp !== '123456') {
      setError('Incorrect OTP. Please use 123456');
    } else {
      setError('');
      console.log('Login successful with mobile:', mobile);
      router.replace('/home');
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
      console.log('OTP Resent to:', mobile);
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
            <Text className="text-3xl font-inter-bold text-text mb-10 text-center leading-10">
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
              <ArrowLeftIcon size={24} color={colors.text} />
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
            <Text className="text-3xl font-inter-bold text-primary mb-2 text-center">
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
            <View className="w-full items-center">
              <View className="flex-row justify-between w-full mb-8">
                {Array.from({ length: 6 }).map((_, index) => {
                  const digit = otp[index] || '';
                  const isFocused = otp.length === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={1}
                      onPress={() => otpRef.current?.focus()}
                      className={`w-12 h-14 border-2 rounded-xl justify-center items-center bg-input-bg ${isFocused ? 'border-primary' : 'border-border'
                        }`}
                    >
                      <Text className="text-xl font-inter-semibold text-text">
                        {digit}
                      </Text>
                    </TouchableOpacity>
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
                style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                caretHidden
              />

              {error ? (
                <Text className="text-error text-sm font-inter mb-6 self-start">{error}</Text>
              ) : null}

              <View className="items-center mb-8">
                <Text className="text-text font-inter-medium text-base mb-2">
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
