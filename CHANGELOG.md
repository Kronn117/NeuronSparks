# Changelog

## [1.0.0] - 2026-05-13

### Added
- Initial Neuron Sparks mobile application
- Note CRUD operations
- Search, pin, and tag management
- AsyncStorage persistence
- Mobile UI with Expo and React Native
- Verification and documentation framework

## [1.0.3] - 2026-05-29

### Fixed
- Hardened Android startup flow for the `app-release.apk` build
- Fixed splash screen startup to call `super.onCreate(savedInstanceState)` in `MainActivity.kt`
- Added safer release initialization handling in `App.js` with error reporting for font or startup failures
- Updated release docs and troubleshooting guidance for Android startup crash diagnosis
