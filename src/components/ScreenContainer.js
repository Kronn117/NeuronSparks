/**
 * ScreenContainer Component
 * Safe area wrapper using react-native-safe-area-context
 */

import React from 'react';
import {
    StyleSheet
} from 'react-native';
import {
    SafeAreaView
} from 'react-native-safe-area-context';
import {
    useTheme
} from '@context/ThemeContext';

const ScreenContainer = ({
    children,
    edges = ['top', 'bottom'],
    style
}) => {
    const {
        colors
    } = useTheme();

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.bg_dark }, style]}
            edges={edges}
        >
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenContainer;