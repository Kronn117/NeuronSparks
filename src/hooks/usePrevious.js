/**
 * ============================================================================
 * usePrevious Hook
 * ============================================================================
 *
 * @file usePrevious.js
 * @description Returns the value from the *previous* render cycle.  Useful for
 * comparing old vs. new props/state inside effects or render logic (e.g.
 * detecting when a search query changes).
 *
 * @param {*} value - The current value to track
 * @returns {*} The value from the prior render (undefined on first render)
 */

import { useEffect, useRef } from 'react';

/**
 * Returns the value from the previous render.
 * Internally uses a `useRef` that is updated in a `useEffect` so the
 * returned value always lags one render behind the input.
 *
 * @param {*} value - Current value
 * @returns {*} Previous value (undefined on first render)
 */
export const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};