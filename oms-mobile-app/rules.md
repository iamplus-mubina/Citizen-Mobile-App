# Project Rules and Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo (React Native) with Expo Router |
| Language | TypeScript (strict mode) |
| Styling | NativeWind v4 (Tailwind CSS utility classes) |
| Icons | react-native-heroicons + react-native-svg |
| Fonts | @expo-google-fonts/inter |
| Navigation | Expo Router (file-based routing) |
| State | Zustand |
| HTTP Client | Axios (via `services/api.ts`) |
| Storage | AsyncStorage (`@react-native-async-storage/async-storage`) |
| Package Manager | pnpm only |

## Project Architecture

```
oms-mobile-app/
├── app/                          # Expo Router screens and layouts
│   ├── _layout.tsx               # Root stack navigator
│   ├── index.tsx                 # Redirect entry point
│   ├── login.tsx                 # Login + OTP screen (API-integrated)
│   ├── register.tsx              # New Citizen Registration screen (API-integrated)
│   ├── pending-approval.tsx      # Pending approval screen (post-registration)
│   ├── no-internet.tsx           # No internet error fallback screen
│   ├── error.tsx                 # Generic error fallback screen
│   ├── help.tsx                  # Help & Support screen (currently hidden/commented out)
│   ├── home.tsx                  # Main dashboard (API-integrated)
│   ├── complaint/                # Complaint registration wizard
│   │   ├── category.tsx          # Step 1 - Category selection (API-integrated)
│   │   ├── details.tsx           # Step 2 - Title, Description
│   │   ├── location.tsx          # Step 3 - Address, Area, Pincode
│   │   ├── attachments.tsx       # Step 4 - Photo/Document upload (API-integrated)
│   │   ├── review.tsx            # Step 5 - Review and Submit (API-integrated)
│   │   ├── success.tsx           # Submission confirmation screen
│   │   └── timeline/
│   │       └── [id].tsx          # Complaint Status Timeline Tracker (API-integrated)
│   ├── updates/
│   │   ├── index.tsx             # City Updates list (API-integrated)
│   │   └── [id].tsx              # City Update Detail with image carousel & lightbox (API-integrated)
│   └── profile/
│       └── edit.tsx              # Edit Profile screen (API-integrated)
├── components/                   # Reusable generic UI components
│   ├── Header.tsx                # App header (OMS logo + dynamic welcome text strip)
│   ├── BottomNavigation.tsx      # 4-tab bottom navigation
│   ├── Button.tsx                # Primary/secondary/outline button
│   ├── Input.tsx                 # Text input with label, error, multiline support
│   ├── Dropdown.tsx              # Inline popover dropdown with search
│   ├── Card.tsx                  # Polymorphic: complaint / quick / recent variants
│   ├── FormStepper.tsx           # Step progress indicator for complaint wizard
│   ├── AlertModal.tsx            # Cross-platform alert modal (Web fallback)
│   ├── Tabs.tsx                  # Reusable tab strip with active counts
│   ├── UploadModal.tsx           # Camera / Gallery image picker modal
│   ├── MyComplaints.tsx          # My Complaints tab content (API-integrated)
│   ├── Notifications.tsx         # Notifications tab content
│   ├── Profile.tsx               # Profile tab content (API-integrated)
│   ├── Stepper.tsx               # Horizontal stepper component
│   └── StepperTimeline.tsx       # Vertical timeline stepper for complaint tracking
├── services/
│   └── api.ts                    # Axios instance with token interceptor and AsyncStorage helpers
├── store/
│   └── useComplaintStore.ts      # Zustand global store (form state, profile, complaints)
├── constants/
│   └── Colors.ts                 # Design token values (JS reference for icons)
├── assets/                       # Static images and fonts
└── global.css                    # Tailwind CSS theme tokens
```

## Backend API Base URL

The API base URL is configured inside `services/api.ts`:
- Primary: read from `EXPO_PUBLIC_API_URL` environment variable in `.env`
- Fallback: `https://mn-0042-api.digitaloms.in` (hardcoded if env var is missing)

All authenticated requests automatically attach a Bearer token from AsyncStorage (or `localStorage` on Web) via an Axios request interceptor. Token helpers exported: `getStoredToken`, `setStoredToken`, `removeStoredToken`.

## Coding Standards

1. **TypeScript**: All new files must use `.tsx` or `.ts`. Avoid `any` where possible.
2. **Styling**: Use NativeWind Tailwind classes only. No inline `style={}` props unless overriding a native rendering bug (e.g., exact image dimensions).
3. **Colors**: Never hardcode colors like `#ffffff`. Use theme token classes (`text-dark`, `bg-primary`, `text-muted`, etc.) defined in `global.css`.
4. **Components**: Keep components small, reusable, and single-purpose. New UI patterns must be extracted to `components/`.
5. **Imports**: Use absolute path alias `@/` for all internal imports (e.g., `@/components/Button`, `@/constants/Colors`).
6. **API Calls**: All HTTP calls must go through `services/api.ts`. Never use `fetch()` directly.
7. **State Management**: All shared/global state must go through Zustand (`store/useComplaintStore.ts`).
8. **Persistence**: Use AsyncStorage for token and user photo persistence only. All other app state lives in Zustand.

## Component Rules

- **Button**: Supports `primary`, `secondary`, `outline` variants and optional `leftIcon` prop.
- **Input**: Supports `label`, `error`, `leftIcon`, and `multiline` props. Uses `TouchableOpacity` wrapper for reliable mobile keyboard focus.
- **Dropdown**: Inline popover dropdown with search. Accepts `label`, `value`, `options[]`, `placeholder`, and `onSelect` props.
- **Card**: Polymorphic component with `complaint`, `quick`, and `recent` variants.
- **Header**: Shows OMS logo + app name on the left with dynamic welcome text strip (citizen name) below. On sub-screens (`showBack=true`), shows only back arrow and screen title — no logo, no profile icon.
- **BottomNavigation**: Four tabs — Home, Complaints, Notifications, Profile. Updates tab navigates to `/updates` route via `router.push`.
- **AlertModal**: Cross-platform modal used in `review.tsx` as fallback for `Alert.alert` on Web platform.
- **FormStepper**: Step progress bar used across the complaint wizard (steps 1–5).

## Naming Conventions

- Screen files: `camelCase.tsx` (e.g., `home.tsx`, `category.tsx`)
- Component files: `PascalCase.tsx` (e.g., `Button.tsx`, `Input.tsx`)
- Exported functions: `PascalCase` (e.g., `export function Button(...)`)
- Constants: `UPPER_SNAKE_CASE` for static data arrays (e.g., `CATEGORIES`)

## Dependency Rules

- Only use `pnpm` as the package manager.
- No new third-party UI libraries without approval.
- All API endpoints must be tested in Postman/backend before integration.

## Feature Visibility Rules (UI Toggles)

Some features are temporarily hidden using JSX comments. Do **not** delete them — only comment/uncomment as needed:

| Feature | File | Status |
|---|---|---|
| Help & Support card | `app/home.tsx` | Commented out — pending backend support |
| Use Current Location button | `app/complaint/location.tsx` | Commented out — pending GPS integration |
| UserCircleIcon in header welcome strip | `components/Header.tsx` | Commented out — design decision |
