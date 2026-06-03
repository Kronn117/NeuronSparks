/**
 * Storage Helper Functions
 * Utility functions for AsyncStorage operations
 * NOTE: Do NOT use these directly - use StorageService instead
 * These are low-level helpers for StorageService to use
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

/**
 * Safe wrapper for AsyncStorage.getItem with error handling
 * @param {string} key - Storage key
 * @returns {Promise<*>} Parsed value or null
 */
export const safeGetItem = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            try {
                return JSON.parse(value);
            } catch {
                // Value is not JSON, return as-is
                return value;
            }
        }
        return null;
    } catch (error) {
        logger.error(`Error getting item ${key}:`, error);
        return null;
    }
};

/**
 * Safe wrapper for AsyncStorage.setItem with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {Promise<boolean>} Success status
 */
export const safeSetItem = async(key, value) => {
    try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
        return true;
    } catch (error) {
        logger.error(`Error setting item ${key}:`, error);
        return false;
    }
};

/**
 * Safe wrapper for AsyncStorage.removeItem
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} Success status
 */
export const safeRemoveItem = async key => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        logger.error(`Error removing item ${key}:`, error);
        return false;
    }
};

/**
 * Safe wrapper for AsyncStorage.multiGet
 * @param {string[]} keys - Array of keys to get
 * @returns {Promise<object>} Object with key-value pairs
 */
export const safeMultiGet = async keys => {
    try {
        const pairs = await AsyncStorage.multiGet(keys);
        const result = {};

        pairs.forEach(([key, value]) => {
            try {
                result[key] = value ? JSON.parse(value) : null;
            } catch {
                result[key] = value;
            }
        });

        return result;
    } catch (error) {
        logger.error('Error in multiGet:', error);
        return {};
    }
};

/**
 * Safe wrapper for AsyncStorage.multiSet
 * @param {object} items - Object with key-value pairs
 * @returns {Promise<boolean>} Success status
 */
export const safeMultiSet = async items => {
    try {
        const pairs = Object.entries(items).map(([key, value]) => [
            key,
            typeof value === 'string' ? value : JSON.stringify(value),
        ]);

        await AsyncStorage.multiSet(pairs);
        return true;
    } catch (error) {
        logger.error('Error in multiSet:', error);
        return false;
    }
};

/**
 * Safe wrapper for AsyncStorage.multiRemove
 * @param {string[]} keys - Array of keys to remove
 * @returns {Promise<boolean>} Success status
 */
export const safeMultiRemove = async keys => {
    try {
        await AsyncStorage.multiRemove(keys);
        return true;
    } catch (error) {
        logger.error('Error in multiRemove:', error);
        return false;
    }
};

/**
 * Safe wrapper for AsyncStorage.getAllKeys
 * @returns {Promise<string[]>} Array of all keys
 */
export const safeGetAllKeys = async() => {
    try {
        return await AsyncStorage.getAllKeys();
    } catch (error) {
        logger.error('Error getting all keys:', error);
        return [];
    }
};

/**
 * Safe clear all AsyncStorage
 * @returns {Promise<boolean>} Success status
 */
export const safeClearAll = async() => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        logger.error('Error clearing storage:', error);
        return false;
    }
};

/**
 * Get storage size estimate
 * @returns {Promise<object>} { used, limit } in bytes
 */
export const getStorageInfo = async() => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        let totalSize = 0;

        for (const key of keys) {
            const value = await AsyncStorage.getItem(key);
            if (value) {
                totalSize += key.length + value.length;
            }
        }

        return {
            used: totalSize,
            limit: 6 * 1024 * 1024, // 6MB default limit
            percentage: (totalSize / (6 * 1024 * 1024)) * 100,
        };
    } catch (error) {
        logger.error('Error getting storage info:', error);
        return { used: 0, limit: 6 * 1024 * 1024, percentage: 0 };
    }
};