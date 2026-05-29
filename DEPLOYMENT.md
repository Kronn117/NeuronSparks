# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Lint passes
- [ ] No console errors
- [ ] Documentation updated
- [ ] Version numbers updated

## Expo Deployment

### Local preview

- `npm run web`
- `expo run:ios`
- `expo run:android`

### Build for production

- `eas build --platform android --profile production`
- `eas build --platform ios --profile production`

> When building locally for Android, the release APK is generated in `android/app/build/outputs/apk/release/app-release.apk`.

## App Store Release

1. Update `app.json` version and build metadata
2. Build with EAS
3. Upload to App Store Connect
4. Submit for review
5. Monitor release status

## Play Store Release

1. Update `app.json` version and build metadata
2. Build Android AAB with EAS
3. Upload to Google Play Console
4. Submit and review
5. Monitor release status

## Post-Release

- Monitor user feedback
- Track crashes and analytics
- Publish updates as needed
