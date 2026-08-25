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
| Package Manager | pnpm only |

## Project Architecture

```
oms-mobile-app/
├── app/                  # Expo Router screens and layouts
│   ├── _layout.tsx       # Root stack navigator
│   ├── index.tsx         # Redirect entry point
│   ├── login.tsx         # Login + OTP screen
│   ├── home.tsx          # Main dashboard
│   └── complaint/        # Complaint registration wizard
│       ├── category.tsx  # Step 1 - Category selection
│       ├── details.tsx   # Step 2 - Title, Description, Priority
│       └── location.tsx  # Step 3 - Address and Location
├── components/           # Reusable generic UI components
│   ├── Header.tsx
│   ├── BottomNavigation.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dropdown.tsx
│   └── Card.tsx
├── constants/
│   └── Colors.ts         # Design token values (JS reference for icons)
├── assets/               # Static images and fonts
└── global.css            # Tailwind CSS theme tokens
```

## Coding Standards

1. **TypeScript**: All new files must use `.tsx` or `.ts`. Avoid `any`.
2. **Styling**: Use NativeWind Tailwind classes only. No inline `style={}` props unless overriding a native rendering bug (e.g., exact image dimensions).
3. **Colors**: Never hardcode colors like `#ffffff`. Use theme token classes (`text-text`, `bg-primary`, `text-muted`, etc.) defined in `global.css`.
4. **Components**: Keep components small, reusable, and single-purpose. New UI patterns must be extracted to `components/`.
5. **Imports**: Use absolute path alias `@/` for all internal imports (e.g., `@/components/Button`, `@/constants/Colors`).

## Component Rules

- **Button**: Supports `primary`, `secondary`, `outline` variants and optional `leftIcon` prop.
- **Input**: Supports `label`, `error`, `leftIcon`, and `multiline` props. Uses `TouchableOpacity` wrapper for reliable mobile keyboard focus.
- **Dropdown**: Inline popover dropdown. Accepts `label`, `value`, `options[]`, `placeholder`, and `onSelect` props.
- **Card**: Polymorphic component with `complaint`, `quick`, and `recent` variants.
- **Header**: Displays app branding on the left and user avatar on the right.
- **BottomNavigation**: Four tabs — Home, Complaints, Notifications, Profile.

## Naming Conventions

- Screen files: `camelCase.tsx` (e.g., `home.tsx`, `category.tsx`)
- Component files: `PascalCase.tsx` (e.g., `Button.tsx`, `Input.tsx`)
- Exported functions: `PascalCase` (e.g., `export function Button(...)`)
- Constants: `UPPER_SNAKE_CASE` for static data arrays (e.g., `CATEGORIES`, `WARDS`)

## Dependency Rules

- Only use `pnpm` as the package manager.
- No backend/API integration without prior discussion and approval.
- No new third-party UI libraries without approval.
