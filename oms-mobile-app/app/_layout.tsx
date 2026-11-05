import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { useSystemConfigStore } from '@/store/useSystemConfigStore';
import { useLanguageStore } from '@/store/useLanguageStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    useSystemConfigStore.getState().fetchSystemConfig();
    useLanguageStore.getState().initLanguage();
  }, []);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="pending-approval" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/category" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/details" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/location" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/attachments" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/review" options={{ headerShown: false }} />
      <Stack.Screen name="complaint/success" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ headerShown: false }} />
      <Stack.Screen name="no-internet" options={{ headerShown: false }} />
      <Stack.Screen name="error" options={{ headerShown: false }} />
      <Stack.Screen name="services/index" options={{ headerShown: false }} />
      <Stack.Screen name="services/category/[categoryId]" options={{ headerShown: false }} />
      <Stack.Screen name="services/detail/[serviceId]" options={{ headerShown: false }} />
      <Stack.Screen name="services/apply/[serviceId]" options={{ headerShown: false }} />
      <Stack.Screen name="services/appointment/[serviceId]" options={{ headerShown: false }} />
      <Stack.Screen name="services/success" options={{ headerShown: false }} />
      <Stack.Screen name="services/request/[requestId]" options={{ headerShown: false }} />
    </Stack>
  );
}

