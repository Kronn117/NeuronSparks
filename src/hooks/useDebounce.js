/**
 * ============================================================================
 * useDebounce Hook
 * ============================================================================
 *
 * @file useDebounce.js
 * @description Delays updating a value until after a specified quiet period.
 * Primarily used to throttle search-input changes so the search service is
 * not invoked on every keystroke.
 *
 * @param {*}      value - The rapidly-changing value to debounce
 * @param {number} delay - Quiet period in milliseconds (default 300ms)
 * @returns {*} The debounced value (only updates after `delay` ms of inactivity)
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value — the returned value only updates after `delay` ms
 * have elapsed since the last change to the input `value`.
 *
 * @param {*}      value - Source value (e.g. text input)
 * @param {number} delay - Debounce window in ms (default 300)
 * @returns {*} Debounced copy of the value
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};