# Progress Report

## Current Status
**Project Phase**: Frontend Foundation & Login/OTP Setup Complete.

## Completed Tasks
- [x] Initialized Expo Router structure.
- [x] Installed NativeWind v4 & Tailwind CSS.
- [x] Configured absolute path aliases (`@/*`).
- [x] Installed `react-native-heroicons` & `react-native-svg` for vector icons.
- [x] Configured custom Google Inter font assets (Regular, Medium, SemiBold, Bold) to load asynchronously.
- [x] Formulated theme design color tokens (primary, secondary, background, text, error, muted, etc.) to support theme customization.
- [x] Created `login.tsx` route with redirect from root `index.tsx`.
- [x] Configured input constraints (numeric-only, 10-digit limit, error state) and left phone icon.
- [x] Built OTP verification flow (6 digit boxes, back navigation, countdown timer, resend button).
- [x] Adjusted viewport to handle desktop screen layouts responsibly (`w-full max-w-md mx-auto` centering).
- [x] Fixed mobile keyboard overlap via `KeyboardAvoidingView` (bypassed on web).
- [x] Corrected Metro package symlinking error on PNPM via hoisted node-linker configuration.
- [x] Added type declarations for `.png` imports inside `app.d.ts`.
- [x] Created onboarding Splash Screen inside `login.tsx` with circular logo, paging dots, version label, and touch swipe gesture transition.
- [x] Created reusable Header component containing Menu and Notification icons.
- [x] Built Home Dashboard route screen (`home.tsx`) and integrated router redirection upon OTP verification.
- [x] Created custom BottomNavigation component with active tab highlights and integrated tab selection inside `home.tsx`.
- [x] Built the mockup-aligned Home Dashboard screen containing the Greeting header, Register Complaint trigger card, Quick Action button grids, and Recent Complaint status lists.
- [x] Refactored home screen widgets into a single polymorphic `Card` component supporting `complaint`, `quick`, and `recent` variants.
- [x] Implemented getFormattedDate helper function to display dynamic current date on the dashboard.

## Next Steps
- [ ] Implement backend API integration to send and verify OTP.
- [ ] Connect authentication state to Zustand store (`useAppStore`).
- [ ] Build sub-pages for Complaints, Notifications, and Profile tabs.
