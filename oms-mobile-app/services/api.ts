import axios from 'axios';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';


const resolveBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  // 1. Always prefer the .env value (set via EXPO_PUBLIC_API_URL)
  if (envUrl) {
    // If it's a real server URL (not localhost), use it directly
    if (!envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    // If it's a localhost URL, try to resolve Metro host IP for physical devices
    const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:8080`;
    }
    // Otherwise use the localhost URL as-is (emulator)
    return envUrl;
  }

  // 2. No .env set — try Metro host IP (dev mode on physical device)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8080`;
  }

  // 3. No .env, no Metro — warn and use a safe empty string
  console.warn('[OMS] EXPO_PUBLIC_API_URL is not set in .env! API calls will fail.');
  return '';
};

export const BASE_URL = resolveBaseUrl();
console.log('[OMS] Resolved BASE_URL:', BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
});

// In-memory fallback token cache in case both AsyncStorage and localStorage are unavailable
let memoryToken: string | null = null;

export const getStoredToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('userToken');
    }
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      const token = await AsyncStorage.getItem('userToken');
      if (token) return token;
    }
  } catch (e) {
    console.log('Storage getItem fallback:', e);
  }
  return memoryToken;
};

export const setStoredToken = async (token: string): Promise<void> => {
  memoryToken = token;
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('userToken', token);
      return;
    }
    if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
      await AsyncStorage.setItem('userToken', token);
    }
  } catch (e) {
    console.log('Storage setItem fallback:', e);
  }
};

export const removeStoredToken = async (): Promise<void> => {
  memoryToken = null;
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('userToken');
      window.localStorage.removeItem('user_profile_photo');
      return;
    }
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user_profile_photo');
    }
  } catch (e) {
    console.log('Storage removeItem fallback:', e);
  }
};

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const isFormData =
        config.data &&
        (typeof (config.data as any).append === 'function' ||
          (typeof FormData !== 'undefined' && config.data instanceof FormData) ||
          (config.data as any)._parts);
      if (isFormData) {
        delete config.headers['Content-Type'];
      }
    } catch (error) {
      console.error('Error fetching token', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (session expired)
let isRedirectingToLogin = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Handle 401 Unauthorized
    if (error.response && error.response.status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      await removeStoredToken();
      router.replace('/login');
      setTimeout(() => {
        isRedirectingToLogin = false;
      }, 2000);
    }

    // 2. Handle Network Errors
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      router.replace('/no-internet');
    }

    // 3. Handle 500+ Server Errors
    if (error.response && error.response.status >= 500) {
      if (error.config && error.config.method !== 'get') {
        router.replace('/error');
      }
    }

    return Promise.reject(error);
  }
);
