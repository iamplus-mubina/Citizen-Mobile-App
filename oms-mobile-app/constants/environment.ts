/**
 * Environment configuration for the Citizen App.
 *
 * EXPO_PUBLIC_APP_ENV is baked in at build time:
 *   - 'staging'    → base URL fetched from Firebase Firestore (can be changed remotely)
 *   - 'production' → base URL read from EXPO_PUBLIC_API_URL in .env (baked into build)
 *
 * To run staging:  EXPO_PUBLIC_APP_ENV=staging expo start
 * To run prod:     EXPO_PUBLIC_APP_ENV=production expo start  (or just expo start)
 */

export type AppEnv = 'production' | 'staging';

export const APP_ENV: AppEnv =
  (process.env.EXPO_PUBLIC_APP_ENV as AppEnv) || 'production';

export const IS_STAGING = APP_ENV === 'staging';
export const IS_PRODUCTION = APP_ENV === 'production';

/**
 * Production API URL — baked in from .env at build time.
 * Not used in staging (staging always reads from Firebase).
 */
export const PRODUCTION_API_URL =
  (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
