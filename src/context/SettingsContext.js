/**
 * Settings Context
 * Manages user preferences and app settings
 */

import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { DEFAULT_SORT } from '@utils/constants';

// Create context
export const SettingsContext = createContext();

/**
 * Default settings
 */
const defaultSettings = {
    defaultSortBy: DEFAULT_SORT,
    fontSize: 'md', // sm, md, lg
    isDarkMode: true,
    autoBackup: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    notificationsEnabled: true,
};

/**
 * Initial state
 */
const initialState = {
    settings: defaultSettings,
    loading: true,
};

/**
 * Action types
 */
const ACTIONS = {
    SET_SETTINGS: 'SET_SETTINGS',
    UPDATE_SETTING: 'UPDATE_SETTING',
    SET_LOADING: 'SET_LOADING',
    RESET_SETTINGS: 'RESET_SETTINGS',
};

/**
 * Reducer function
 */
const settingsReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_SETTINGS:
            return {...state, settings: action.payload, loading: false };

        case ACTIONS.UPDATE_SETTING:
            return {
                ...state,
                settings: {...state.settings, [action.payload.key]: action.payload.value },
            };

        case ACTIONS.SET_LOADING:
            return {...state, loading: action.payload };

        case ACTIONS.RESET_SETTINGS:
            return {...state, settings: defaultSettings };

        default:
            return state;
    }
};

/**
 * SettingsContextProvider Component
 */
export const SettingsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(settingsReducer, initialState);

    /**
     * Load settings from storage
     */
    useEffect(() => {
        const loadSettings = async() => {
            try {
                logger.log('⚙️  Loading settings');

                const stored = await StorageService.getSettings();
                const settings = {...defaultSettings, ...stored };

                dispatch({ type: ACTIONS.SET_SETTINGS, payload: settings });
                logger.log('✅ Settings loaded');
            } catch (error) {
                logger.error('❌ Failed to load settings:', error);
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        };

        loadSettings();
    }, []);

    /**
     * Update a single setting
     */
    const updateSetting = useCallback(
        async(key, value) => {
            try {
                logger.log(`⚙️  Updating setting: ${key} = ${value}`);

                dispatch({ type: ACTIONS.UPDATE_SETTING, payload: { key, value } });

                // Save to storage
                const newSettings = {...state.settings, [key]: value };
                await StorageService.saveSettings(newSettings);

                logger.log('✅ Setting updated');
            } catch (error) {
                logger.error('❌ Update setting error:', error);
            }
        }, [state.settings]
    );

    /**
     * Update multiple settings
     */
    const updateSettings = useCallback(
        async updates => {
            try {
                logger.log('⚙️  Updating multiple settings');

                const newSettings = {...state.settings, ...updates };
                dispatch({ type: ACTIONS.SET_SETTINGS, payload: newSettings });

                // Save to storage
                await StorageService.saveSettings(newSettings);

                logger.log('✅ Settings updated');
            } catch (error) {
                logger.error('❌ Update settings error:', error);
            }
        }, [state.settings]
    );

    /**
     * Reset to default settings
     */
    const resetSettings = useCallback(async() => {
        try {
            logger.warn('🔄 Resetting to default settings');

            dispatch({ type: ACTIONS.RESET_SETTINGS });
            await StorageService.saveSettings(defaultSettings);

            logger.log('✅ Settings reset');
        } catch (error) {
            logger.error('❌ Reset settings error:', error);
        }
    }, []);

    /**
     * Get a specific setting
     */
    const getSetting = useCallback(
        key => {
            return state.settings[key];
        }, [state.settings]
    );

    // Context value
    const value = {
        settings: state.settings,
        loading: state.loading,
        updateSetting,
        updateSettings,
        resetSettings,
        getSetting,
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
