import { api } from './api';

export type BackendCategoryKey =
  | 'CITIZEN_SERVICES'
  | 'SCHEMES'
  | 'CERTIFICATES'
  | 'PERMISSION_NOC'
  | 'OTHER';

export type FrontendCategoryKey =
  | 'citizen'
  | 'schemes'
  | 'certificates'
  | 'permissions'
  | 'other';

export const CATEGORY_MAP: Record<FrontendCategoryKey, BackendCategoryKey> = {
  citizen: 'CITIZEN_SERVICES',
  schemes: 'SCHEMES',
  certificates: 'CERTIFICATES',
  permissions: 'PERMISSION_NOC',
  other: 'OTHER',
};

export const REVERSE_CATEGORY_MAP: Record<string, FrontendCategoryKey> = {
  CITIZEN_SERVICES: 'citizen',
  SCHEMES: 'schemes',
  CERTIFICATES: 'certificates',
  PERMISSION_NOC: 'permissions',
  OTHER: 'other',
};

export const CATEGORY_TITLES: Record<string, string> = {
  citizen: 'Citizen Services',
  schemes: 'Schemes',
  certificates: 'Certificates',
  permissions: 'Permissions / NOC',
  other: 'Other',
  CITIZEN_SERVICES: 'Citizen Services',
  SCHEMES: 'Schemes',
  CERTIFICATES: 'Certificates',
  PERMISSION_NOC: 'Permissions / NOC',
  OTHER: 'Other',
};

export interface PopularServiceItem {
  id: number;
  name: string;
  category: BackendCategoryKey | string;
  description: string;
  requiredDocuments: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PopularServiceDocument {
  documentName: string;
  url: string;
}

export interface PopularServiceApplication {
  id: number;
  tokenNumber: string;
  serviceId: number;
  service?: {
    id: number;
    name: string;
    category: string;
    description?: string;
    requiredDocuments?: string[];
  };
  visitorId: number;
  applicantName?: string;
  mobileNumber?: string;
  email?: string;
  profileImage?: string;
  documents: PopularServiceDocument[];
  remarks?: string;
  status: 'PENDING' | 'SCHEDULED' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  scheduleDate?: string;
  schedulePlace?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyPopularServicePayload {
  serviceId: number;
  applicantName: string;
  mobileNumber: string;
  remarks?: string;
}

export interface CategorySummary {
  category: BackendCategoryKey;
  label: string;
  serviceCount: number;
}

export const toBackendCategory = (cat: string): BackendCategoryKey => {
  if (cat in CATEGORY_MAP) {
    return CATEGORY_MAP[cat as FrontendCategoryKey];
  }
  return cat as BackendCategoryKey;
};

export const toFrontendCategory = (cat: string): FrontendCategoryKey => {
  if (cat in REVERSE_CATEGORY_MAP) {
    return REVERSE_CATEGORY_MAP[cat];
  }
  return 'citizen';
};

export const getCategoryTitle = (cat: string): string => {
  return CATEGORY_TITLES[cat] || cat;
};

export const popularService = {
  // ─── 1. Categories ───
  getCategories: async (): Promise<CategorySummary[]> => {
    try {
      const res = await api.get('/popular-services/categories');
      return res.data?.data || [];
    } catch (err) {
      console.error('[popularService] getCategories error:', err);
      return [];
    }
  },

  // ─── 2. Services by Category ───
  getServicesByCategory: async (category: string): Promise<PopularServiceItem[]> => {
    try {
      const backendCategory = toBackendCategory(category);
      const res = await api.get(`/popular-services/by-category/${backendCategory}`);
      return res.data?.data || [];
    } catch (err) {
      console.error('[popularService] getServicesByCategory error:', err);
      return [];
    }
  },

  // ─── 3. Single Service Details ───
  getServiceById: async (id: number | string): Promise<PopularServiceItem | null> => {
    try {
      const res = await api.get(`/popular-services/${id}`);
      return res.data?.data || null;
    } catch (err) {
      console.error('[popularService] getServiceById error:', err);
      return null;
    }
  },

  // ─── 4. Apply for a Service ───
  applyForService: async (payload: ApplyPopularServicePayload): Promise<{ success: boolean; data?: PopularServiceApplication; message?: string }> => {
    const res = await api.post('/popular-services/apply', payload);
    return res.data;
  },

  // ─── 5. Citizen's My Applications ───
  getMyApplications: async (): Promise<PopularServiceApplication[]> => {
    try {
      const res = await api.get('/popular-services/citizen/my-applications');
      return res.data?.data || [];
    } catch (err) {
      console.error('[popularService] getMyApplications error:', err);
      return [];
    }
  },

  // ─── 6. Single Application Tracker ───
  getApplicationById: async (id: number | string): Promise<PopularServiceApplication | null> => {
    try {
      const res = await api.get(`/popular-services/citizen/applications/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (err: any) {
      console.warn('[popularService] Direct application fetch failed, checking in my-applications list...', err?.message);
    }

    try {
      const list = await popularService.getMyApplications();
      const numId = Number(id);
      const found = list.find((item) => item.id === numId || item.tokenNumber === String(id));
      return found || null;
    } catch (err) {
      console.error('[popularService] Fallback getApplicationById error:', err);
      return null;
    }
  },
};
