# Changelog

All notable changes to this project will be documented in this file.
Format: `[Date] - Commit message — Files changed`

---

## [08 Sep 2026]

### Removed
- Removed **Priority selection** (Low / Medium / High radio buttons) from Complaint Details step (`app/complaint/details.tsx`) to simplify the complaint form.
- Removed **Ward dropdown** from Complaint Location step (`app/complaint/location.tsx`) to simplify the form; ward validation also removed from `handleNext`.

### Changed
- Removed `UserCircleIcon` from header welcome strip (`components/Header.tsx`). Welcome text now displays without any icon for a cleaner look.
- Profile photo picked in Profile tab is now persisted to `AsyncStorage` (`user_profile_photo` key) so it survives app restarts (`components/Profile.tsx`).

---

## [07 Sep 2026]

### Added
- Integrated **City Updates List API** (`GET /updates/citizen/list`) into `app/updates/index.tsx`:
  - Fetches real updates from backend with a multi-endpoint fallback strategy.
  - Shows thumbnail image from API if available; falls back to a `MegaphoneIcon` placeholder.
  - Formatted date display (e.g., `07 Sep 2026`).
  - Passes `imageUrl` to detail screen via router params to eliminate transition flicker.
- Integrated **City Update Detail API** (`GET /updates/:id`) into `app/updates/[id].tsx`:
  - Full-page paging image carousel with `1/N` counter badge and pagination dot indicator.
  - Fullscreen image lightbox modal on tap.
  - Formatted date + time display (e.g., `07 Sep 2026 • 4:13 PM`).
  - Removed duplicate bottom photo grid section.
- Hid **Help & Support** Quick Action card in `app/home.tsx` (commented out in JSX).
- Removed duplicate **Track Status** card from Quick Actions in `app/home.tsx`.
- Removed duplicate **notification bell icon** from `Header.tsx` top area.
- Commented out **Use Current Location** button in `app/complaint/location.tsx`.
- Removed dummy **profile icon** from sub-page headers when `showBack` is true in `components/Header.tsx`.

### Changed
- Header welcome strip in `components/Header.tsx` now reads `profileName` from Zustand store (dynamic name from API), replacing the static `'Rahul Sharma'` placeholder.
- `app/home.tsx` now loads saved profile photo from `AsyncStorage` on mount and saves API-returned profile image fields (`profileImage`, `photoUrl`, `avatarUrl`, `profilePhoto`) to the store.

---

## [04 Sep 2026]

### Added
- Integrated **photo and document upload API** in `app/complaint/attachments.tsx`:
  - Photos upload to `POST /citizen/complaints/upload-photo` (multipart/form-data).
  - Documents upload to `POST /citizen/complaints/upload-document` (multipart/form-data).
  - Upload IDs returned by the API are stored in Zustand for submission.

### Integrated (API)
- **Auth**: OTP send (`POST /citizen/auth/send-otp`), OTP verify (`POST /citizen/auth/verify-otp`), Register (`POST /citizen/auth/register`), Logout (`POST /citizen/auth/logout`) — `app/login.tsx`, `app/register.tsx`.
- **Profile**: Fetch (`GET /citizen/profile`), Update (`PUT /citizen/profile`) — `app/home.tsx`, `app/profile/edit.tsx`, `components/Profile.tsx`.
- **Complaints**: My Complaints list (`POST /citizen/complaints/my-complaints`), Submit (`POST /citizen/complaints/submit`), Timeline (`GET /citizen/complaints/track/:id`) — `app/home.tsx`, `app/complaint/review.tsx`, `app/complaint/timeline/[id].tsx`.
- **Categories**: Dynamic category list (`GET /category`) — `app/complaint/category.tsx`.
- **Location**: Prabhag/Ward list (`GET /prabhag`) — `app/complaint/location.tsx`.
- Created `services/api.ts`: Axios instance with `baseURL`, request interceptor to attach Bearer token from AsyncStorage, and token management helpers (`storeToken`, `getStoredToken`, `removeStoredToken`).

---

## [Earlier — Phase 1 & Phase 2 UI Build]

