import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  complaintCount: number;
  incrementComplaint: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  complaintCount: 0,
  incrementComplaint: () => set((state) => ({ complaintCount: state.complaintCount + 1 })),
}));
