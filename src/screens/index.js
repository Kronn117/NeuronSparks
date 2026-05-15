/**
 * Placeholder Screens
 * Quick implementation for other screens
 */

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { THEME } from '@utils/theme';

const PlaceholderScreen = ({ title }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>This screen is under development</Text>
            </View>
        </SafeAreaView>
    );
};

export const CreateScreen = () => <PlaceholderScreen title="Create Note" />;
export const DetailScreen = () => <PlaceholderScreen title="Note Details" />;
export const SearchScreen = () => <PlaceholderScreen title="Search Notes" />;
export const SettingsScreen = () => <PlaceholderScreen title="Settings" />;
export const ArchiveScreen = () => <PlaceholderScreen title="Archived Notes" />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.bg_dark,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        color: THEME.colors.primary,
        marginBottom: THEME.spacing.md,
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: THEME.colors.text_secondary,
    },
});
