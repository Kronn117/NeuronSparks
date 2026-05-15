/**
 * TagBadge Component
 * Tag display component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@utils/theme';

const TagBadge = ({ tag, onPress, onRemove, isSelected, isRemovable }) => {
    return (
        <TouchableOpacity
            style={[
                styles.badge,
                isSelected && { backgroundColor: THEME.colors.primary, borderColor: THEME.colors.primary },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, isSelected && { color: THEME.colors.text_inverse }]}>{tag}</Text>
            {isRemovable ? (
                <TouchableOpacity onPress={onRemove} hitSlop={8} style={styles.removeIcon}>
                    <MaterialCommunityIcons
                        name="close"
                        size={14}
                        color={isSelected ? THEME.colors.text_inverse : THEME.colors.text_primary}
                    />
                </TouchableOpacity>
            ) : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.colors.bg_secondary,
        borderWidth: 1,
        borderColor: THEME.colors.border_medium,
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        marginRight: THEME.spacing.sm,
        marginBottom: THEME.spacing.sm,
    },
    text: {
        fontSize: THEME.fontSizes.sm,
        color: THEME.colors.text_primary,
        fontWeight: THEME.fontWeights.medium,
    },
    removeIcon: {
        marginLeft: THEME.spacing.sm,
    },
});

export default TagBadge;
