# System Architecture

## Technology Stack

- React Native 0.71.8
- Expo SDK 48
- React Navigation v6
- AsyncStorage for persistence
- Context API for global state
- Jest for tests

## Directory Structure

- `App.js`
- `src/components/`
- `src/context/`
- `src/navigation/`
- `src/screens/`
- `src/services/`
- `src/utils/`

## State Management

The app uses Context Providers to manage note state, search state, theming, and settings.

### Core domains

- Notes
- Search
- Theme
- Settings

## Navigation

Root navigator wraps the app and includes:

- `HomeScreen`
- `SearchScreen`
- `CreateModal`
- `DetailScreen`
- `SettingsScreen`

## Persistence Layer

- `AsyncStorage` stores notes and settings
- Data is serialized in JSON
- Storage is loaded on app startup and saved after note updates

## Component Hierarchy

HomeScreen
- Header
- StatsBar
- FlatList of NoteCard
- FAB

CreateModal
- TextInput for title
- TextInput for content
- Tag selector
- Color selector
- Save button

DetailScreen
- Note display
- Edit and Delete actions

## Testing Strategy

- Unit tests for business logic and validation
- Integration tests for core note workflows
- Manual functional verification for mobile device UX
