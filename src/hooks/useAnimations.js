/**
 * useAnimations Hook
 * Provides common animation utilities for Tony Stark-style interactions
 */

import { useRef, useCallback } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withRepeat,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { THEME } from '@utils/theme';

/**
 * Scale animation on press
 * Creates a satisfying press effect like Tony Stark's UI
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
 * Fade in animation
 * Smooth entrance animation for screens
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
        opacity.value = withTiming(1, {
            duration: THEME.animationDuration.slow,
            easing: Easing.out(Easing.cubic),
        });
        translateY.value = withSpring(0, THEME.animationSpring.smooth);
    }, []);

    return { animatedStyle, startAnimation };
};

/**
 * Pulsing glow effect
 * Creates an arc reactor-style pulsing animation
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
 * Slide in animation
 * Smooth slide from different directions
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

        opacity.value = withTiming(1, {
            duration: THEME.animationDuration.base,
            easing: Easing.out(Easing.cubic),
        });

        if (direction === 'left' || direction === 'right') {
            translateX.value = withSpring(0, THEME.animationSpring.smooth);
        } else {
            translateY.value = withSpring(0, THEME.animationSpring.smooth);
        }
    }, [direction]);

    return { animatedStyle, startAnimation };
};

/**
 * Holographic shimmer effect
 * Creates a futuristic holographic scanning effect
 */
export const useHolographicShimmer = () => {
    const shimmer = useSharedValue(-1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 300 }],
    }));

    const startShimmer = useCallback(() => {
        'worklet';
        shimmer.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    return { animatedStyle, startShimmer };
};

/**
 * Floating animation
 * Gentle floating effect for important elements
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
 * Rotation animation
 * Smooth rotation for loading indicators
 */
export const useRotation = () => {
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const startRotation = useCallback(() => {
        'worklet';
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const stopRotation = useCallback(() => {
        'worklet';
        rotation.value = 0;
    }, []);

    return { animatedStyle, startRotation, stopRotation };
};
