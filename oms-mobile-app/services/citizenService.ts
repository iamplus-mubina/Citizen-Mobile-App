import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { api, getStoredToken, BASE_URL } from './api';
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
  const baseUrl = api.defaults.baseURL || BASE_URL;
  const endpoint = trimmed.startsWith('citizen-complaints/') ? 'file2' : 'downloadS3';
  return `${baseUrl}/file-uploader/${endpoint}?path=${encodeURIComponent(trimmed)}`;
};

export const citizenService = {
  // ─── Auth & Onboarding ───
  requestOnboardOtp: async (phone: string) => {
    const res = await api.post('/citizen/onboard/request-otp', { phone });
    return res.data;
  },

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
    const data: any = { ...payload };
    if (data.ProfileImage) {
      if (typeof data.ProfileImage === 'string') {
        const trimmed = data.ProfileImage.trim();
        if (!trimmed.startsWith('[')) {
          let obj: any = null;
          try {
            if (trimmed.startsWith('{')) obj = JSON.parse(trimmed);
          } catch {}
          data.ProfileImage = JSON.stringify([
            {
              access_url: obj?.access_url || obj?.url || trimmed,
              originalName: obj?.originalName || trimmed.split('/').pop() || 'profile.jpg',
              date: new Date().toISOString(),
            },
          ]);
        }
      } else if (Array.isArray(data.ProfileImage)) {
        data.ProfileImage = JSON.stringify(data.ProfileImage);
      } else if (typeof data.ProfileImage === 'object') {
        data.ProfileImage = JSON.stringify([data.ProfileImage]);
      }
    }
    const res = await api.put('/citizen/profile', data);
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
  uploadFile: async (fileUri: string, fileName?: string, fileType?: string) => {
    let filename = fileName || `file_${Date.now()}.jpg`;
    if (!filename.includes('.')) {
      filename = `${filename}.jpg`;
    }
    const type = fileType || (filename.endsWith('.png') ? 'image/png' : 'image/jpeg');

    const token = await getStoredToken();
    const baseUrl = api.defaults.baseURL || BASE_URL;
    const uploadUrl = `${baseUrl}/file-uploader/upload2?entityName=citizen-complaints`;

    console.log('[uploadFile] Starting upload to:', uploadUrl, 'fileUri:', fileUri, 'name:', filename, 'type:', type);

    if (Platform.OS === 'web') {
      const formData = new FormData();
      try {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('filename', blob, filename);
      } catch {
        formData.append('filename', { uri: fileUri, name: filename, type } as any);
      }
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }
      return await response.json();
    }

    // Native Android / iOS using native OkHttp via Expo FileSystem (avoids React Native fetch/XHR Scoped Storage issues)
    const result = await FileSystem.uploadAsync(uploadUrl, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'filename',
      mimeType: type,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log('[uploadFile] Result status:', result.status, 'body:', result.body);

    if (result.status < 200 || result.status >= 300) {
      throw new Error(`Upload failed with status ${result.status}: ${result.body}`);
    }

    const data = JSON.parse(result.body);
    return data;
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
