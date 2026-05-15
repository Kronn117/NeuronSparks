/**
 * Custom Hooks - useAnimation
 * Simplified animation hook using Reanimated
 */

import { useRef } from 'react';
import Animated, { Easing } from 'react-native-reanimated';

/**
 * Hook for animations
 * @param {number} initialValue - Initial animation value
 * @returns {object} { animatedValue, startAnimation }
 */
export const useAnimation = (initialValue = 0) => {
    const animatedValue = useRef(new Animated.Value(initialValue)).current;

    const startAnimation = (toValue, duration = 300, easing = Easing.inOut(Easing.ease)) => {
        Animated.timing(animatedValue, {
            toValue,
            duration,
            easing,
            useNativeDriver: true,
        }).start();
    };

    return {
        animatedValue,
        startAnimation,
    };
};