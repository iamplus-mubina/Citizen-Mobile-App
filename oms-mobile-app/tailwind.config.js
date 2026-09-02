/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        dark: 'var(--color-text)',
        muted: 'var(--color-muted)',
        secondary: 'var(--color-secondary)',
        'secondary-text': 'var(--color-secondary-text)',
        border: 'var(--color-border)',
        'input-bg': 'var(--color-input-bg)',
        error: 'var(--color-error)',
        'on-primary': 'var(--color-on-primary)',
        checkmark: 'var(--color-checkmark)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        teal: 'var(--color-teal)',
        'header-bg': 'var(--color-header-bg)',
        'icon-muted': 'var(--color-icon-muted)',
        'primary-light': 'var(--color-primary-light)',
        'warning-light': 'var(--color-warning-light)',
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        inter: ["Inter_400Regular"],
        "inter-regular": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
      }
    },
  },
  plugins: [],
}
