# Progress Report

## Current Status
**Project Phase**: Phase 2 - Complaint Registration Wizard (In Progress)

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

### Home Dashboard
- [x] Created reusable `Header` component (app branding + user avatar).
- [x] Built `home.tsx` dashboard with router redirection upon OTP verification.
- [x] Created `BottomNavigation` component with 4 tabs and active state highlights.
- [x] Built Home Dashboard: Greeting, Register Complaint card, Quick Actions grid, Recent Complaints list.
- [x] Refactored home screen widgets into a single polymorphic `Card` component (`complaint`, `quick`, `recent` variants).
- [x] Implemented `getFormattedDate` helper for dynamic date display.
- [x] Fixed Bottom Navigation overlap on Android via `SafeAreaView` bottom edge.

### Complaint Registration Wizard
- [x] Built Step 1 — Category Selection (`complaint/category.tsx`) with radio buttons and disabled Next guard.
- [x] Built Step 2 — Complaint Details (`complaint/details.tsx`) with Title, Description textarea, and Priority selection.
- [x] Built Step 3 — Location (`complaint/location.tsx`) with Address, Area, Ward dropdown, Pincode, and Current Location button.
- [x] Built Step 4 — Attachments UI (`complaint/attachments.tsx`) with a dashed border upload button featuring an upload icon when empty, and previews + Add More once populated.
- [x] Built Step 5 — Review and Submit Complaint UI (`complaint/review.tsx`).
- [x] Built Complaint Submitted Successfully confirmation screen (`complaint/success.tsx`).
- [x] Created reusable `Dropdown` component with inline popover and selected state.
- [x] Created cross-platform `UploadModal` component using `expo-image-picker` to capture photos or pick gallery images across Web, Android, and iOS.
- [x] Updated `Input` component to support `multiline` textarea mode.
- [x] Updated `Input` component with `TouchableOpacity` focus fix for mobile keyboard activation.
- [x] Updated `Button` component with optional `leftIcon` support.
- [x] Configured Zustand store (`store/useComplaintStore.ts`) to manage wizard form state.
- [x] Integrated cross-platform document uploading using `expo-document-picker` inside `attachments.tsx`.
- [x] Connected submitted complaints dynamically to the Home screen dashboard list from the Zustand store.
- [x] Removed Address, About App, Change Password, and Language menu fields from Profile screen.
- [x] Integrated profile photo upload and edit triggers inside the Profile screen avatar using `UploadModal`.
- [x] Persisted profile photo state inside global Zustand store to maintain state across unmounts and update top Header avatar.
- [x] Connected citizen phone number dynamically to the Profile screen from the login credentials.
- [x] Created dynamic "Personal Details" card displaying Name, Phone, Email, Address, and Pincode on the Profile screen, featuring a Pencil Edit Icon to edit and update fields in the Zustand store.
- [x] Customized the Logout button with a pill-shaped rounded layout and warm orange-mustard branding color (`#d97706`).
- [x] Enhanced the "Personal Details" card on the Profile screen with premium icons (User, Phone, Envelope, and Location markers) for each field.
- [x] Customized the `BottomNavigation` component to show active tab icons in a solid style filled with the warm orange-mustard branding color (`#d97706`).

## In Progress
- [ ] My Complaints dashboard with tabs (All, Pending, In Progress, Resolved).

## Next Steps
- [ ] My Complaints dashboard with tabs (All, Pending, In Progress, Resolved).
- [ ] Complaint Details view and Status Tracking Timeline.
- [ ] In-App Notifications History screen.
- [ ] Citizen Profile view and Edit Profile screens.
- [ ] Help & Support, No Internet, and Error fallback screens.
- [ ] Backend API integration for OTP send/verify and Complaint submission.
- [ ] Connect authentication state to Zustand store.
