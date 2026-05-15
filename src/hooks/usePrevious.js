/**
 * Custom Hooks - usePrevious
 * Get previous value of a prop or state
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to get previous value
 * @param {*} value - Current value
 * @returns {*} Previous value
 */
export const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};