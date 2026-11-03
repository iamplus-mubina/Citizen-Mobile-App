import { create } from 'zustand';
import type { ServiceCategoryKey } from '@/services/mock/popularServices.data';

export interface ServiceApplicationRecord {
  applicationId: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategoryKey;
  applicantName: string;
  applicantPhone: string;
  applicantAddress: string;
  applicantAadhar?: string;
  documentsChecked: string[];
  submissionDate: string;
  status: 'SUBMITTED' | 'UNDER_SCRUTINY' | 'APPROVED';
}

export interface ServiceAppointmentRecord {
  appointmentId: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategoryKey;
  categoryTitle: string;
  applicantName: string;
  applicantPhone: string;
  appointmentDate: string;
  timeSlot: string;
  venue: string;
  bookingDate: string;
  formattedDate: string;
  documentsConfirmed: boolean;
  requiredDocuments: Array<{ id: string; name: string }>;
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface PopularServicesState {
  selectedCategory: ServiceCategoryKey;
  searchQuery: string;
  applications: ServiceApplicationRecord[];
  appointments: ServiceAppointmentRecord[];

  setSelectedCategory: (category: ServiceCategoryKey) => void;
  setSearchQuery: (query: string) => void;
  submitApplication: (record: Omit<ServiceApplicationRecord, 'applicationId' | 'submissionDate' | 'status'>) => string;
  bookAppointment: (record: Omit<ServiceAppointmentRecord, 'appointmentId' | 'bookingDate' | 'formattedDate' | 'status'>) => string;
  getAppointmentById: (id: string) => ServiceAppointmentRecord | undefined;
}

export const usePopularServicesStore = create<PopularServicesState>((set, get) => ({
  selectedCategory: 'citizen',
  searchQuery: '',
  applications: [],
  appointments: [],

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // In-memory application submission
  submitApplication: (record) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = record.category.substring(0, 3).toUpperCase();
    const applicationId = `MOCK-APP-2026-${code}-${randomSuffix}`;
    const newRecord: ServiceApplicationRecord = {
      ...record,
      applicationId,
      submissionDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'SUBMITTED',
    };

    set((state) => ({
      applications: [newRecord, ...state.applications],
    }));

    return applicationId;
  },

  // In-memory appointment booking
  bookAppointment: (record) => {
    // Generate unique request number (REQ-2026-XXXXXX)
    const existing = new Set(get().appointments.map((a) => a.appointmentId));
    let appointmentId = '';
    do {
      const randomSeq = String(Math.floor(100000 + Math.random() * 900000));
      appointmentId = `REQ-2026-${randomSeq}`;
    } while (existing.has(appointmentId));
    
    // Format timestamp e.g. "3 Nov 2026, 10:41 am"
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase()}`;

    const newRecord: ServiceAppointmentRecord = {
      ...record,
      appointmentId,
      bookingDate: formattedDate,
      formattedDate,
      status: 'SUBMITTED',
    };

    set((state) => ({
      appointments: [newRecord, ...state.appointments],
    }));

    return appointmentId;
  },

  getAppointmentById: (id) => {
    return get().appointments.find((a) => a.appointmentId === id);
  },
}));
