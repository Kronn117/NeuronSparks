/**
 * ============================================================================
 * useLocalStorage Hook
 * ============================================================================
 *
 * @file useLocalStorage.js
 * @description React hook that mirrors `useState` but persists every value to
 * AsyncStorage via the safe wrappers in `src/utils/storage.js`.  On mount the
 * hook hydrates the current value from storage; subsequent writes are
 * automatically persisted.
 *
 * @param {string} key          - AsyncStorage key
 * @param {*}      initialValue - Fallback value when storage is empty
 * @returns {{ value: *, setValue: Function, removeValue: Function, loading: boolean }}
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@utils/logger';
import { safeGetItem, safeSetItem, safeRemoveItem } from '@utils/storage';

/**
 * Persisted state hook backed by AsyncStorage.
 *
 * @param {string} key          - Storage key (must be unique across the app)
 * @param {*}      initialValue - Default value when key does not exist
 * @returns {{ value: *, setValue: (v: *|Function) => Promise<void>, removeValue: () => Promise<void>, loading: boolean }}
 */
export const useLocalStorage = (key, initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(true);

    /** Hydrate from AsyncStorage on mount (or when key changes). */
    // Load from storage
    useEffect(() => {
        const loadValue = async() => {
            try {
                const stored = await safeGetItem(key);
                if (stored !== null) {
                    setValue(stored);
                }
            } catch (error) {
                logger.error('❌ Load from storage error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadValue();
    }, [key]);

    /**
     * Persist a new value.  Accepts either a direct value or an updater
     * function `(prev) => next`, matching the useState API.
     */
    // Save to storage
    const handleSetValue = useCallback(
        async(newValue) => {
            try {
                const nextValue = newValue instanceof Function ? newValue(value) : newValue;
                setValue(nextValue);
                await safeSetItem(key, nextValue);
            } catch (error) {
                logger.error('❌ Save to storage error:', error);
            }
        }, [key, value],
    );

    /** Delete the key from storage and reset to `initialValue`. */
    // Remove from storage
    const handleRemoveValue = useCallback(async() => {
        try {
            setValue(initialValue);
            await safeRemoveItem(key);
        } catch (error) {
            logger.error('❌ Remove from storage error:', error);
        }
    }, [key, initialValue]);

    return {
        value,
        setValue: handleSetValue,
        removeValue: handleRemoveValue,
        loading,
    };
};