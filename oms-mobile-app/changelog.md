# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Integrated `@expo-google-fonts/inter` to load Inter fonts asynchronously with splash screen management in root layout.
- Configured custom font family mappings in `tailwind.config.js` (`font-inter`, `font-inter-medium`, `font-inter-semibold`, `font-inter-bold`).
- Integrated `react-native-heroicons` and `react-native-svg` for vectorized icons.
- Created theme color tokens inside `global.css` and mapped them inside Tailwind (`--color-primary`, `--color-background`, `--color-text`, `--color-muted`, etc.).
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
- Built the Home screen dashboard: greeting section, Register Complaint card, Quick Actions 2x2 grid, and Recent Complaints list.
- Created polymorphic `Card` component supporting `complaint`, `quick`, and `recent` variants.
- Added `getFormattedDate` utility for dynamic date display.
- Built Register Complaint wizard Step 1 (`complaint/category.tsx`) — category selection with radio buttons and disabled Next guard.
- Built Register Complaint wizard Step 2 (`complaint/details.tsx`) — Complaint Title, Description textarea, and Priority radio selection.
- Built Register Complaint wizard Step 3 (`complaint/location.tsx`) — Address, Area, Ward dropdown, Pincode, and "Use Current Location" button.
- Created reusable `Dropdown` component with inline popover list, selected state highlight, and check icon.

- Built Register Complaint wizard Step 4 (`complaint/attachments.tsx`) with a dashed border upload button featuring an upload icon when empty, and previews + Add More once populated.
- Built Register Complaint wizard Step 5 (`complaint/review.tsx`) with Web-compatible Custom Modal confirmation.
- Built Complaint Submitted Success screen (`complaint/success.tsx`) using dashed input box design.
- Created `store/useComplaintStore.ts` using Zustand to manage global complaint state across the wizard.
- Installed `expo-image-picker` dependency and created cross-platform `UploadModal` component supporting Take Photo (Camera) and Choose Gallery (Media Library) inputs across Web, Android, and iOS.
- Installed `expo-document-picker` dependency and integrated file uploading capability on the attachments page.
- Connected submitted complaints dynamically to the Home screen dashboard from the global Zustand store, updating it upon successful submission.
- Integrated profile photo upload and preview inside the Profile screen (`components/Profile.tsx`) using the custom `UploadModal`.
- Connected profile photo state to global Zustand store to maintain selections across screens and dynamically update the top Header avatar component.
- Connected citizen phone number dynamically to the Profile screen (`components/Profile.tsx`), saving the value entered during OTP verification.
- Created dynamic "Personal Details" card displaying Name, Phone, Email, Address, and Pincode on the Profile screen, featuring a Pencil Edit Icon to edit and update fields in the Zustand store.
- Added custom premium icons (User, Phone, Envelope, Location markers) next to each detail row inside the Profile screen "Personal Details" card.
- Updated `BottomNavigation` component to show solid-filled icons when a tab is active, and styled the active states with the warm orange-mustard brand color (`#d97706`).
- Added `--color-white` token to `global.css` and `Colors.ts`.

### Changed
- Refactored `Button`, `Input`, and `login` screen styles to use `font-inter-*` typography classes and design color tokens only.
- Refactored `Header` to remove hamburger/notification icons; replaced with app branding and right-aligned user avatar.
- Removed Address, About App, and Change Password menu fields from Profile screen (`components/Profile.tsx`).
- Updated `Input` to support `multiline` textareas with top-aligned text and minimum height.
- Updated `Input` to wrap `TextInput` in `TouchableOpacity` with `ref` focus for reliable keyboard activation on physical Android devices.
- Updated `Button` component to support an optional `leftIcon` prop, and added a custom `logout` button variant (warm orange-mustard `#d97706` background with pill-shaped `rounded-full` layout).
- Updated `SafeAreaView` in `home.tsx` to include `edges={['top', 'bottom']}`, resolving Bottom Navigation overlap on Android.

### Fixed
- OTP input boxes not responding to touch on physical Android in Expo Go — resolved by overlaying a full-width invisible `TextInput` over the digit boxes with `autoFocus`.
- Description textarea not opening keyboard on mobile — resolved via `TouchableOpacity` wrapper and `ref.focus()` in `Input` component.
- Bottom Navigation bar overlapping page content on Android — resolved by using `edges={['top', 'bottom']}` on `SafeAreaView`.
- Fixed `Alert.alert` silently failing on Web by implementing a custom React Native `Modal` fallback inside `review.tsx`.
