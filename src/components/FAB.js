/**
 * ============================================================================
 * FAB (Floating Action Button) Component
 * ============================================================================
 *
 * @file FAB.js
 * @description A circular floating action button positioned absolutely over screen
 *              content, styled with the neon arc-reactor glow from the theme.
 *              Uses usePressAnimation for a satisfying scale-bounce on tap.
 *
 * Typically placed at the bottom-right corner of HomeScreen.
 *
 * @props {string} [icon='plus']    - MaterialCommunityIcons name
 * @props {function} onPress        - Callback when the FAB is tapped
 * @props {string} [color]          - Background colour override (defaults to primary)
 * @props {number} [bottom]         - Absolute bottom offset in pixels
 * @props {number} [right]          - Absolute right offset in pixels
 *
 * @see usePressAnimation for the press-scale spring effect
 */

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    MaterialCommunityIcons
} from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import {
    THEME
} from '@utils/theme';
import {
    usePressAnimation
} from '@hooks/useAnimations';

const FAB = ({
    icon = 'plus',
    onPress,
    color = THEME.colors.primary,
    bottom = THEME.spacing.xl,
    right = THEME.spacing.xl,
}) => {
    const {
        animatedStyle,
        onPressIn,
        onPressOut
    } = usePressAnimation();

    return ( <
        Animated.View style = {
            [styles.fab, { bottom, right }, animatedStyle] } >
        <
        TouchableOpacity style = {
            [styles.fabInner, { backgroundColor: color }] }
        onPress = { onPress }
        onPressIn = { onPressIn }
        onPressOut = { onPressOut }
        activeOpacity = { 1 } >
        <
        MaterialCommunityIcons name = { icon }
        size = { 28 }
        color = { THEME.colors.text_inverse }
        style = { styles.icon }
        /> <
        /TouchableOpacity> <
        /Animated.View>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.neon,
    },
    icon: {
        ...THEME.shadows.glow,
    },
});

export default FAB;