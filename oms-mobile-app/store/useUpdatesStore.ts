import { create } from 'zustand';
import { api, getStoredToken } from '@/services/api';

export interface FormattedUpdateItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  place: string;
  category?: string;
  imageUrl: string;
  images: string[];
  read: boolean;
  fullItem: any;
}

const formatDateString = (dateStr?: string) => {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

interface UpdatesState {
  updates: FormattedUpdateItem[];
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;

  fetchUpdates: (force?: boolean) => Promise<void>;
  refreshUpdates: () => Promise<void>;
}

export const useUpdatesStore = create<UpdatesState>((set, get) => ({
  updates: [],
  loading: false,
  isRefreshing: false,
  error: null,

  fetchUpdates: async (force = false) => {
    // Avoid duplicate network calls if updates are already cached and not forced
    if (!force && get().updates.length > 0) {
      return;
    }

    if (get().updates.length === 0) {
      set({ loading: true, error: null });
    }

    try {
      await getStoredToken();
      let res: any;
      const endpoints = [
        { method: 'post', url: '/updates/citizen/list', body: { page: { number: 0, size: 20 }, search: '' } },
        { method: 'get', url: '/updates/citizen/list' },
        { method: 'get', url: '/citizen/updates' },
        { method: 'get', url: '/updates' },
      ];

      for (const ep of endpoints) {
        try {
          if (ep.method === 'post') {
            res = await api.post(ep.url, ep.body || {});
          } else {
            res = await api.get(ep.url);
          }
          if (res?.data) {
            const possibleList = Array.isArray(res.data)
              ? res.data
              : res.data.data || res.data.content || res.data.list || res.data.rows || res.data.items;
            if (Array.isArray(possibleList) && possibleList.length > 0) {
              res.data = possibleList;
              break;
            }
          }
        } catch {
          // continue fallback endpoint
        }
      }

      if (res?.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.content || res.data.list || res.data.rows || res.data.items;

        if (Array.isArray(list) && list.length > 0) {
          const formatted: FormattedUpdateItem[] = list.map((item: any, idx: number) => {
            let imageList: string[] = [];
            if (Array.isArray(item.images)) {
              imageList = item.images;
            } else if (typeof item.images === 'string') {
              try {
                const parsed = JSON.parse(item.images);
                if (Array.isArray(parsed)) imageList = parsed;
              } catch {
                if (item.images.length > 0) imageList = [item.images];
              }
            }

            const primaryImg = imageList.length > 0
              ? imageList[0]
              : (item.imageUrl || item.image || item.banner || '');

            const rawDate = item.createdDate || item.createdAt || item.date || item.updateDate;

            return {
              id: String(item.id || item.updateId || `upd-${idx}`),
              title: item.title || item.heading || item.name || 'City Update',
              date: formatDateString(rawDate),
              summary: item.description || item.summary || item.content || item.place || item.location || '',
              place: item.place || item.location || '',
              category: item.category || item.categoryName || item.type || item.place || 'City Update',
              imageUrl: primaryImg,
              images: imageList,
              read: !!item.read || !!item.isRead,
              fullItem: item,
            };
          });

          set({ updates: formatted, loading: false });
        } else {
          set({ updates: [], loading: false });
        }
      } else {
        set({ updates: [], loading: false });
      }
    } catch (err: any) {
      console.log('[useUpdatesStore] fetchUpdates error:', err?.message || err);
      set({ loading: false, error: err?.message || 'Failed to load updates' });
    }
  },

  refreshUpdates: async () => {
    set({ isRefreshing: true });
    await get().fetchUpdates(true);
    set({ isRefreshing: false });
  },
}));
