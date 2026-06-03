/**
 * ============================================================================
 * Settings Context
 * ============================================================================
 *
 * @file SettingsContext.js
 * @description Manages all user-configurable preferences: sort order, font size,
 * dark-mode flag, auto-backup toggle, backup frequency, and notification
 * settings.  Values are loaded from AsyncStorage on mount and persisted on
 * every update so preferences survive app restarts.
 *
 * State shape:
 *   {
 *     settings: {
 *       defaultSortBy: string,
 *       fontSize: 'sm'|'md'|'lg',
 *       isDarkMode: boolean,
 *       autoBackup: boolean,
 *       backupFrequency: 'daily'|'weekly'|'monthly',
 *       notificationsEnabled: boolean
 *     },
 *     loading: boolean
 *   }
 *
 * @see src/services/StorageService.js - getSettings / saveSettings
 * @see src/utils/constants.js         - DEFAULT_SORT
 * @see src/screens/SettingsScreen.js  - UI that consumes this context
 */

import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { DEFAULT_SORT } from '@utils/constants';

/** The raw React context — prefer a dedicated hook for access. */
export const SettingsContext = createContext();

/**
 * Default settings used when no persisted data exists.
 * These values also power the "Reset to Defaults" feature.
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
 * Initial reducer state — `loading: true` prevents the UI from rendering
 * before persisted settings have been hydrated from AsyncStorage.
 */
const initialState = {
    settings: defaultSettings,
    loading: true,
};

/** Action type constants consumed by the settings reducer. */
const ACTIONS = {
    SET_SETTINGS: 'SET_SETTINGS',
    UPDATE_SETTING: 'UPDATE_SETTING',
    SET_LOADING: 'SET_LOADING',
    RESET_SETTINGS: 'RESET_SETTINGS',
};

/**
 * Settings reducer — immutable state transitions for user preferences.
 *
 * @param {object} state  - Current settings state
 * @param {object} action - Dispatch action with `type` and `payload`
 * @returns {object} Next state
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
 * SettingsContextProvider
 *
 * Wraps the component tree and exposes user preferences plus memoised
 * updater functions to all descendants.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Context provider wrapping children
 */
export const SettingsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(settingsReducer, initialState);

    /* ------------------------------------------------------------------ */
    /*  Hydrate persisted settings from AsyncStorage on mount              */
    /* ------------------------------------------------------------------ */
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
     * Update a single setting by key and persist the change.
     *
     * @param {string} key   - Setting name (e.g. 'fontSize')
     * @param {*}      value - New value for the setting
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
     * Batch-update multiple settings at once and persist.
     *
     * @param {object} updates - Partial settings object to merge
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
     * Reset every setting back to its factory default and persist.
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
     * Read a single setting value by key.
     *
     * @param {string} key - Setting name
     * @returns {*} Current value of the setting
     */
    const getSetting = useCallback(
        key => {
            return state.settings[key];
        }, [state.settings]
    );

    /** Public context value — settings object + memoised helpers. */
    const value = {
        settings: state.settings,
        loading: state.loading,
        updateSetting,
        updateSettings,
        resetSettings,
        getSetting,
    };

    return <SettingsContext.Provider value = { value } > { children } < /SettingsContext.Provider>;
};