/**
 * ============================================================================
 * Theme Context
 * ============================================================================
 *
 * @file ThemeContext.js
 * @description Manages the application's visual theme (colors, shadows, and
 * dark/light mode). The app is currently locked to **dark mode** to match the
 * cyberpunk / sci-fi aesthetic. On mount the provider:
 *   1. Immediately resolves the dark-mode color palette and shadow tokens so
 *      child components can render without a flash of unstyled content.
 *   2. Loads persisted settings from AsyncStorage via StorageService; if a
 *      light-mode preference is found it is overwritten back to dark mode.
 *
 * State shape:
 *   { isDarkMode: boolean, loading: boolean, colors: object|null, shadows: object|null }
 *
 * @see src/utils/theme.js       - DARK_COLORS / LIGHT_COLORS palettes
 * @see src/services/StorageService.js - getSettings / saveSettings
 * @see src/utils/logger.js      - Structured logging
 */

import React, {
    createContext,
    useReducer,
    useEffect,
    useContext
} from 'react';
import {
    logger
} from '@utils/logger';
import {
    StorageService
} from '@services/StorageService';
import {
    getThemeColors,
    getThemeShadows
} from '@utils/theme';

/** The raw React context object — prefer the `useTheme` hook for access. */
export const ThemeContext = createContext();

/**
 * Initial reducer state.
 * `colors` and `shadows` start as null; they are populated synchronously in
 * the first useEffect so the first meaningful paint already has tokens.
 */
const initialState = {
    isDarkMode: true,
    loading: true,
    colors: null,
    shadows: null,
};

/** Action type constants used by the theme reducer. */
const ACTIONS = {
    SET_THEME_MODE: 'SET_THEME_MODE',
    SET_LOADING: 'SET_LOADING',
    SET_COLORS: 'SET_COLORS',
    SET_SHADOWS: 'SET_SHADOWS',
};

/**
 * Theme reducer — handles immutable state transitions for theme tokens.
 *
 * @param {object} state  - Current theme state
 * @param {object} action - Dispatch action with `type` and `payload`
 * @returns {object} Next state
 */
const themeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_THEME_MODE:
            return {
                ...state,
                isDarkMode: action.payload
            };
        case ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case ACTIONS.SET_COLORS:
            return {
                ...state,
                colors: action.payload
            };
        case ACTIONS.SET_SHADOWS:
            return {
                ...state,
                shadows: action.payload
            };
        default:
            return state;
    }
};

/**
 * ThemeContextProvider
 *
 * Wraps the component tree and exposes theme colors, shadows, and the
 * dark-mode flag to all descendants via React Context.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Context provider wrapping children
 */
export const ThemeContextProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(themeReducer, initialState);

    /* ------------------------------------------------------------------ */
    /*  Eagerly populate color & shadow tokens (synchronous — no await)   */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const colors = getThemeColors(true);
        const shadows = getThemeShadows(true);
        dispatch({
            type: ACTIONS.SET_COLORS,
            payload: colors
        });
        dispatch({
            type: ACTIONS.SET_SHADOWS,
            payload: shadows
        });
        logger.log('Theme colors updated: Dark');
    }, []);

    /* ------------------------------------------------------------------ */
    /*  Load persisted theme preference from AsyncStorage                  */
    /*  Dark mode is enforced — any stored light-mode flag is overwritten  */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const loadTheme = async() => {
            try {
                const settings = await StorageService.getSettings();
                if (settings.isDarkMode === false) {
                    settings.isDarkMode = true;
                    await StorageService.saveSettings(settings);
                }
                dispatch({
                    type: ACTIONS.SET_THEME_MODE,
                    payload: true
                });
            } catch (error) {
                logger.error('Failed to load theme:', error);
            } finally {
                dispatch({
                    type: ACTIONS.SET_LOADING,
                    payload: false
                });
            }
        };
        loadTheme();
    }, []);

    /** Public context value — `isDarkMode` is hard-coded true (locked). */
    const value = {
        isDarkMode: true,
        loading: state.loading,
        colors: state.colors,
        shadows: state.shadows,
    };

    return ( <
        ThemeContext.Provider value = { value } > { children } <
        /ThemeContext.Provider>
    );
};

/**
 * Convenience hook for consuming theme context.
 *
 * @returns {{ isDarkMode: boolean, loading: boolean, colors: object, shadows: object }}
 * @throws {Error} If called outside of ThemeContextProvider
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }
    return context;
};