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

    useEffect(() => {
        async function prepare() {
            try {
                logger.log('🚀 Initializing Neuron Sparks application...');

                await Font.loadAsync({
                    'JetBrainsMono-Regular': require('@assets/fonts/JetBrainsMono-Regular.ttf'),
                });

                logger.log('✅ Fonts loaded successfully');
                setAppIsReady(true);
                logger.log('✅ App initialization complete');
            } catch (error) {
                logger.error('❌ App initialization failed:', error);
            } finally {
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return null;
    }

    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <ThemeContextProvider>
                    <SettingsContextProvider>
                        <NoteContextProvider>
                            <SearchContextProvider>
                                <RootNavigator />
                            </SearchContextProvider>
                        </NoteContextProvider>
                    </SettingsContextProvider>
                </ThemeContextProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
};

export default App;
