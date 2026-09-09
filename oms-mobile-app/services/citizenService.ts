import { Platform } from 'react-native';
import { api } from './api';
import type {
  CitizenOnboardingPayload,
  AuthLoginResponse,
  CitizenProfile,
  UpdateProfilePayload,
  ComplainCategory,
  MasterDropdownItem,
  SubmitComplaintPayload,
  MyComplaintItem,
  SystemConfig,
} from './types';

export const getFileViewUrl = (path?: string | null): string | null => {
  if (!path || typeof path !== 'string' || !path.trim()) return null;
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
  return `${baseUrl}/file-uploader/downloadS3?path=${encodeURIComponent(trimmed)}`;
};

export const citizenService = {
  // ─── Auth & Onboarding ───
  onboard: async (payload: CitizenOnboardingPayload) => {
    const res = await api.post('/citizen/onboard', payload);
    return res.data;
  },

  requestOtp: async (phone: string) => {
    const res = await api.post('/citizen/auth/request-otp', { phone });
    return res.data;
  },

  verifyOtp: async (phone: string, otpCode: string): Promise<AuthLoginResponse> => {
    const res = await api.post('/citizen/auth/verify-otp', { phone, otpCode });
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/citizen/auth/logout', {});
    return res.data;
  },

  // ─── Profile ───
  getProfile: async (): Promise<CitizenProfile> => {
    const res = await api.get('/citizen/profile');
    return res.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await api.put('/citizen/profile', payload);
    return res.data;
  },

  // ─── Master Data Dropdowns ───
  getCategories: async (): Promise<ComplainCategory[]> => {
    const res = await api.get('/complainbox/categories');
    return res.data;
  },

  getDepartments: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/department');
    return res.data;
  },

  getAssemblies: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/assembly');
    return res.data;
  },

  getGaon: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/gaon');
    return res.data;
  },

  getGan: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/ganNo');
    return res.data;
  },

  getGat: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/gatNo');
    return res.data;
  },

  getPrabhag: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/prabhag');
    return res.data;
  },

  getPrabhagArea: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/prabhagArea');
    return res.data;
  },

  getDistricts: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/district');
    return res.data;
  },

  getCast: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/cast');
    return res.data;
  },

  getSubCast: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/subcast');
    return res.data;
  },

  getReligion: async (): Promise<MasterDropdownItem[]> => {
    const res = await api.get('/religion');
    return res.data;
  },

  // ─── Complaints ───
  submitComplaint: async (payload: SubmitComplaintPayload) => {
    const res = await api.post('/citizen/complaints/submit', payload);
    return res.data;
  },

  getMyComplaints: async (pageOrParams?: any, size = 10, status = ''): Promise<{ data: MyComplaintItem[]; total: number }> => {
    let page = 0;
    let limit = size;
    let stat = status;
    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      page = pageOrParams.page?.number ?? 0;
      limit = pageOrParams.page?.size ?? 10;
      stat = pageOrParams.status ?? '';
    } else if (typeof pageOrParams === 'number') {
      page = pageOrParams;
    }
    const res = await api.post('/citizen/complaints/my-complaints', {
      page: { number: page, size: limit },
      status: stat,
    });
    const raw = res.data;
    if (Array.isArray(raw)) {
      if (Array.isArray(raw[0])) {
        return { data: raw[0], total: typeof raw[1] === 'number' ? raw[1] : raw[0].length };
      }
      return { data: raw, total: raw.length };
    }
    if (raw && typeof raw === 'object') {
      return { data: raw.data || raw.complaints || [], total: raw.total ?? (raw.data?.length || 0) };
    }
    return { data: [], total: 0 };
  },

  getComplaintDetails: async (complainId: number) => {
    try {
      const res = await api.get(`/complainbox/mobile/${complainId}`);
      return res.data;
    } catch (err: any) {
      // If 404, the request is still pending approval and not in complain box yet
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  // ─── File Upload ───
  uploadFile: async (fileUri: string, fileName: string, fileType: string) => {
    const formData = new FormData();
    const filename = fileName || `file_${Date.now()}.jpg`;
    const type = fileType || 'image/jpeg';

    if (Platform.OS === 'web') {
      try {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('filename', blob, filename);
      } catch {
        formData.append('filename', { uri: fileUri, name: filename, type } as any);
      }
    } else {
      formData.append('filename', {
        uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
        name: filename,
        type: type,
      } as any);
    }

    const res = await api.post(
      '/file-uploader/upload2?entityName=citizen-complaints',
      formData,
      {
        transformRequest: (data) => data,
      }
    );
    return res.data;
  },

  // ─── Updates ───
  getUpdates: async (page = 0, size = 10, search = '') => {
    const res = await api.post('/updates/citizen/list', {
      page: { number: page, size },
      search,
      dateFrom: '',
      dateTo: '',
    });
    return res.data;
  },

  getUpdateById: async (id: number) => {
    const res = await api.get(`/updates/${id}`);
    return res.data;
  },

  // ─── System Config ───
  getSystemConfig: async (): Promise<SystemConfig> => {
    const res = await api.get('/system-manager/config/1');
    return res.data;
  },
};
