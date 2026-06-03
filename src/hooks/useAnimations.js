/**
 * ============================================================================
 * Animation Hooks
 * ============================================================================
 *
 * @file useAnimations.js
 * @description A collection of reusable React Native Reanimated hooks that
 * power the cyberpunk / Tony-Stark-style motion design throughout the app.
 * Each exported hook returns an `animatedStyle` (to spread on an
 * `<Animated.View>`) and a trigger function to start the animation.
 *
 * All `'worklet'` callbacks run on the UI thread for 60 fps performance.
 *
 * Hooks provided:
 *   - usePressAnimation   — scale-down press feedback
 *   - useFadeIn           — opacity + slide-up entrance
 *   - usePulseGlow        — infinite pulsing glow (arc-reactor style)
 *   - useSlideIn          — directional slide entrance
 *   - useHolographicShimmer — repeating horizontal shimmer
 *   - useFloating         — gentle infinite float (up/down)
 *   - useRotation         — infinite 360° spin (loading indicators)
 *
 * @see src/utils/theme.js - THEME.animationSpring, THEME.animationDuration
 */

import { useCallback } from 'react';
import {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withRepeat,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { THEME } from '@utils/theme';

/**
 * Scale animation on press — gives tactile feedback like a Stark HUD button.
 * Uses `withSpring` for natural bounce on release.
 *
 * @returns {{ animatedStyle: object, onPressIn: () => void, onPressOut: () => void }}
 */
export const usePressAnimation = () => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = useCallback(() => {
        'worklet';
        scale.value = withSpring(0.95, THEME.animationSpring.snappy);
    }, []);

    const onPressOut = useCallback(() => {
        'worklet';
        scale.value = withSpring(1, THEME.animationSpring.bouncy);
    }, []);

    return { animatedStyle, onPressIn, onPressOut };
};

/**
 * Fade-in entrance animation — opacity 0→1 combined with a 20 px upward slide.
 *
 * @param {number} delay - Optional delay in ms before the animation starts
 * @returns {{ animatedStyle: object, startAnimation: () => void }}
 */
export const useFadeIn = (delay = 0) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const startAnimation = useCallback(() => {
        'worklet';
        opacity.value = withDelay(delay, withTiming(1, {
            duration: THEME.animationDuration.slow,
            easing: Easing.out(Easing.cubic),
        }));
        translateY.value = withDelay(delay, withSpring(0, THEME.animationSpring.smooth));
    }, [delay]);

    return { animatedStyle, startAnimation };
};

/**
 * Pulsing glow effect — infinite scale + opacity cycle reminiscent of an
 * arc reactor.  Call `startPulse` once in a useEffect to begin.
 *
 * @returns {{ animatedStyle: object, startPulse: () => void }}
 */
export const usePulseGlow = () => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const startPulse = useCallback(() => {
        'worklet';
        const pulseSequence = withSequence(
            withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        );
        const opacitySequence = withSequence(
            withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        );
        scale.value = withRepeat(pulseSequence, -1, true);
        opacity.value = withRepeat(opacitySequence, -1, true);
    }, []);

    return { animatedStyle, startPulse };
};

/**
 * Directional slide-in entrance animation.
 *
 * @param {'left'|'right'|'up'|'down'} direction - Entry direction (default 'right')
 * @param {number} delay - Optional delay in ms
 * @returns {{ animatedStyle: object, startAnimation: () => void }}
 */
export const useSlideIn = (direction = 'right', delay = 0) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        opacity: opacity.value,
    }));

    const startAnimation = useCallback(() => {
        'worklet';
        const offset = 50;

        if (direction === 'left') translateX.value = -offset;
        if (direction === 'right') translateX.value = offset;
        if (direction === 'up') translateY.value = -offset;
        if (direction === 'down') translateY.value = offset;

        opacity.value = withDelay(delay, withTiming(1, {
            duration: THEME.animationDuration.base,
            easing: Easing.out(Easing.cubic),
        }));

        if (direction === 'left' || direction === 'right') {
            translateX.value = withDelay(delay, withSpring(0, THEME.animationSpring.smooth));
        } else {
            translateY.value = withDelay(delay, withSpring(0, THEME.animationSpring.smooth));
        }
    }, [direction, delay]);

    return { animatedStyle, startAnimation };
};

/**
 * Holographic shimmer — a repeating horizontal translate that creates a
 * futuristic scanning / shimmer overlay effect.
 *
 * @returns {{ animatedStyle: object, startShimmer: () => void }}
 */
export const useHolographicShimmer = () => {
    const shimmer = useSharedValue(-1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 300 }],
    }));

    const startShimmer = useCallback(() => {
        'worklet';
        shimmer.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }), -1,
            false
        );
    }, []);

    return { animatedStyle, startShimmer };
};

/**
 * Floating animation — gentle infinite vertical oscillation for
 * high-priority UI elements (e.g. FABs, badges).
 *
 * @returns {{ animatedStyle: object, startFloating: () => void }}
 */
export const useFloating = () => {
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const startFloating = useCallback(() => {
        'worklet';
        const floatSequence = withSequence(
            withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        );
        translateY.value = withRepeat(floatSequence, -1, true);
    }, []);

    return { animatedStyle, startFloating };
};

/**
 * Continuous rotation — useful for loading spinners and progress indicators.
 *
 * @returns {{ animatedStyle: object, startRotation: () => void, stopRotation: () => void }}
 */
export const useRotation = () => {
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const startRotation = useCallback(() => {
        'worklet';
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }), -1,
            false
        );
    }, []);

    const stopRotation = useCallback(() => {
        'worklet';
        rotation.value = 0;
    }, []);

    return { animatedStyle, startRotation, stopRotation };
};