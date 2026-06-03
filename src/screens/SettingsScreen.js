/**
 * ============================================================================
 * Settings Screen
 * ============================================================================
 *
 * @file SettingsScreen.js
 * @description App-settings and data-management hub.  Provides:
 *   - Clear All Notes (with destructive confirmation)
 *   - Export Notes (JSON / CSV / Markdown via the system share sheet)
 *   - Restore Last Deleted Note
 *   - About dialog (version info)
 *
 * Export flow:
 *   1. Calls the appropriate ExportService method.
 *   2. Writes the result to `FileSystem.cacheDirectory`.
 *   3. Invokes `expo-sharing` (falls back to `Share.share` on web).
 *
 * @see ExportService, NoteContext.restoreLastDeleted
 * @see src/utils/constants.js - APP_VERSION, SUCCESS_MESSAGES
 */

import React, {
    useEffect
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    Share,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
    MaterialCommunityIcons
} from '@expo/vector-icons';
import {
    useNavigation
} from '@react-navigation/native';
import Animated, {
    FadeInDown
} from 'react-native-reanimated';
import {
    THEME
} from '@utils/theme';
import {
    useNotes
} from '@hooks/useNotes';
import {
    useResponsiveFontSize
} from '@hooks/useResponsive';
import {
    useFadeIn
} from '@hooks/useAnimations';
import {
    useTheme
} from '@context/ThemeContext';
import {
    ExportService
} from '@services/ExportService';
import {
    APP_VERSION,
    SUCCESS_MESSAGES
} from '@utils/constants';
import ScreenContainer from '@components/ScreenContainer';
import {
    logger
} from '@utils/logger';

/**
 * SettingsScreen component — data management and app info.
 *
 * @returns {JSX.Element}
 */
