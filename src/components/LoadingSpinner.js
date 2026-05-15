/**
 * LoadingSpinner Component
 * Loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { THEME } from '@utils/theme';

const LoadingSpinner = ({ size = 'large', color = THEME.colors.primary, message }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.colors.bg_dark,
    },
    message: {
        marginTop: THEME.spacing.md,
        fontSize: THEME.fontSizes.md,
        color: THEME.colors.text_primary,
    },
});

export default LoadingSpinner;
