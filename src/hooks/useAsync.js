/**
 * Custom Hooks - useAsync
 * Hook for async operations with loading/error states
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for async operations
 * @param {function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Execute immediately on mount
 * @returns {object} { status, value, error, execute }
 */
export const useAsync = (asyncFunction, immediate = true) => {
    const [status, setStatus] = useState('idle'); // idle, pending, success, error
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);

    // Execute async function
    const execute = useCallback(async() => {
        setStatus('pending');
        setValue(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setValue(response);
            setStatus('success');
            return response;
        } catch (err) {
            setError(err);
            setStatus('error');
            throw err;
        }
    }, [asyncFunction]);

    // Call on mount if immediate
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {
        status,
        value,
        error,
        execute,
    };
};