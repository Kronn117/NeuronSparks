/**
 * Theme Context
 * Manages app theme (dark mode locked)
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

export const ThemeContext = createContext();

const initialState = {
    isDarkMode: true,
    loading: true,
    colors: null,
    shadows: null,
};

const ACTIONS = {
    SET_THEME_MODE: 'SET_THEME_MODE',
    SET_LOADING: 'SET_LOADING',
    SET_COLORS: 'SET_COLORS',
    SET_SHADOWS: 'SET_SHADOWS',
};

const themeReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_THEME_MODE:
            return {
                ...state, isDarkMode: action.payload
            };
        case ACTIONS.SET_LOADING:
            return {
                ...state, loading: action.payload
            };
        case ACTIONS.SET_COLORS:
            return {
                ...state, colors: action.payload
            };
        case ACTIONS.SET_SHADOWS:
            return {
                ...state, shadows: action.payload
            };
        default:
            return state;
    }
};

export const ThemeContextProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(themeReducer, initialState);

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

    useEffect(() => {
        const loadTheme = async () => {
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

    const value = {
        isDarkMode: true,
        loading: state.loading,
        colors: state.colors,
        shadows: state.shadows,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }
    return context;
};