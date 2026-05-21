# Troubleshooting

## App Won't Start

- Run `npx expo start --clear`
- Delete `node_modules` and `package-lock.json` and reinstall
- Confirm Node 20.19.4 or newer is used
- Verify `package.json` scripts reference Expo correctly
- Use local CLI invocation: `npm run start` instead of a global `expo` command

## Notes Not Persisting

- Confirm AsyncStorage writes succeed
- Check the storage key used by the app
- Restart the app and verify load logic

## Search Not Working

- Verify search query is passed to the search service
- Check tag filter behavior
- Confirm search is case-insensitive if expected

## UI Layout Issues

- Use SafeAreaProvider for notches
- Verify flex layout and screen constraints
- Test small and large devices

## Build Failures

- Run `npm run lint` and fix issues
- Confirm Expo SDK and React Native versions are compatible
- Check for missing dependency versions
- Verify Node.js is v20.19.4 or newer for Expo SDK 55

## Common Commands

- `npm run lint`
- `npm run test`
- `npm run web`
- `expo start --clear`

## Recent Fixes

### Files repaired

- `src/components/NoteCard.js`
- `src/screens/HomeScreen.js`
- `src/navigation/RootNavigator.js`

### Errors found

- Malformed JSX syntax due to stray `<` / `>` tokens and badly formatted component return blocks.
- Invalid optional chaining syntax such as `onDelete ? .(note.id)` and `route.params ? .note ? .title`.
- Duplicate `export default HomeScreen;` and trailing invalid closure in `HomeScreen.js`.
- Broken `FlatList` and component render markup caused by incorrectly split JSX.

### Fixes applied

- Rewrote the broken JSX render blocks into valid React Native component structure.
- Converted broken optional chaining to valid syntax: `onDelete?.(note.id)`, `onTogglePin?.(note.id)`, and `route?.params?.note?.title`.
- Removed duplicate export and dead trailing code from `HomeScreen.js`.
- Restored consistent indentation and closing tags for `View`, `Text`, `TouchableOpacity`, and other layout elements.

### Methods used

- Inspected source files directly with `read_file`.
- Searched for malformed JSX and broken optional chaining patterns using text search.
- Applied repairs using targeted string replacements in the affected files.
- Validated the changes with `npm run lint` and `npx eslint src/components/NoteCard.js src/screens/HomeScreen.js src/navigation/RootNavigator.js`.

### Current status

- The repaired files now pass targeted ESLint validation.
- A full project lint run still shows unrelated existing issues in other files, but the main startup-critical screen components are fixed.

## Theme Development Session Fixes

### Errors encountered

- **"startFloating is not a function"** - Hook destructuring error in HomeScreen.js
- **"(0 , _ThemeContext.useTheme) is not a function"** - Missing useTheme custom hook export
- **Java version incompatibility** - JDK 25 too new for React Native Gradle plugin
- **Color literal lint error** - Hardcoded color `#00D4FF` in CreateScreen.js
- **Duplicate style key 'content'** - Conflicting style property in DetailScreen.js
- **Unnecessary else after return** - ESLint error in theme.js getThemeShadows function
- **Port 8081 conflict** - Port already in use by another process

### Fixes applied

- Fixed useFloating hook destructuring in HomeScreen.js by correctly extracting startFloating
- Added useTheme custom hook export to ThemeContext.js with useContext and error handling
- Uninstalled JDK 25 and installed JDK 17 for React Native compatibility
- Replaced hardcoded color `#00D4FF` with `THEME.colors.primary` in CreateScreen.js
- Renamed duplicate style key from 'content' to 'contentText' in DetailScreen.js
- Removed unnecessary else statement after return in theme.js getThemeShadows function
- Switched Expo dev server to port 8082 to avoid conflict

### Methods used

- Used `read_file` to inspect affected components and identify error sources
- Applied targeted string replacements with `edit` tool for precise fixes
- Ran `npm run lint` to validate fixes and identify remaining issues
- Checked Java version with `java -version` to diagnose compatibility issues
- Used `npx expo prebuild` to generate native code for APK building
- Built APK with Gradle: `./gradlew clean && ./gradlew assembleRelease`
- Renamed APK file with `mv` command for versioned naming

