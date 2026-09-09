import { create } from 'zustand';
import { citizenService, getFileViewUrl } from '@/services/citizenService';
import type { SystemConfig } from '@/services/types';

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
    const current = get().config;
    if (current && !force) {
      return current;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await citizenService.getSystemConfig();
      set({ config: data, isLoading: false, error: null });
      return data;
    } catch (err: any) {
      console.log('Error fetching system config:', err?.message || err);
      set({ isLoading: false, error: err?.message || 'Failed to load system config' });
      return get().config;
    }
  },

  setConfig: (config: SystemConfig) => set({ config }),

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
