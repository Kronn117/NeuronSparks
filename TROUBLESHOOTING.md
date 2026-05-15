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
