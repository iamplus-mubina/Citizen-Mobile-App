import axios from 'axios';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mn-0042-api.digitaloms.in';

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
