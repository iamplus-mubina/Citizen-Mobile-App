import { create } from 'zustand';

interface ComplaintFormState {
  category: string;
  title: string;
  description: string;
  priority: string;
  address: string;
  area: string;
  ward: string;
  pincode: string;
  photoCount: number;
  documentCount: number;
  setCategory: (value: string) => void;
  setDetails: (title: string, description: string, priority: string) => void;
  setLocation: (address: string, area: string, ward: string, pincode: string) => void;
  setAttachments: (photoCount: number, documentCount: number) => void;
  resetForm: () => void;
}

const defaultState = {
  category: '',
  title: '',
  description: '',
  priority: 'Medium',
  address: '',
  area: '',
  ward: '',
  pincode: '',
  photoCount: 0,
  documentCount: 0,
};

export const useComplaintStore = create<ComplaintFormState>((set) => ({
  ...defaultState,
  setCategory: (category) => set({ category }),
  setDetails: (title, description, priority) => set({ title, description, priority }),
  setLocation: (address, area, ward, pincode) => set({ address, area, ward, pincode }),
  setAttachments: (photoCount, documentCount) => set({ photoCount, documentCount }),
  resetForm: () => set(defaultState),
}));
