/**
 * Custom Hooks - useLocalStorage
 * Hook for AsyncStorage operations
 */

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@utils/logger';
import { safeGetItem, safeSetItem, safeRemoveItem } from '@utils/storage';

/**
 * Hook for local storage
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {object} { value, setValue, removeValue, loading }
 */
export const useLocalStorage = (key, initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(true);

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