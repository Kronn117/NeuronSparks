/**
 * useResponsive Hook
 * Provides responsive design utilities for different screen sizes
 */

import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Breakpoints for different screen sizes
const BREAKPOINTS = {
    xs: 0,      // Extra small phones
    sm: 375,    // Small phones
    md: 768,    // Tablets
    lg: 1024,   // Large tablets
    xl: 1280,   // Desktop
};

/**
 * Custom hook for responsive design
 * Returns screen dimensions and breakpoint information
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

        return () => subscription?.remove();
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

function getBreakpoint(width) {
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
}

/**
 * Responsive value helper
 * Returns different values based on current breakpoint
 */
export const useResponsiveValue = (values) => {
    const { breakpoint } = useResponsive();
    return values[breakpoint] || values.md || values.sm || values.xs;
};

/**
 * Responsive font size helper
 * Scales font size based on screen width
 */
export const useResponsiveFontSize = (baseSize) => {
    const { width } = useResponsive();
    const scaleFactor = width / 375; // Base width is iPhone SE
    const scaledSize = baseSize * Math.min(Math.max(scaleFactor, 0.8), 1.2);
    return scaledSize;
};
