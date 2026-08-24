# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Integrated `@expo-google-fonts/inter` to load Inter fonts asynchronously with splash screen management in root layout.
- Configured custom font family mappings in `tailwind.config.js` (`font-inter`, `font-inter-medium`, `font-inter-semibold`, `font-inter-bold`).
- Integrated `react-native-heroicons` and `react-native-svg` for vectorized icons.
- Created theme color tokens inside `global.css` (`--color-primary`, `--color-background`, `--color-text`, `--color-muted`, `--color-secondary`, `--color-secondary-text`, `--color-border`, `--color-input-bg`, `--color-error`, `--color-on-primary`) and mapped them inside Tailwind.
- Configured `node-linker=hoisted` inside `.npmrc` to flatten node_modules and solve Metro bundler symlink errors on PNPM.
- Added wildcard typescript declaration for `*.png` inside `app.d.ts` to allow static image imports.
- Built responsive Mobile Login Screen (`login.tsx`) and set root path (`index.tsx`) to redirect to `/login`.
- Added numeric-only input validation, 10-digit limit, and left phone icon inside Mobile Number Input.
- Added OTP verification step containing 6 rounded digit boxes, active back navigation arrow, and countdown timer.
- Added "New user? / Register Now" text section below the submit buttons.
- Fixed keyboard overlapping with `KeyboardAvoidingView` on iOS/Android (bypassed on Web to allow text input).
- Positioned the OMS logo at the top of the header, resolving scale problems on Web via inline size styles.

### Changed
- Refactored `Button`, `Input`, and `login` screen layout styles to strictly use custom typography styles (`font-inter-*`) and design color tokens instead of hardcoded classes.
