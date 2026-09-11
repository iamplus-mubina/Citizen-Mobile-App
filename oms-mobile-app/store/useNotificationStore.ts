import { create } from 'zustand';
import { citizenService } from '@/services/citizenService';
import type { CitizenNotificationItem } from '@/services/types';

interface NotificationState {
  notifications: CitizenNotificationItem[];
  unreadCount: number;
  totalCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  refreshNotifications: (unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchNotifications: async (unreadOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await citizenService.getNotifications(1, 50, unreadOnly);
      if (response && response.list) {
        set({
          notifications: response.list,
          totalCount: response.total || response.list.length,
          unreadCount: response.unreadCount ?? get().unreadCount,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      console.warn('[useNotificationStore] fetchNotifications error:', err?.message || err);
      set({ isLoading: false, error: err?.message || 'Failed to load notifications' });
    }
  },

  refreshNotifications: async (unreadOnly = false) => {
    set({ isRefreshing: true, error: null });
    try {
      const response = await citizenService.getNotifications(1, 50, unreadOnly);
      if (response && response.list) {
        set({
          notifications: response.list,
          totalCount: response.total || response.list.length,
          unreadCount: response.unreadCount ?? get().unreadCount,
          isRefreshing: false,
        });
      } else {
        set({ isRefreshing: false });
      }
    } catch (err: any) {
      console.warn('[useNotificationStore] refreshNotifications error:', err?.message || err);
      set({ isRefreshing: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await citizenService.getUnreadCount();
      if (response && typeof response.unreadCount === 'number') {
        set({ unreadCount: response.unreadCount });
      }
    } catch (err: any) {
      console.warn('[useNotificationStore] fetchUnreadCount error:', err?.message || err);
    }
  },

  markAsRead: async (id: number) => {
    // Optimistic update
    const currentList = get().notifications;
    const item = currentList.find((n) => n.id === id);
    if (!item || item.isRead) return;

    set({
      notifications: currentList.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });

    try {
      await citizenService.markNotificationRead(id);
    } catch (err) {
      console.warn('[useNotificationStore] markAsRead backend sync error:', err);
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    const currentList = get().notifications;
    set({
      notifications: currentList.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    });

    try {
      await citizenService.markAllNotificationsRead();
    } catch (err) {
      console.warn('[useNotificationStore] markAllAsRead backend sync error:', err);
    }
  },
}));