const SettingsScreen = () => {
    const navigation = useNavigation();
    const {
        notes,
        deleteMultiple,
        lastDeletedNote,
        restoreLastDeleted,
    } = useNotes();
    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.lg);
    const {
        colors
    } = useTheme();
    const {
        animatedStyle: fadeInStyle,
        startAnimation: startFadeIn
    } = useFadeIn();

    useEffect(() => {
        startFadeIn();
    }, [startFadeIn]);

    /** Show destructive confirmation, then delete every note. */
    const handleClearAllNotesPress = () => {
        Alert.alert(
            'Clear All Notes',
            'Are you sure you want to delete all notes? This action cannot be undone.', [{
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async() => {
                        try {
                            const allNoteIds = notes.map(n => n.id);
                            if (allNoteIds.length > 0) {
                                await deleteMultiple(allNoteIds);
                                Alert.alert('Success', 'All notes have been deleted');
                            } else {
                                Alert.alert('Info', 'No notes to delete');
                            }
                        } catch (error) {
                            logger.error('Failed to clear notes:', error);
                            Alert.alert('Error', 'Failed to clear notes');
                        }
                    },
                },
            ],
        );
    };

    /**
     * Write exported file to cache and invoke the system share sheet.
     * Falls back to plain text sharing when `expo-sharing` is unavailable (web).
     */
    const shareExportFile = async(format, contents, mimeType) => {
        const filename = ExportService.getExportFilename(format);
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;

        await FileSystem.writeAsStringAsync(fileUri, contents, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType,
                dialogTitle: 'Export Notes',
            });
        } else {
            await Share.share({
                message: contents,
                title: 'Neuro Sparks Notes Export',
            });
        }
    };

    /** Dispatch export to the correct format handler and show result alert. */
    const exportNotesAs = async(format) => {
        if (notes.length === 0) {
            Alert.alert('Info', 'No notes to export');
            return;
        }

        try {
            if (format === 'csv') {
                const csv = await ExportService.exportToCSV(notes);
                await shareExportFile('csv', csv, 'text/csv');
            } else if (format === 'markdown') {
                const markdown = await ExportService.exportToMarkdown(notes);
                await shareExportFile('markdown', markdown, 'text/markdown');
            } else {
                const json = await ExportService.exportToJSON(notes);
                await shareExportFile('json', json, 'application/json');
            }

            Alert.alert('Success', SUCCESS_MESSAGES.NOTES_EXPORTED);
        } catch (error) {
            logger.error('Failed to export notes:', error);
            Alert.alert('Error', 'Failed to export notes');
        }
    };

    /** Show format-picker dialog and trigger export. */
    const handleExportNotesPress = () => {
        Alert.alert('Export Notes', 'Choose a file format.', [
            { text: 'JSON', onPress: () => exportNotesAs('json') },
            { text: 'CSV', onPress: () => exportNotesAs('csv') },
            { text: 'Markdown', onPress: () => exportNotesAs('markdown') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    /** Attempt to restore the most recently deleted note. */
    const handleRestoreDeletedPress = async() => {
        try {
            const restored = await restoreLastDeleted();
            if (restored) {
                Alert.alert('Restored', `"${restored.title}" is back in your notes.`);
            } else {
                Alert.alert('Nothing to Restore', 'No recently deleted note is available.');
            }
        } catch (error) {
            logger.error('Failed to restore note:', error);
            Alert.alert('Error', 'Failed to restore note');
        }
    };

    /** Display version and project info in an alert dialog. */
    const handleAboutPress = () => {
        Alert.alert(
            'About Neuro Sparks',
            `Version ${APP_VERSION}\n\nA production-grade sci-fi themed notes application built with React Native and Expo.`, [{
                text: 'OK'
            }],
        );
    };

    /** Configuration array driving the settings list UI. */
    const settingsItems = [{
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
            icon: 'restore',
            title: 'Restore Last Deleted',
            description: lastDeletedNote ? `Restore "${lastDeletedNote.title}"` : 'No recently deleted note',
            handlePress: handleRestoreDeletedPress,
            color: lastDeletedNote ? THEME.colors.accent_cyan : THEME.colors.text_tertiary,
        },
        {
            icon: 'information',
            title: 'About',
            description: 'App version and information',
            handlePress: handleAboutPress,
            color: THEME.colors.text_secondary,
        },
    ];

    return ( <
        ScreenContainer >
        <
        Animated.View style = {
            [styles.header, fadeInStyle, {
                backgroundColor: colors.bg_dark,
                borderBottomColor: colors.border_medium
            }]
        } >
        <
        TouchableOpacity onPress = {
            () => navigation.goBack() }
        style = { styles.backButton } >
        <
        MaterialCommunityIcons name = "arrow-left"
        size = { 24 }
        color = { colors.text_primary }
        /> <
        /TouchableOpacity> <
        Text style = {
            [styles.headerTitle, {
                fontSize: responsiveFontSize,
                color: colors.text_primary
            }]
        } > Settings < /Text> <
        /Animated.View>

        <
        Animated.ScrollView style = {
            [styles.content, { backgroundColor: colors.bg_dark }] } >
        <
        Animated.View entering = { FadeInDown.delay(100).springify() } >
        <
        View style = {
            [styles.section, { backgroundColor: colors.bg_card }] } >
        <
        Text style = {
            [styles.sectionTitle, { color: colors.text_secondary }] } > Data Management < /Text> {
            settingsItems.slice(0, 3).map((item, index) => ( <
                TouchableOpacity key = { index }
                style = { styles.settingItem }
                onPress = { item.handlePress } >
                <
                View style = { styles.settingItemLeft } >
                <
                MaterialCommunityIcons name = { item.icon }
                size = { 24 }
                color = { item.color }
                style = { styles.settingIcon }
                /> <
                View style = { styles.settingItemText } >
                <
                Text style = {
                    [styles.settingTitle, { color: colors.text_primary }] } > { item.title } < /Text> <
                Text style = {
                    [styles.settingDescription, { color: colors.text_tertiary }] } > { item.description } < /Text> <
                /View> <
                /View> <
                MaterialCommunityIcons name = "chevron-right"
                size = { 24 }
                color = { colors.text_tertiary }
                /> <
                /TouchableOpacity>
            ))
        } <
        /View> <
        /Animated.View>

        <
        Animated.View entering = { FadeInDown.delay(200).springify() } >
        <
        View style = {
            [styles.section, { backgroundColor: colors.bg_card }] } >
        <
        Text style = {
            [styles.sectionTitle, { color: colors.text_secondary }] } > About < /Text> {
            settingsItems.slice(3).map((item, index) => ( <
                TouchableOpacity key = { index }
                style = { styles.settingItem }
                onPress = { item.handlePress } >
                <
                View style = { styles.settingItemLeft } >
                <
                MaterialCommunityIcons name = { item.icon }
                size = { 24 }
                color = { item.color }
                style = { styles.settingIcon }
                /> <
                View style = { styles.settingItemText } >
                <
                Text style = {
                    [styles.settingTitle, { color: colors.text_primary }] } > { item.title } < /Text> <
                Text style = {
                    [styles.settingDescription, { color: colors.text_tertiary }] } > { item.description } < /Text> <
                /View> <
                /View> <
                MaterialCommunityIcons name = "chevron-right"
                size = { 24 }
                color = { colors.text_tertiary }
                /> <
                /TouchableOpacity>
            ))
        } <
        /View> <
        /Animated.View>

        <
        Animated.View entering = { FadeInDown.delay(300).springify() } >
        <
        View style = { styles.infoSection } >
        <
        Text style = {
            [styles.infoText, { color: colors.text_tertiary }] } > Neuro Sparks v { APP_VERSION } < /Text> <
        Text style = {
            [styles.infoText, { color: colors.text_tertiary }] } > Built with React Native and Expo < /Text> <
        /View> <
        /Animated.View> <
        /Animated.ScrollView> <
        /ScreenContainer>
    );
};

/* ========================================================================== */
/*  Styles                                                                    */
/* ========================================================================== */
const styles = StyleSheet.create({
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
        marginRight: THEME.spacing.sm
    },
    headerTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        flex: 1
    },
    content: {
        flex: 1
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
        flex: 1
    },
    settingIcon: {
        marginRight: THEME.spacing.md
    },
    settingItemText: {
        flex: 1
    },
    settingTitle: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.medium,
        marginBottom: THEME.spacing.xs,
    },
    settingDescription: {
        fontSize: THEME.fontSizes.sm
    },
    infoSection: {
        marginTop: THEME.spacing.xl,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.lg,
        alignItems: 'center',
    },
    infoText: {
        fontSize: THEME.fontSizes.sm,
        marginBottom: THEME.spacing.xs
    },
});

export default SettingsScreen;