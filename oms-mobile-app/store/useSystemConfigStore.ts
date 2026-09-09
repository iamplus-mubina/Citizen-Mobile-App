import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { citizenService, getFileViewUrl } from '@/services/citizenService';
import type { SystemConfig } from '@/services/types';

const SYSTEM_CONFIG_CACHE_KEY = '@oms_system_config_cache';

interface SystemConfigState {
  config: SystemConfig | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSystemConfig: (force?: boolean) => Promise<SystemConfig | null>;
  setConfig: (config: SystemConfig) => void;

  // Computed / Helper getters
  getBrandingTitle: () => string;
  getBrandingSubTitle: () => string;
  getBrandingTopBarTitle: () => string;
  getBrandingPhotoUrl: (size?: 'L' | 'M' | 'S') => string | null;
}

export const useSystemConfigStore = create<SystemConfigState>((set, get) => ({
  config: null,
  isLoading: false,
  error: null,

  fetchSystemConfig: async (force = false) => {
    // 1. If not yet in memory, try reading from AsyncStorage first for immediate display
    if (!get().config) {
      try {
        const cached = await AsyncStorage.getItem(SYSTEM_CONFIG_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            set({ config: parsed });
          }
        }
      } catch (e) {
        // ignore cache read error
      }
    }

    const current = get().config;
    if (current && !force) {
      // In background, refresh cache to ensure config is up-to-date
      citizenService.getSystemConfig().then((data) => {
        if (data) {
          set({ config: data });
          AsyncStorage.setItem(SYSTEM_CONFIG_CACHE_KEY, JSON.stringify(data)).catch(() => {});
        }
      }).catch(() => {});
      return current;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await citizenService.getSystemConfig();
      if (data) {
        set({ config: data, isLoading: false, error: null });
        AsyncStorage.setItem(SYSTEM_CONFIG_CACHE_KEY, JSON.stringify(data)).catch(() => {});
      } else {
        set({ isLoading: false });
      }
      return data;
    } catch (err: any) {
      console.log('Error fetching system config:', err?.message || err);
      set({ isLoading: false, error: err?.message || 'Failed to load system config' });
      return get().config;
    }
  },

  setConfig: (config: SystemConfig) => {
    set({ config });
    AsyncStorage.setItem(SYSTEM_CONFIG_CACHE_KEY, JSON.stringify(config)).catch(() => {});
  },

  getBrandingTitle: () => {
    const { config } = get();
    return config?.BRANDING_TITLE || 'Office Management System';
  },

  getBrandingSubTitle: () => {
    const { config } = get();
    return config?.BRANDING_SUB_TITLE || 'OMS Citizen';
  },

  getBrandingTopBarTitle: () => {
    const { config } = get();
    return config?.BRANDING_TOPBAR_TITLE || config?.BRANDING_TITLE || 'Office Management System';
  },

  getBrandingPhotoUrl: (size: 'L' | 'M' | 'S' = 'L') => {
    const { config } = get();
    if (!config) return null;
    const photoPath =
      size === 'L'
        ? config.BRANDING_PHOTO_L
        : size === 'M'
        ? config.BRANDING_PHOTO_M || config.BRANDING_PHOTO_L
        : config.BRANDING_PHOTO_S || config.BRANDING_PHOTO_L;
    return getFileViewUrl(photoPath);
  },
}));

// Eagerly restore cached config from AsyncStorage on app boot
AsyncStorage.getItem(SYSTEM_CONFIG_CACHE_KEY)
  .then((cached) => {
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && !useSystemConfigStore.getState().config) {
          useSystemConfigStore.setState({ config: parsed });
        }
      } catch (e) {}
    }
  })
  .catch(() => {});
