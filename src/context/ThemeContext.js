/**
 * Theme Context
 * Manages app theme (dark/light mode) with enhanced color palettes
 */

import React, { createContext, useReducer, useCallback, useEffect, useContext } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { getThemeColors, getThemeShadows } from '@utils/theme';

// Create context
export const ThemeContext = createContext();

/**
 * Initial state
 */
const initialState = {
    isDarkMode: true, // Default to dark mode
    loading: true,
    colors: null, // Will be set based on mode
    shadows: null, // Will be set based on mode
};

/**
 * Action types
 */
const ACTIONS = {
    SET_THEME_MODE: 'SET_THEME_MODE',
    SET_LOADING: 'SET_LOADING',
    SET_COLORS: 'SET_COLORS',
    SET_SHADOWS: 'SET_SHADOWS',
};

/**
 * Reducer function
 */
const themeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_THEME_MODE:
            return {...state, isDarkMode: action.payload };

        case ACTIONS.SET_LOADING:
            return {...state, loading: action.payload };

        case ACTIONS.SET_COLORS:
            return {...state, colors: action.payload };

        case ACTIONS.SET_SHADOWS:
            return {...state, shadows: action.payload };

        default:
            return state;
    }
};

/**
 * ThemeContextProvider Component
 */
export const ThemeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, initialState);

    /**
     * Update theme colors and shadows when mode changes
     */
    useEffect(() => {
        const colors = getThemeColors(state.isDarkMode);
        const shadows = getThemeShadows(state.isDarkMode);
        
        dispatch({ type: ACTIONS.SET_COLORS, payload: colors });
        dispatch({ type: ACTIONS.SET_SHADOWS, payload: shadows });
        
        logger.log(`🎨 Theme colors updated: ${state.isDarkMode ? 'Dark' : 'Light'}`);
    }, [state.isDarkMode]);

    /**
     * Load theme preference from storage
     */
    useEffect(() => {
        const loadTheme = async() => {
            try {
                logger.log('🎨 Loading theme preference');

                const settings = await StorageService.getSettings();
                const isDarkMode = settings.isDarkMode !== false; // Default to dark

                dispatch({ type: ACTIONS.SET_THEME_MODE, payload: isDarkMode });
                logger.log(`✅ Theme loaded: ${isDarkMode ? 'Dark' : 'Light'}`);
            } catch (error) {
                logger.error('❌ Failed to load theme:', error);
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        };

        loadTheme();
    }, []);

    /**
     * Toggle theme
     */
    const toggleTheme = useCallback(async() => {
        try {
            logger.log('🎨 Toggling theme');

            const newMode = !state.isDarkMode;
            dispatch({ type: ACTIONS.SET_THEME_MODE, payload: newMode });

            // Save preference
            const settings = await StorageService.getSettings();
            settings.isDarkMode = newMode;
            await StorageService.saveSettings(settings);

            logger.log(`✅ Theme changed to: ${newMode ? 'Dark' : 'Light'}`);
        } catch (error) {
            logger.error('❌ Toggle theme error:', error);
        }
    }, [state.isDarkMode]);

    /**
     * Set specific theme
     */
    const setTheme = useCallback(async isDarkMode => {
        try {
            logger.log(`🎨 Setting theme to: ${isDarkMode ? 'Dark' : 'Light'}`);

            dispatch({ type: ACTIONS.SET_THEME_MODE, payload: isDarkMode });

            // Save preference
            const settings = await StorageService.getSettings();
            settings.isDarkMode = isDarkMode;
            await StorageService.saveSettings(settings);
        } catch (error) {
            logger.error('❌ Set theme error:', error);
        }
    }, []);

    // Context value
    const value = {
        isDarkMode: state.isDarkMode,
        loading: state.loading,
        colors: state.colors,
        shadows: state.shadows,
        toggleTheme,
        setTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }
    return context;
};