### Added
- Integrated `@expo-google-fonts/inter` to load Inter fonts asynchronously with splash screen management in root layout.
- Configured custom font family mappings in `tailwind.config.js` (`font-inter`, `font-inter-medium`, `font-inter-semibold`, `font-inter-bold`).
- Integrated `react-native-heroicons` and `react-native-svg` for vectorized icons.
- Created theme color tokens inside `global.css` and mapped them inside Tailwind (`--color-primary`, `--color-background`, `--color-text`, `--color-muted`, etc.)
- Configured `node-linker=hoisted` inside `.npmrc` to flatten node_modules and solve Metro bundler symlink errors on PNPM.
- Added wildcard typescript declaration for `*.png` inside `app.d.ts` to allow static image imports.
- Built responsive Mobile Login Screen (`login.tsx`) and set root path (`index.tsx`) to redirect to `/login`.
- Added numeric-only input validation, 10-digit limit, and left phone icon inside Mobile Number Input.
- Added OTP verification step containing 6 rounded digit boxes, active back navigation arrow, and countdown timer.
- Added "New user? / Register Now" text section below the submit buttons.
- Fixed keyboard overlapping with `KeyboardAvoidingView` on iOS/Android (bypassed on Web).
- Added onboarding Splash Screen step featuring circular logo, paging dots, and touch swipe transition gesture.
- Created reusable `Header` component.
- Built `app/home.tsx` and configured Root Layout stack with OTP redirect.
- Created `BottomNavigation` component with four tabs and active state highlights.
- Built the Home screen dashboard: Register Complaint card, Quick Actions 2x2 grid, and Recent Complaints list.
- Created polymorphic `Card` component supporting `complaint`, `quick`, and `recent` variants.
- Added `getFormattedDate` utility for dynamic date display.
- Built Register Complaint wizard Step 1 (`complaint/category.tsx`) — category selection with radio buttons and disabled Next guard.
- Built Register Complaint wizard Step 2 (`complaint/details.tsx`) — Complaint Title and Description textarea.
- Built Register Complaint wizard Step 3 (`complaint/location.tsx`) — Address, Area, Pincode.
- Created reusable `Dropdown` component with inline popover list, selected state highlight, and check icon.
- Built Register Complaint wizard Step 4 (`complaint/attachments.tsx`) with dashed border upload button and image/file previews.
- Built Register Complaint wizard Step 5 (`complaint/review.tsx`) with Web-compatible Custom Modal confirmation.
- Built Complaint Submitted Success screen (`complaint/success.tsx`).
- Created `store/useComplaintStore.ts` using Zustand to manage global complaint state across the wizard.
- Installed `expo-image-picker` and created cross-platform `UploadModal` component.
- Installed `expo-document-picker` and integrated file uploading capability.
- Connected submitted complaints dynamically to the Home screen dashboard from Zustand store.
- Integrated profile photo upload and preview inside Profile screen using `UploadModal`.
- Connected profile photo state to global Zustand store to update across screens.
- Connected citizen phone number dynamically to the Profile screen from login credentials.
- Created dynamic "Personal Details" card on Profile screen with Name, Phone, Email, Address, Pincode and Pencil Edit Icon.
- Added premium icons (User, Phone, Envelope, Location markers) inside Profile screen "Personal Details" card.
- Updated `BottomNavigation` to show solid-filled icons when a tab is active.
- Built error fallback screens: `no-internet.tsx`, `error.tsx`.
- Built `pending-approval.tsx` screen shown after new citizen registration.
- Created `register.tsx` new citizen registration form.
- Created `AlertModal.tsx` — reusable cross-platform modal component for web-safe alerts.
- Created `FormStepper.tsx` — step progress indicator for complaint wizard.
- Created `Stepper.tsx` and `StepperTimeline.tsx` — horizontal and vertical stepper components.
- Created `Notifications.tsx` — notifications tab content.
- Created `Tabs.tsx` — reusable tab strip supporting customizable labels, active states, and counts.
- Built `app/complaint/timeline/[id].tsx` — Complaint Status Timeline Tracker with API integration.
- Built `app/profile/edit.tsx` — Edit Profile screen with API integration.
- Built `app/updates/index.tsx` — City Updates list screen.
- Built `app/updates/[id].tsx` — City Update detail with image carousel and fullscreen lightbox.
- Built `app/help.tsx` — Help & Support screen (currently hidden).

### Changed
- Refactored `Button`, `Input`, and `login` screen styles to use `font-inter-*` typography classes and design color tokens only.
- Refactored `Header` to support app branding with OMS logo, dynamic welcome text strip, and back navigation for sub-screens.
- Removed the static "Good Morning, Rahul Sharma" greeting block from the home screen body.
- Mapped all custom icon colors to `icon-muted` CSS variable theme token (`#a5a4bf`).
- Removed Address, About App, and Change Password menu fields from Profile screen.
- Updated `Input` to support `multiline` textareas with top-aligned text and minimum height.
- Updated primary brand color (`--color-primary`) to warm gold-yellow (`#ffba01`) globally.
- Mapped `--color-text` to `text-dark` / `colors.dark` to avoid the `text-text` redundancy.
- Changed "Welcome" and "Enter OTP" text headers on Login screen to black.
- Created generic reusable `Tabs` component and integrated it into My Complaints dashboard.
- Updated My Complaints filter tabs to match mockup styling with dynamic counts.
- Updated Card component "recent" variant to use solid white background.
- Refactored Quick Actions cards container to prevent flexbox wrapping bugs on web.
- Updated `SafeAreaView` in `home.tsx` with `edges={['top', 'bottom']}` to resolve Android bottom nav overlap.

### Fixed
- OTP input boxes not responding to touch on physical Android in Expo Go.
- Description textarea not opening keyboard on mobile — resolved via `TouchableOpacity` wrapper and `ref.focus()`.
- Bottom Navigation bar overlapping page content on Android.
- `Alert.alert` silently failing on Web — implemented custom React Native `Modal` fallback inside `review.tsx`.
