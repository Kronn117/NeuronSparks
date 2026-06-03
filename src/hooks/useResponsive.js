/**
 * ============================================================================
 * useResponsive Hook
 * ============================================================================
 *
 * @file useResponsive.js
 * @description Responsive-design utilities for adapting layouts across phones,
 * tablets, and desktop screens.  Listens to `Dimensions` changes (orientation
 * rotation, split-screen, window resize) and exposes the current breakpoint
 * plus convenience booleans (isMobile, isTablet, isDesktop).
 *
 * Breakpoints:
 *   xs  0–374   | Extra-small phones
 *   sm  375–767 | Standard phones
 *   md  768–1023| Tablets
 *   lg  1024–1279| Large tablets
 *   xl  1280+   | Desktop / web
 *
 * @see HomeScreen.js — uses isTablet to toggle FlatList numColumns
 */

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/** Breakpoint thresholds in logical pixels (width). */
// Breakpoints for different screen sizes
const BREAKPOINTS = {
    xs: 0, // Extra small phones
    sm: 375, // Small phones
    md: 768, // Tablets
    lg: 1024, // Large tablets
    xl: 1280, // Desktop
};

/**
 * Subscribe to window dimension changes and derive breakpoint / device-class
 * booleans from the current screen width.
 *
 * @returns {{ width: number, height: number, isPortrait: boolean, breakpoint: string, isXSmall: boolean, isSmall: boolean, isMedium: boolean, isLarge: boolean, isXLarge: boolean, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export const useResponsive = () => {
    const [screenDimensions, setScreenDimensions] = useState({
        width,
        height,
        isPortrait: height > width,
    });

    const [breakpoint, setBreakpoint] = useState(getBreakpoint(width));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions({
                width: window.width,
                height: window.height,
                isPortrait: window.height > window.width,
            });
            setBreakpoint(getBreakpoint(window.width));
        });

        return () => subscription ? .remove();
    }, []);

    return {
        ...screenDimensions,
        breakpoint,
        isXSmall: breakpoint === 'xs',
        isSmall: breakpoint === 'sm',
        isMedium: breakpoint === 'md',
        isLarge: breakpoint === 'lg',
        isXLarge: breakpoint === 'xl',
        isMobile: breakpoint === 'xs' || breakpoint === 'sm',
        isTablet: breakpoint === 'md' || breakpoint === 'lg',
        isDesktop: breakpoint === 'xl',
    };
};

/**
 * Determine the breakpoint label for a given screen width.
 *
 * @param {number} width - Screen width in logical pixels
 * @returns {'xs'|'sm'|'md'|'lg'|'xl'} Breakpoint label
 */
function getBreakpoint(width) {
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
}

/**
 * Return a breakpoint-specific value from a map.
 * Falls back through md → sm → xs when the exact breakpoint key is absent.
 *
 * @param {object} values - Map of breakpoint → value (e.g. { xs: 1, md: 2, xl: 3 })
 * @returns {*} The value matching the current breakpoint
 */
export const useResponsiveValue = (values) => {
    const { breakpoint } = useResponsive();
    return values[breakpoint] || values.md || values.sm || values.xs;
};

/**
 * Scale a font size proportionally to the screen width, clamped between
 * 80 % and 120 % of the base size.  Reference width is 375 px (iPhone SE).
 *
 * @param {number} baseSize - Desired font size at reference width
 * @returns {number} Scaled font size
 */
export const useResponsiveFontSize = (baseSize) => {
    const { width } = useResponsive();
    const scaleFactor = width / 375; // Base width is iPhone SE
    const scaledSize = baseSize * Math.min(Math.max(scaleFactor, 0.8), 1.2);
    return scaledSize;
};