/**
 * ============================================================================
 * useAnimation Hook
 * ============================================================================
 *
 * @file useAnimation.js
 * @description Simplified, imperative animation hook built on top of
 * `react-native-reanimated`'s legacy `Animated` API.  Provides a single
 * animated numeric value and a `startAnimation` helper that runs a timing
 * transition with configurable duration and easing.
 *
 * For more complex / declarative animations see `useAnimations.js`.
 *
 * @param {number} initialValue - Starting value of the animated node (default 0)
 * @returns {{ animatedValue: Animated.Value, startAnimation: Function }}
 */

import { useRef } from 'react';
import Animated, { Easing } from 'react-native-reanimated';

/**
 * Create and control a single animated numeric value.
 *
 * @param {number} initialValue - Starting value (default 0)
 * @returns {{ animatedValue: Animated.Value, startAnimation: (toValue: number, duration?: number, easing?: Function) => void }}
 */
export const useAnimation = (initialValue = 0) => {
    const animatedValue = useRef(new Animated.Value(initialValue)).current;

    /**
     * Start a timing animation from the current value to `toValue`.
     *
     * @param {number}   toValue  - Target value
     * @param {number}   duration - Animation length in ms (default 300)
     * @param {Function} easing   - Easing curve (default ease in-out)
     */
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