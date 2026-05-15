/**
 * EmptyState Component
 * Display when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@utils/theme';

const EmptyState = ({ icon = 'inbox', title, description, primaryAction, primaryText, onPrimary }) => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={icon} size={64} color={THEME.colors.text_secondary} />
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
            {primaryAction ? (
                <TouchableOpacity style={styles.button} onPress={onPrimary || primaryAction}>
                    <Text style={styles.buttonText}>{primaryText || 'Create New'}</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.xl,
        backgroundColor: THEME.colors.bg_dark,
    },
    title: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.semibold,
        color: THEME.colors.text_primary,
        marginTop: THEME.spacing.lg,
        textAlign: 'center',
    },
    description: {
        fontSize: THEME.fontSizes.md,
        color: THEME.colors.text_secondary,
        marginTop: THEME.spacing.md,
        textAlign: 'center',
    },
    button: {
        marginTop: THEME.spacing.xl,
        paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.md,
        backgroundColor: THEME.colors.primary,
        borderRadius: THEME.borderRadius.lg,
    },
    buttonText: {
        color: THEME.colors.text_inverse,
        fontWeight: THEME.fontWeights.semibold,
        textAlign: 'center',
    },
});

export default EmptyState;
