/**
 * Home Screen
 * Main note list view
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    FlatList,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME } from '@utils/theme';
import { useNotes } from '@hooks/useNotes';
import NoteCard from '@components/NoteCard';
import SearchBar from '@components/SearchBar';
import FAB from '@components/FAB';
import LoadingSpinner from '@components/LoadingSpinner';
import EmptyState from '@components/EmptyState';
import { logger } from '@utils/logger';

const HomeScreen = ({ navigation }) => {
    const { notes, loading, getPinnedNotes, getRegularNotes, togglePin, deleteNote } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');

    useFocusEffect(
        useCallback(() => {
            logger.log('🏠 HomeScreen focused');
        }, []),
    );

    const pinnedNotes = useMemo(() => getPinnedNotes(), [getPinnedNotes]);
    const regularNotes = useMemo(() => getRegularNotes(), [getRegularNotes]);

    const filteredRegular = useMemo(() => {
        if (!searchQuery) return regularNotes;
        return regularNotes.filter(
            (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [regularNotes, searchQuery]);

    const handleNotePress = useCallback(
        (note) => {
            navigation.navigate('Detail', { note });
        }, [navigation],
    );

    const handleCreatePress = useCallback(() => {
        navigation.navigate('Create', { initialData: { title: '', content: '', tags: [] } });
    }, [navigation]);

    const handleSearchPress = useCallback(() => {
        navigation.navigate('Search');
    }, [navigation]);

    const handleSettingsPress = useCallback(() => {
        navigation.navigate('Settings');
    }, [navigation]);

    if (loading) {
        return <LoadingSpinner message="Loading notes..." />;
    }

    const noteListData =
        pinnedNotes.length > 0 ?
        [
            { type: 'header', title: `📌 Pinned (${pinnedNotes.length})` },
            ...pinnedNotes.map((n) => ({ type: 'note', data: n })),
            { type: 'header', title: `📝 All Notes (${filteredRegular.length})` },
            ...filteredRegular.map((n) => ({ type: 'note', data: n })),
        ] :
        [
            { type: 'header', title: `📝 All Notes (${filteredRegular.length})` },
            ...filteredRegular.map((n) => ({ type: 'note', data: n })),
        ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.colors.bg_dark} />

            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <MaterialCommunityIcons
                        name="brain"
                        size={28}
                        color={THEME.colors.primary}
                        style={styles.icon}
                    />
                    <Text style={styles.title}>Neuron Sparks</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleSearchPress} hitSlop={10}>
                        <MaterialCommunityIcons
                            name="magnify"
                            size={24}
                            color={THEME.colors.text_primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSettingsPress}
                        hitSlop={10}
                        style={styles.settingsIcon}
                    >
                        <MaterialCommunityIcons
                            name="cog"
                            size={24}
                            color={THEME.colors.text_primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search notes..."
            />

            {notes.length === 0 ? (
                <EmptyState
                    icon="lightbulb-outline"
                    title="No Notes Yet"
                    description="Start creating notes to organize your thoughts"
                    primaryAction={handleCreatePress}
                    primaryText="Create First Note"
                />
            ) : filteredRegular.length === 0 && pinnedNotes.length === 0 ? (
                <EmptyState
                    icon="magnify"
                    title="No Results"
                    description="Try searching with different keywords"
                />
            ) : (
                <FlatList
                    data={noteListData}
                    keyExtractor={(item, index) => `${item.type}-${index}`}
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return <Text style={styles.sectionHeader}>{item.title}</Text>;
                        }
                        return (
                            <NoteCard
                                note={item.data}
                                onPress={() => handleNotePress(item.data)}
                                onDelete={deleteNote}
                                onTogglePin={togglePin}
                            />
                        );
                    }}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled
                />
            )}

            <FAB icon="plus" onPress={handleCreatePress} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.bg_dark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: THEME.colors.border_medium,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: THEME.spacing.sm,
    },
    title: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.bold,
        color: THEME.colors.text_primary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIcon: {
        marginLeft: THEME.spacing.lg,
    },
    sectionHeader: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: THEME.colors.text_secondary,
        marginHorizontal: THEME.spacing.md,
        marginTop: THEME.spacing.md,
        marginBottom: THEME.spacing.sm,
    },
    listContent: {
        paddingBottom: 80,
    },
});

export default HomeScreen;
