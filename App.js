import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { logger } from '@utils/logger';
import RootNavigator from '@navigation/RootNavigator';
import { THEME } from './src/utils/theme';
import { NoteContextProvider } from '@context/NoteContext';
import { SearchContextProvider } from '@context/SearchContext';
import { ThemeContextProvider } from '@context/ThemeContext';
import { SettingsContextProvider } from '@context/SettingsContext';
import ErrorBoundary from '@components/ErrorBoundary';

// Keep the splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Suppress non-critical warnings in development
if (__DEV__) {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
        'Reanimated',
    ]);
}

/**
 * Root App Component
 * Handles app initialization, font loading, and context provider setup
 */
const App = () => {
    const [appIsReady, setAppIsReady] = React.useState(false);
    const [appLoadError, setAppLoadError] = React.useState(null);

    useEffect(() => {
        async function prepare() {
            try {
                logger.log('🚀 Initializing Neuron Sparks application...');

                await Font.loadAsync({
                    'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
                });

                logger.log('✅ Fonts loaded successfully');
                setAppIsReady(true);
                logger.log('✅ App initialization complete');
            } catch (error) {
                logger.error('❌ App initialization failed:', error);
                setAppLoadError(error);
            } finally {
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (appLoadError) {
        return ( <
            View style = { styles.errorContainer } >
            <
            Text style = { styles.errorTitle } > App failed to start < /Text> <
            Text style = { styles.errorMessage } > { appLoadError.message || 'Unexpected startup error' } < /Text> < /
            View >
        );
    }

    if (!appIsReady) {
        return null;
    }

    return ( <
        ErrorBoundary >
        <
        SafeAreaProvider >
        <
        ThemeContextProvider >
        <
        SettingsContextProvider >
        <
        NoteContextProvider >
        <
        SearchContextProvider >
        <
        RootNavigator / >
        <
        /SearchContextProvider> < /
        NoteContextProvider > <
        /SettingsContextProvider> < /
        ThemeContextProvider > <
        /SafeAreaProvider> < /
        ErrorBoundary >
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: THEME.colors.bg_dark,
    },
    errorTitle: {
        color: THEME.colors.text_inverse,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    errorMessage: {
        color: THEME.colors.text_secondary,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default App;