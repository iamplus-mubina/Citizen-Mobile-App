# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Complete frontend foundation setup.
- Configured Expo SDK 54 with Expo Router.
- Integrated NativeWind v4 (Tailwind CSS).
- Added Zustand state management.
- Set up custom UI components (`Button`, `Header`, `Screen`).
- Added strict `pnpm` usage enforcement.
- Fixed `react-native-css-interop` dependency resolution for PNPM.

### Changed
- Refactored `package.json` to lock Expo at `~54.0.0` and aligned peer dependencies.
- Downgraded/aligned `@expo/metro-runtime` to `6.1.2` for compatibility.

### Fixed
- Bypassed Expo CLI `TypeError: Body is unusable` bug via `.env` configuration.
