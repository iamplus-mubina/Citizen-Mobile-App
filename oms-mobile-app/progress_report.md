# Progress Report

## Current Status
**Project Phase**: Phase 3 — Backend API Integration  Completed | Phase 4 — UI Refinements & Form Simplification  Completed
**Last Updated**: 08 Sep 2026


---

## Completed Tasks

### Foundation & Setup
- [x] Initialized Expo Router structure.
- [x] Installed NativeWind v4 & Tailwind CSS.
- [x] Configured absolute path aliases (`@/*`).
- [x] Installed `react-native-heroicons` & `react-native-svg` for vector icons.
- [x] Configured custom Google Inter font assets (Regular, Medium, SemiBold, Bold) to load asynchronously.
- [x] Formulated theme design color tokens (primary, secondary, background, text, error, muted, etc.).
- [x] Corrected Metro package symlinking error on PNPM via hoisted node-linker configuration.
- [x] Added type declarations for `.png` imports inside `app.d.ts`.

### Login & Onboarding
- [x] Created `login.tsx` route with redirect from root `index.tsx`.
- [x] Configured input constraints (numeric-only, 10-digit limit, error state) and left phone icon.
- [x] Built OTP verification flow (6 digit boxes, back navigation, countdown timer, resend button).
- [x] Adjusted viewport to handle desktop screen layouts responsibly (`w-full max-w-md mx-auto` centering).
- [x] Fixed mobile keyboard overlap via `KeyboardAvoidingView` (bypassed on web).
- [x] Created onboarding Splash Screen with circular logo, paging dots, and touch swipe gesture transition.
- [x] Fixed OTP input boxes not responding to touch on physical Android devices in Expo Go.
- [x] Integrated OTP send API (`POST /citizen/auth/send-otp`).
- [x] Integrated OTP verify API (`POST /citizen/auth/verify-otp`) — token saved to AsyncStorage on success.
- [x] Built `register.tsx` — New Citizen Registration form.
- [x] Integrated Register API (`POST /citizen/auth/register`).
- [x] Built `pending-approval.tsx` — shown after successful new registration.
- [x] Built `no-internet.tsx` and `error.tsx` — fallback error screens.
- [x] Created `AlertModal.tsx` — cross-platform alert modal (web-safe `Alert.alert` replacement).

### Home Dashboard
- [x] Created reusable `Header` component (OMS logo + dynamic welcome text from API profile name).
- [x] Built `home.tsx` dashboard with router redirection upon OTP verification.
- [x] Created `BottomNavigation` component with 4 tabs and active state highlights.
- [x] Built Home Dashboard: Register Complaint card, Quick Actions grid, Complaint position stats.
- [x] Refactored home screen widgets into a single polymorphic `Card` component (`complaint`, `quick`, `recent` variants).
- [x] Implemented `getFormattedDate` helper for dynamic date display.
- [x] Fixed Bottom Navigation overlap on Android via `SafeAreaView` bottom edge.
- [x] Integrated profile API (`GET /citizen/profile`) on home mount — fetches name and sets into Zustand store.
- [x] Integrated My Complaints API (`POST /citizen/complaints/my-complaints`) on home mount — fetches latest 10 complaints.
- [x] Profile photo stored to and loaded from `AsyncStorage` (`user_profile_photo` key) for persistence across app restarts.
- [x] Removed duplicate Track Status card from Quick Actions.
- [x] Hidden Help & Support card (commented out in JSX, not deleted — pending backend support).

### Complaint Registration Wizard
- [x] Built Step 1 — Category Selection (`complaint/category.tsx`) with dynamic categories from API (`GET /category`).
- [x] Built Step 2 — Complaint Details (`complaint/details.tsx`) with Title and Description textarea.
  - **Priority selection removed** (simplified by request).
- [x] Built Step 3 — Location (`complaint/location.tsx`) with Address, Area, Pincode.
  - **Ward dropdown removed** (simplified by request).
  - **Use Current Location button hidden** (GPS integration pending).
- [x] Built Step 4 — Attachments (`complaint/attachments.tsx`) with photo/document upload APIs.
  - Photos: `POST /citizen/complaints/upload-photo` (multipart/form-data).
  - Documents: `POST /citizen/complaints/upload-document` (multipart/form-data).
- [x] Built Step 5 — Review and Submit (`complaint/review.tsx`) with complaint submission API (`POST /citizen/complaints/submit`).
- [x] Built Complaint Submitted Successfully confirmation screen (`complaint/success.tsx`).
- [x] Created reusable `Dropdown` component with inline popover and search.
- [x] Created cross-platform `UploadModal` component using `expo-image-picker` (Camera + Gallery + Web).
- [x] Integrated `expo-document-picker` for document upload.
- [x] Configured Zustand store (`store/useComplaintStore.ts`) to manage wizard form state, profile, complaints.
- [x] Connected submitted complaints dynamically to the Home screen dashboard from the Zustand store.

### Complaint Tracking
- [x] Built `app/complaint/timeline/[id].tsx` — Complaint Status Timeline Tracker.
- [x] Integrated Timeline API (`GET /citizen/complaints/track/:id`).
- [x] Created `StepperTimeline.tsx` and `Stepper.tsx` reusable timeline step components.

### City Updates
- [x] Built `app/updates/index.tsx` — City Updates list screen.
- [x] Integrated City Updates List API (`GET /updates/citizen/list`) with multi-endpoint fallback strategy.
- [x] Built `app/updates/[id].tsx` — City Update Detail screen.
- [x] Integrated City Update Detail API (`GET /updates/:id`).
- [x] Added paging image carousel with `1/N` counter badge and pagination dot indicator.
- [x] Added fullscreen image lightbox modal (tap image to expand).
- [x] Formatted date + time display (`DD MMM YYYY • HH:MM AM/PM`).
- [x] Passed `imageUrl` via router params from list → detail to eliminate transition image flicker.

### Profile
- [x] Built `app/profile/edit.tsx` — Edit Profile screen.
- [x] Integrated Edit Profile API (`PUT /citizen/profile`).
- [x] Integrated profile photo upload/update inside Profile screen using `UploadModal`.
- [x] Profile photo persisted to `AsyncStorage` on selection.
- [x] Connected phone number from login credentials to Profile screen dynamically.
- [x] Created "Personal Details" card with premium icons (User, Phone, Envelope, Location markers).

### Header Improvements
- [x] Sub-page headers (`showBack=true`) no longer show the OMS logo or profile icon — shows only back arrow + screen title.
- [x] Welcome strip reads dynamic name from Zustand store (from API profile fetch).
- [x] Removed duplicate notification bell icon from header.
- [x] Removed `UserCircleIcon` from welcome strip for cleaner look.

### API Service Layer
- [x] Created `services/api.ts` — Axios instance with:
  - `baseURL` from `EXPO_PUBLIC_API_URL` env variable, with hardcoded fallback URL.
  - Request interceptor to automatically attach Bearer token from AsyncStorage (or `localStorage` on Web).
  - Token helpers: `storeToken` → `setStoredToken`, `getStoredToken`, `removeStoredToken`.

---

## In Progress

- [ ] In-App Notifications History screen (API integration pending).

---

## Pending / Next Steps

- [ ] Help & Support screen (backend support pending — currently hidden).
- [ ] GPS / Use Current Location integration in complaint location step.
- [ ] Push Notifications setup.
- [ ] Profile photo upload API (if backend provides endpoint).
- [ ] End-to-end testing on physical Android device.
- [ ] Production build and APK generation.
