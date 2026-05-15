/**
 * FAB Component
 * Floating Action Button
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@utils/theme';

const FAB = ({ icon = 'plus', onPress, color = THEME.colors.primary }) => {
    return (
        <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
            <MaterialCommunityIcons name={icon} size={28} color={THEME.colors.text_inverse} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: THEME.spacing.xl,
        right: THEME.spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.large,
    },
});

export default FAB;
