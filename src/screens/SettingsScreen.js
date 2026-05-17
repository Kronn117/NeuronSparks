/**
 * Settings Screen
 * Screen for app settings and data management with Tony Stark-style UI
 */

import React, { useCallback, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { THEME } from '@utils/theme';
import { useNotes } from '@hooks/useNotes';
import { useResponsive, useResponsiveFontSize } from '@hooks/useResponsive';
import { useFadeIn } from '@hooks/useAnimations';
import { useTheme } from '@context/ThemeContext';
import { logger } from '@utils/logger';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { getStatistics, deleteMultiple } = useNotes();

    // Responsive design
    const { isMobile, isTablet } = useResponsive();
    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.lg);

    // Theme context for dynamic colors
    const { colors, shadows, isDarkMode, toggleTheme } = useTheme();

    // Animations
    const { animatedStyle: fadeInStyle, startAnimation: startFadeIn } = useFadeIn();

    useEffect(() => {
        startFadeIn();
    }, [startFadeIn]);

    const handleClearAllNotes = () => {
        Alert.alert(
            'Clear All Notes',
            'Are you sure you want to delete all notes? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const stats = getStatistics();
                            const allNoteIds = stats.allNotes?.map(n => n.id) || [];
                            if (allNoteIds.length > 0) {
                                await deleteMultiple(allNoteIds);
                                Alert.alert('Success', 'All notes have been deleted');
                            } else {
                                Alert.alert('Info', 'No notes to delete');
                            }
                        } catch (error) {
                            logger.error('❌ Failed to clear notes:', error);
                            Alert.alert('Error', 'Failed to clear notes');
                        }
                    },
                },
            ]
        );
    };

    const handleExportNotes = () => {
        Alert.alert('Export Notes', 'Export functionality coming soon');
    };

    const handleClearAllNotesPress = () => {
        Alert.alert(
            'Clear All Notes',
            'Are you sure you want to delete all notes? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const stats = getStatistics();
                            const allNoteIds = stats.allNotes?.map(n => n.id) || [];
                            if (allNoteIds.length > 0) {
                                await deleteMultiple(allNoteIds);
                                Alert.alert('Success', 'All notes have been deleted');
                            } else {
                                Alert.alert('Info', 'No notes to delete');
                            }
                        } catch (error) {
                            logger.error('❌ Failed to clear notes:', error);
                            Alert.alert('Error', 'Failed to clear notes');
                        }
                    },
                },
            ]
        );
    };

    const handleExportNotesPress = () => {
        Alert.alert('Export Notes', 'Export functionality coming soon');
    };

    const handleAboutPress = () => {
        Alert.alert(
            'About Neuron Sparks',
            'Version 1.0.0\n\nA production-grade sci-fi themed notes application built with React Native and Expo.',
            [{ text: 'OK' }]
        );
    };

    const settingsItems = [
        {
            icon: 'delete-sweep',
            title: 'Clear All Notes',
            description: 'Delete all notes permanently',
            handlePress: handleClearAllNotesPress,
            color: THEME.colors.error,
        },
        {
            icon: 'export',
            title: 'Export Notes',
            description: 'Export notes to JSON file',
            handlePress: handleExportNotesPress,
            color: THEME.colors.primary,
        },
        {
            icon: 'information',
            title: 'About',
            description: 'App version and information',
            handlePress: handleAboutPress,
            color: THEME.colors.text_secondary,
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg_dark }]}>
            <Animated.View style={[styles.header, fadeInStyle, { backgroundColor: colors.bg_dark, borderBottomColor: colors.border_medium }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text_primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontSize: responsiveFontSize, color: colors.text_primary }]}>Settings</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                    <MaterialCommunityIcons name={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'} size={24} color={colors.text_primary} />
                </TouchableOpacity>
            </Animated.View>

            <Animated.ScrollView style={[styles.content, { backgroundColor: colors.bg_dark }]}>
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={[styles.section, { backgroundColor: colors.bg_card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>Data Management</Text>
                        {settingsItems.slice(0, 2).map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.settingItem}
                                onPress={item.handlePress}
                            >
                                <View style={styles.settingItemLeft}>
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={24}
                                        color={item.color}
                                        style={styles.settingIcon}
                                    />
                                    <View style={styles.settingItemText}>
                                        <Text style={[styles.settingTitle, { color: colors.text_primary }]}>{item.title}</Text>
                                        <Text style={[styles.settingDescription, { color: colors.text_tertiary }]}>{item.description}</Text>
                                    </View>
                                </View>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={24}
                                    color={colors.text_tertiary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View style={[styles.section, { backgroundColor: colors.bg_card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>Appearance</Text>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={toggleTheme}
                        >
                            <View style={styles.settingItemLeft}>
                                <MaterialCommunityIcons
                                    name={isDarkMode ? 'weather-night' : 'weather-sunny'}
                                    size={24}
                                    color={colors.primary}
                                    style={styles.settingIcon}
                                />
                                <View style={styles.settingItemText}>
                                    <Text style={[styles.settingTitle, { color: colors.text_primary }]}>Dark Mode</Text>
                                    <Text style={[styles.settingDescription, { color: colors.text_tertiary }]}>{isDarkMode ? 'Currently enabled' : 'Currently disabled'}</Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons
                                name={isDarkMode ? 'toggle-switch' : 'toggle-switch-off'}
                                size={24}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <View style={[styles.section, { backgroundColor: colors.bg_card }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>About</Text>
                        {settingsItems.slice(2).map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.settingItem}
                                onPress={item.handlePress}
                            >
                                <View style={styles.settingItemLeft}>
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={24}
                                        color={item.color}
                                        style={styles.settingIcon}
                                    />
                                    <View style={styles.settingItemText}>
                                        <Text style={[styles.settingTitle, { color: colors.text_primary }]}>{item.title}</Text>
                                        <Text style={[styles.settingDescription, { color: colors.text_tertiary }]}>{item.description}</Text>
                                    </View>
                                </View>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    size={24}
                                    color={colors.text_tertiary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <View style={styles.infoSection}>
                        <Text style={styles.infoText}>
                            Neuron Sparks v1.0.0
                        </Text>
                        <Text style={styles.infoText}>
                            Built with React Native & Expo
                        </Text>
                    </View>
                </Animated.View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: THEME.spacing.sm,
        marginRight: THEME.spacing.sm,
    },
    headerTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        flex: 1,
    },
    themeToggle: {
        padding: THEME.spacing.sm,
    },
    content: {
        flex: 1,
    },
    section: {
        marginTop: THEME.spacing.lg,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.md,
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.semibold,
        marginBottom: THEME.spacing.md,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.sm,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        marginRight: THEME.spacing.md,
    },
    settingItemText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.medium,
        marginBottom: THEME.spacing.xs,
    },
    settingDescription: {
        fontSize: THEME.fontSizes.sm,
    },
    infoSection: {
        marginTop: THEME.spacing.xl,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.lg,
        alignItems: 'center',
    },
    infoText: {
        fontSize: THEME.fontSizes.sm,
        marginBottom: THEME.spacing.xs,
    },
});

export default SettingsScreen;