## Theme Development Commands

- `npx expo start --port 8082` - Start dev server on specific port
- `npx expo prebuild` - Generate native Android/iOS code
- `cd android && ./gradlew clean` - Clean Gradle build
- `cd android && ./gradlew assembleRelease` - Build release APK
- `java -version` - Check Java version (requires JDK 17 for React Native)

## Settings, Mobile Layout, and Theme Fixes

### Errors encountered

- **Clear All Notes always shows "No notes to delete"** — `SettingsScreen` read `stats.allNotes` from `getStatistics()`, but that function only returns counts, not note objects or IDs.
- **Export Notes does nothing** — Handler was a placeholder alert ("Export functionality coming soon"); `ExportService` existed but was never wired from the UI.
- **Duplicate "Settings" headers** — Stack navigator showed a native header while `SettingsScreen` also rendered a custom header with the same title (same issue on Create, Archive, and Detail).
- **Content clips under status bar on phones** — Screens used React Native's `SafeAreaView` instead of `react-native-safe-area-context`, despite `SafeAreaProvider` being configured in `App.js`.
- **FAB overlaps home indicator** — Fixed bottom positioning with no safe-area inset.
- **Light mode not appealing / theme confusion** — Multiple theme toggles (Home header, Settings header, Settings list) allowed switching to a poorly styled light palette; status bar did not follow theme consistently.

### Fixes applied

- **Clear All Notes:** Use `notes.map(n => n.id)` from `useNotes()` context and pass IDs to `deleteMultiple()`.
- **Export Notes:** Installed `expo-file-system` and `expo-sharing`; wired `ExportService.exportToJSON()`, write to cache, open native share sheet; fallback to React Native `Share` API on platforms without file sharing.
- **Duplicate headers:** Set `headerShown: false` on Settings, Create, Archive, and Detail in `RootNavigator.js`.
- **Safe area:** Added `ScreenContainer` component using `SafeAreaView` from `react-native-safe-area-context`; migrated all screens to use it.
- **FAB / list padding:** Added `bottom` prop to `FAB`; HomeScreen uses `useSafeAreaInsets()` for FAB position and FlatList bottom padding.
- **Dark mode locked:** Removed all theme toggles from Home and Settings; `ThemeContext` always uses dark mode and migrates stored light preference back to dark.
- **Android status bar:** Updated `android/app/src/main/res/values/styles.xml` `statusBarColor` to `#0D1117` to match dark theme `bg_dark`.

### Files repaired

- `src/screens/SettingsScreen.js`
- `src/screens/HomeScreen.js`
- `src/screens/SearchScreen.js`
- `src/screens/CreateScreen.js`
- `src/screens/ArchiveScreen.js`
- `src/screens/DetailScreen.js`
- `src/navigation/RootNavigator.js`
- `src/context/ThemeContext.js`
- `src/components/ScreenContainer.js` (new)
- `src/components/FAB.js`
- `src/components/index.js`
- `android/app/src/main/res/values/styles.xml`
- `package.json` (added `expo-file-system`, `expo-sharing`)

### Methods used

- Inspected source files with `read_file` and codebase search (`grep`) to trace broken handlers and layout patterns.
- Compared `getStatistics()` return shape against SettingsScreen usage to identify the Clear All Notes bug.
- Verified `ExportService` was implemented but unreferenced; added file write + share flow with Expo modules.
- Created a shared `ScreenContainer` wrapper to apply consistent safe-area insets across screens.
- Used `useSafeAreaInsets()` for dynamic FAB and scroll content bottom padding on notched devices.
- Ran `npx expo install expo-file-system expo-sharing` for SDK-compatible dependencies.
- Validated changes with `npm run lint`.

### Current status

- Clear All Notes and Export Notes are functional from Settings.
- Settings shows a single header (no duplicate title/back affordance).
- App content respects top and bottom safe areas on phone-sized screens.
- Theme is locked to dark mode with no user-facing toggle.

