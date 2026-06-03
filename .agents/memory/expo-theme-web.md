---
name: Expo theme dark-mode on web
description: Appearance.setColorScheme is not available on React Native Web; use a React context for theme state instead of relying on useColorScheme() or Appearance.
---

## Rule
Never call `Appearance.setColorScheme()` at module level or unconditionally — it crashes on web (`Appearance.default.setColorScheme is not a function`).

**Why:** React Native Web does not implement `Appearance.setColorScheme`. Calling it at module load time (outside a component) crashes the entire app on web before any component renders.

**How to apply:**
- Create a `ThemeContext` that owns `theme: 'light' | 'dark'` state, initialized to `'dark'`.
- Load the saved preference from AsyncStorage in a `useEffect` inside the provider.
- Guard native calls: `if (Platform.OS !== 'web') Appearance.setColorScheme(t)`.
- Have `useColors()` read from `useTheme()` (the ThemeContext) instead of `useColorScheme()`.
- This pattern works identically on iOS, Android, and web without any platform-specific branching in consumers.
