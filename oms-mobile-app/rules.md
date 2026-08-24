# Project Rules and Guidelines

## Coding Standards
1. Use TypeScript for all new code.
2. Ensure strict type safety; avoid using `any` unless absolutely necessary.
3. Use Tailwind CSS via NativeWind v4 utility classes for styling. Do not use the `style` prop (inline styles).
4. Do not use hardcoded colors (like `#ffffff` or `rgb(...)`) directly. Use theme tokens defined in the Tailwind configuration where possible, though absolute system neutrals like `text-white`, `text-black`, `bg-white`, and `bg-black` are permitted.
5. Keep components small, reusable, and single-purpose.

## Architecture
- `app/`: Expo Router screens and layouts.
- `components/`: Reusable, generic UI components.
- `store/`: Zustand state management.
- `constants/`: Theme colors and configuration data.
- `assets/`: Static assets like images and fonts.

## Dependencies
- Only use `pnpm` as the package manager.
- No backend/API integrations without prior discussion.
