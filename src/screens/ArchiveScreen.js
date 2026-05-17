/**
 * Archive Screen
 * Screen for viewing and managing archived notes with Tony Stark-style UI
 */

import React, { useCallback, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { THEME } from '@utils/theme';
import { useNotes } from '@hooks/useNotes';
import { useResponsive, useResponsiveFontSize } from '@hooks/useResponsive';
import { useFadeIn } from '@hooks/useAnimations';
import { useTheme } from '@context/ThemeContext';
import NoteCard from '@components/NoteCard';
import EmptyState from '@components/EmptyState';
import { logger } from '@utils/logger';

const ArchiveScreen = () => {
    const navigation = useNavigation();
    const { getArchivedNotes, toggleArchive, deleteNote } = useNotes();

    const archivedNotes = getArchivedNotes();

    // Responsive design
    const { isMobile, isTablet } = useResponsive();
    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.xl);

    // Theme context for dynamic colors
    const { colors, shadows, isDarkMode } = useTheme();

    // Animations
    const { animatedStyle: fadeInStyle, startAnimation: startFadeIn } = useFadeIn();

    useEffect(() => {
        startFadeIn();
    }, [startFadeIn]);

    const handleNotePress = useCallback((note) => {
        navigation.navigate('Detail', { note });
    }, [navigation]);

    const handleRestore = useCallback(async (noteId) => {
        try {
            await toggleArchive(noteId);
            logger.log('✅ Note restored from archive');
        } catch (error) {
            logger.error('❌ Failed to restore note:', error);
        }
    }, [toggleArchive]);

    const handleDelete = useCallback(async (noteId) => {
        try {
            await deleteNote(noteId);
            logger.log('✅ Note deleted from archive');
        } catch (error) {
            logger.error('❌ Failed to delete note:', error);
        }
    }, [deleteNote]);

    const renderNoteCard = useCallback(({ item }) => (
        <NoteCard
            note={item}
            onPress={handleNotePress}
            onDelete={handleDelete}
        />
    ), [handleNotePress, handleDelete]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg_dark }]}>
            <Animated.View style={[styles.header, fadeInStyle, { backgroundColor: colors.bg_dark, borderBottomColor: colors.border_medium }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text_primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontSize: responsiveFontSize, color: colors.text_primary }]}>Archived Notes</Text>
            </Animated.View>

            {archivedNotes.length === 0 ? (
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <EmptyState
                        icon="inbox"
                        title="Archive Empty"
                        description="Archived notes will appear here"
                    />
                </Animated.View>
            ) : (
                <FlatList
                    data={archivedNotes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                            <NoteCard
                                note={item}
                                onPress={handleNotePress}
                                onDelete={handleDelete}
                            />
                        </Animated.View>
                    )}
                    contentContainerStyle={styles.listContent}
                    numColumns={isTablet ? 2 : 1}
                    columnWrapperStyle={isTablet ? styles.row : null}
                />
            )}
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
    },
    listContent: {
        paddingBottom: THEME.spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
    },
});

export default ArchiveScreen;