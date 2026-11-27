/**
 * Base URL store — single source of truth for the API base URL.
 *
 * Staging:    fetches base_url from Firebase Firestore 'mn' collection.
 *             Falls back to the last-known URL cached in AsyncStorage if Firebase
 *             is unreachable (useful for offline / flaky network scenarios).
 *
 * Production: immediately resolves to EXPO_PUBLIC_API_URL from .env.
 *             No Firebase call is ever made in production.
 *
 * Usage:
 *   const url = useBaseUrlStore.getState().baseUrl;
 *   const isReady = useBaseUrlStore.getState().isReady;
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IS_STAGING, PRODUCTION_API_URL } from '@/constants/environment';
import { fetchBaseUrlFromFirebase } from '@/services/firebaseConfig';

const CACHE_KEY = '@citizen_app_base_url';

interface BaseUrlState {
  /** The resolved base URL to use for all API requests. */
  baseUrl: string;
  /**
   * Whether the URL has been resolved and the app can safely make API calls.
   * Production: always true immediately.
   * Staging: becomes true once Firebase responds or cache is loaded.
   */
  isReady: boolean;

  /**
   * Call once at app startup (in _layout.tsx).
   * - Production: sets URL from .env, marks ready instantly.
   * - Staging:    loads cached URL first (instant display), then refreshes from Firebase.
   */
  initialize: () => Promise<void>;
}

export const useBaseUrlStore = create<BaseUrlState>((set, get) => ({
  baseUrl: IS_STAGING ? '' : PRODUCTION_API_URL,
  isReady: !IS_STAGING, // production is ready immediately; staging waits for Firebase

  initialize: async () => {
    // ── PRODUCTION ────────────────────────────────────────────────────────────
    if (!IS_STAGING) {
      set({ baseUrl: PRODUCTION_API_URL, isReady: true });
      console.log('[BaseUrl] Production mode. URL:', PRODUCTION_API_URL);
      return;
    }

    // ── STAGING ───────────────────────────────────────────────────────────────
    console.log('[BaseUrl] Staging mode. Fetching base_url from Firebase...');

    // 1. Load cached URL immediately so the app is usable even before Firebase responds.
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        set({ baseUrl: cached, isReady: true });
        console.log('[BaseUrl] Loaded cached URL:', cached);
      }
    } catch (_) {
      // AsyncStorage read failure — continue to Firebase fetch
    }

    // 2. Always refresh from Firebase to pick up any URL changes made in the console.
    const firebaseUrl = await fetchBaseUrlFromFirebase();

    if (firebaseUrl) {
      set({ baseUrl: firebaseUrl, isReady: true });
      // Persist for offline / next launch
      AsyncStorage.setItem(CACHE_KEY, firebaseUrl).catch(() => {});
      console.log('[BaseUrl] Staging URL updated from Firebase:', firebaseUrl);
    } else {
      // Firebase returned nothing — stick with the cache if available
      if (!get().isReady) {
        console.error(
          '[BaseUrl] STAGING: Firebase returned null and no cached URL available. ' +
          'API calls will fail until Firebase is reachable.'
        );
      } else {
        console.warn('[BaseUrl] Firebase fetch failed. Using cached URL:', get().baseUrl);
      }
    }
  },
}));
