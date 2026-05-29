module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        '/node_modules/(?!(@react-native|react-native|@react-native-async-storage|@react-navigation|react-native-reanimated|expo|expo-modules-core|expo-file-system|expo-sharing|expo-asset|expo-constants)/)'
    ],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};