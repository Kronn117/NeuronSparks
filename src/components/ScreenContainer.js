/**
 * ============================================================================
 * ScreenContainer Component
 * ============================================================================
 *
 * @file ScreenContainer.js
 * @description A thin wrapper around react-native-safe-area-context's SafeAreaView
 *              that automatically applies the current theme's background colour.
 *              Used as the root container on every screen to respect device notches,
 *              home indicators, and status bar insets.
 *
 * @props {React.ReactNode} children     - Child elements to render inside the safe area
 * @props {string[]}        [edges]      - Safe-area edges to apply (default: ['top', 'bottom'])
 * @props {object}          [style]      - Additional ViewStyle overrides
 *
 * @see ThemeContext for the `colors.bg_dark` value
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

    return ( <
        SafeAreaView style = {
            [styles.container, { backgroundColor: colors.bg_dark }, style] }
        edges = { edges } >
        { children } <
        /SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenContainer;