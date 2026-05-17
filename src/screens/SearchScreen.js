/**
 * Search Screen
 * Screen for searching notes with Tony Stark-style UI
 */

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    FlatList,
    StatusBar,
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

const SearchScreen = () => {
    const navigation = useNavigation();
    const { notes } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

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

    const allTags = useMemo(() => {
        const tagSet = new Set();
        notes.forEach(note => {
            note.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    }, [notes]);

    const filteredNotes = useMemo(() => {
        let filtered = notes.filter(note => !note.isArchived);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            );
        }

        if (selectedTag) {
            filtered = filtered.filter(note =>
                note.tags?.includes(selectedTag)
            );
        }

        return filtered;
    }, [notes, searchQuery, selectedTag]);

    const handleNotePress = useCallback((note) => {
        navigation.navigate('Detail', { note });
    }, [navigation]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg_dark }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.bg_dark} />

            <Animated.View style={[styles.header, fadeInStyle, { backgroundColor: colors.bg_dark, borderBottomColor: colors.border_medium }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text_primary} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { backgroundColor: colors.bg_secondary }]}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color={colors.text_tertiary}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text_primary }]}
                        placeholder="Search notes..."
                        placeholderTextColor={colors.text_tertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={20}
                                color={colors.text_tertiary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            {allTags.length > 0 && (
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={[styles.tagsSection, { borderBottomColor: colors.border_medium }]}>
                        <Text style={[styles.tagsTitle, { color: colors.text_secondary }]}>Filter by tag:</Text>
                        <FlatList
                            horizontal
                            data={allTags}
                            keyExtractor={(tag) => tag}
                            renderItem={({ item: tag }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.tagChip,
                                        { backgroundColor: colors.bg_secondary, borderColor: colors.border_medium },
                                        selectedTag === tag && { backgroundColor: colors.primary, borderColor: colors.primary },
                                    ]}
                                    onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                >
                                    <Text
                                        style={[
                                            styles.tagChipText,
                                            { color: colors.text_secondary },
                                            selectedTag === tag && { color: colors.text_inverse },
                                        ]}
                                    >
                                        #{tag}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tagsList}
                        />
                    </View>
                </Animated.View>
            )}

            {filteredNotes.length === 0 ? (
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <EmptyState
                        icon="magnify"
                        title="No Results"
                        description={searchQuery || selectedTag ? "Try different search terms or filters" : "Create some notes to search"}
                    />
                </Animated.View>
            ) : (
                <FlatList
                    data={filteredNotes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                            <NoteCard
                                note={item}
                                onPress={handleNotePress}
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
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: THEME.borderRadius.md,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
    },
    searchIcon: {
        marginRight: THEME.spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: THEME.fontSizes.md,
    },
    tagsSection: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: 1,
    },
    tagsTitle: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.semibold,
        marginBottom: THEME.spacing.sm,
    },
    tagsList: {
        paddingRight: THEME.spacing.md,
    },
    tagChip: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        marginRight: THEME.spacing.sm,
    },
    tagChipText: {
        fontSize: THEME.fontSizes.sm,
    },
    listContent: {
        paddingBottom: THEME.spacing.xl,
    },
    row: {
        justifyContent: 'space-between',
    },
});

export default SearchScreen;