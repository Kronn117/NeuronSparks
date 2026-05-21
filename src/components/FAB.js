/**
 * FAB Component
 * Floating Action Button with Tony Stark arc reactor style
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

    return (
        <Animated.View style={[styles.fab, { bottom, right }, animatedStyle]}>
            <TouchableOpacity
                style={[styles.fabInner, { backgroundColor: color }]}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={28}
                    color={THEME.colors.text_inverse}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </Animated.View>
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