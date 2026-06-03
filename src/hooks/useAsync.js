/**
 * ============================================================================
 * useAsync Hook
 * ============================================================================
 *
 * @file useAsync.js
 * @description Generic async-operation wrapper that tracks status, return value,
 * and errors.  Supports both immediate (auto-run on mount) and deferred
 * (manual `execute`) invocation patterns.
 *
 * Status lifecycle:  idle → pending → success | error
 *
 * @param {Function} asyncFunction - The async function to manage
 * @param {boolean}  immediate     - If true, call on mount (default true)
 * @returns {{ status: string, value: *, error: Error|null, execute: Function }}
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Manage the full lifecycle of an async function: pending, success, and error.
 *
 * @param {Function} asyncFunction - Async function to wrap
 * @param {boolean}  immediate    - Execute immediately on mount (default true)
 * @returns {{ status: 'idle'|'pending'|'success'|'error', value: *, error: Error|null, execute: Function }}
 */
export const useAsync = (asyncFunction, immediate = true) => {
    /** Status: 'idle' | 'pending' | 'success' | 'error' */
    const [status, setStatus] = useState('idle');
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Run the wrapped async function, resetting state to pending.
     * On success the resolved value is stored; on error the rejection
     * is captured and re-thrown so callers can also handle it.
     */
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

    /** Auto-execute on mount when `immediate` is true. */
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