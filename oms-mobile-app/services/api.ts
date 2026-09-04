import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mn-0042-api.digitaloms.in';

export const api = axios.create({
  baseURL: BASE_URL,
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
      return;
    }
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      await AsyncStorage.removeItem('userToken');
    }
  } catch (e) {
    console.log('Storage removeItem fallback:', e);
  }
};

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error)
);
