/**
 * SearchBar Component
 * Input field for note search
 */

import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@utils/theme';

const SearchBar = ({ value, onChangeText, onClear, placeholder = 'Search notes...', onFocus, onBlur }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    return (
        <View
            style={[
                styles.container,
                isFocused && styles.containerFocused,
            ]}
        >
            <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={THEME.colors.text_secondary}
                style={styles.icon}
            />

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={THEME.colors.text_tertiary}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                selectionColor={THEME.colors.primary}
            />

            {value?.length > 0 ? (
                <TouchableOpacity
                    onPress={() => {
                        onChangeText?.('');
                        onClear?.();
                    }}
                    hitSlop={10}
                >
                    <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color={THEME.colors.text_secondary}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME.colors.bg_secondary,
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: THEME.spacing.md,
        marginHorizontal: THEME.spacing.md,
        marginVertical: THEME.spacing.md,
        borderWidth: 1,
        borderColor: THEME.colors.border_medium,
    },
    containerFocused: {
        borderColor: THEME.colors.primary,
        borderWidth: 2,
    },
    icon: {
        marginRight: THEME.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: THEME.spacing.md,
        fontSize: THEME.fontSizes.md,
        color: THEME.colors.text_primary,
    },
});

export default SearchBar;
