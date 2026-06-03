/**
 * ============================================================================
 * NeuronSparks - Root Application Entry Point
 * ============================================================================
 *
 * @file App.js
 * @description Bootstraps the NeuronSparks application by loading custom fonts,
 *              initialising the splash screen, and wrapping the navigation tree
 *              in the required Context providers.
 *
 * Architecture:
 *   ErrorBoundary          - Catches unhandled render errors globally
 *     SafeAreaProvider     - Injects safe-area insets for notched devices
 *       ThemeContextProvider - Loads and exposes dark/light colour palettes
 *         SettingsContextProvider - Loads persisted user preferences
 *           NoteContextProvider   - Manages CRUD state for all notes
 *             SearchContextProvider - Manages search queries and filters
 *               RootNavigator      - Stack-based navigation container
 *
 * @dependencies expo-splash-screen, expo-font, react-native-safe-area-context
 * @see src/navigation/RootNavigator.js for route definitions
 * @see src/context/ for all Context providers
 */

import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { logger } from '@utils/logger';
import RootNavigator from '@navigation/RootNavigator';
import { NoteContextProvider } from '@context/NoteContext';
import { SearchContextProvider } from '@context/SearchContext';
import { ThemeContextProvider } from '@context/ThemeContext';
import { SettingsContextProvider } from '@context/SettingsContext';
import ErrorBoundary from '@components/ErrorBoundary';

// Prevent the splash screen from auto-hiding so we can finish loading assets
SplashScreen.preventAutoHideAsync();

// Suppress known non-critical warnings during development to reduce console noise
if (__DEV__) {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
        'Reanimated',
    ]);
}

/**
 * Root App Component
 *
 * Lifecycle:
 *  1. preventAutoHideAsync() is called at module scope (above)
 *  2. On mount, `prepare()` loads the JetBrains Mono font via expo-font
 *  3. Once fonts are ready, `appIsReady` flips to true and the full
 *     provider tree is rendered
 *  4. The splash screen is hidden in the `finally` block to guarantee
 *     it disappears even if font loading fails
 *
 * @returns {JSX.Element|null} The provider-wrapped navigator, or null while loading
 */
const App = () => {
    const [appIsReady, setAppIsReady] = React.useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                logger.log('🚀 Initializing Neuro Sparks application...');

                // Load the custom JetBrains Mono font bundled in assets/fonts/
                await Font.loadAsync({
                    'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
                });

                logger.log('✅ Fonts loaded successfully');
                setAppIsReady(true);
                logger.log('✅ App initialization complete');
            } catch (error) {
                // Font loading failure is non-fatal; the app will still render
                // with the system default font
                logger.error('❌ App initialization failed:', error);
            } finally {
                // Always hide the splash screen, even if initialisation failed
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    // Return nothing while fonts are still loading to avoid a flash of unstyled text
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
        /SearchContextProvider> <
        /NoteContextProvider> <
        /SettingsContextProvider> <
        /ThemeContextProvider> <
        /SafeAreaProvider> <
        /ErrorBoundary>
    );
};

export default App;