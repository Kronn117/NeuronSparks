/**
 * Home Screen
 */

import React, {
    useCallback,
    useMemo,
    useState,
    useEffect
} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    useSafeAreaInsets
} from 'react-native-safe-area-context';
import {
    useFocusEffect
} from '@react-navigation/native';
import {
    MaterialCommunityIcons
} from '@expo/vector-icons';
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
    useResponsive,
    useResponsiveFontSize
} from '@hooks/useResponsive';
import {
    useFadeIn,
    useFloating
} from '@hooks/useAnimations';
import {
    useTheme
} from '@context/ThemeContext';
import NoteCard from '@components/NoteCard';
import SearchBar from '@components/SearchBar';
import FAB from '@components/FAB';
import LoadingSpinner from '@components/LoadingSpinner';
import EmptyState from '@components/EmptyState';
import ScreenContainer from '@components/ScreenContainer';
import {
    logger
} from '@utils/logger';

const HomeScreen = ({
    navigation
}) => {
    const {
        notes,
        loading,
        getPinnedNotes,
        getRegularNotes,
        togglePin,
        deleteNote
    } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');

    const {
        isTablet
    } = useResponsive();
    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.xl);
    const insets = useSafeAreaInsets();
    const {
        colors,
        shadows
    } = useTheme();

    const {
        animatedStyle: fadeInStyle,
        startAnimation: startFadeIn
    } = useFadeIn();
    const {
        animatedStyle: floatingStyle,
        startFloating
    } = useFloating();

    useEffect(() => {
        startFadeIn();
        startFloating();
    }, [startFadeIn, startFloating]);

    useFocusEffect(
        useCallback(() => {
            logger.log('HomeScreen focused');
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
            navigation.navigate('Detail', {
                note
            });
        },
        [navigation],
    );

    const handleCreatePress = useCallback(() => {
        navigation.navigate('Create', {
            initialData: {
                title: '',
                content: '',
                tags: []
            }
        });
    }, [navigation]);

    const handleSearchPress = useCallback(() => {
        navigation.navigate('Search');
    }, [navigation]);

    if (loading) {
        return <LoadingSpinner message="Loading notes..." />;
    }

    const noteListData =
        pinnedNotes.length > 0 ?
        [{
                type: 'header',
                title: `Pinned (${pinnedNotes.length})`
            },
            ...pinnedNotes.map((n) => ({
                type: 'note',
                data: n
            })),
            {
                type: 'header',
                title: `All Notes (${filteredRegular.length})`
            },
            ...filteredRegular.map((n) => ({
                type: 'note',
                data: n
            })),
        ] :
        [{
                type: 'header',
                title: `All Notes (${filteredRegular.length})`
            },
            ...filteredRegular.map((n) => ({
                type: 'note',
                data: n
            })),
        ];

    const fabBottom = insets.bottom + THEME.spacing.xl;
    const listBottomPadding = insets.bottom + THEME.spacing.xxl + 56;

    return (
        <ScreenContainer>
            <Animated.View style={[styles.header, fadeInStyle, {
                backgroundColor: colors.bg_dark,
                borderBottomColor: colors.border_medium
            }]}>
                <View style={styles.headerLeft}>
                    <Animated.View style={[styles.arcReactorIcon, floatingStyle, {
                        backgroundColor: colors.primary,
                        ...shadows.glow
                    }]}>
                        <MaterialCommunityIcons name="flash" size={20} color={colors.text_inverse} />
                    </Animated.View>
                    <Text style={[styles.headerTitle, {
                        fontSize: responsiveFontSize,
                        color: colors.text_primary
                    }]}>Neuron Sparks</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleSearchPress} hitSlop={10} style={styles.headerButton}>
                        <MaterialCommunityIcons name="magnify" size={24} color={colors.text_primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} hitSlop={10} style={styles.headerButton}>
                        <MaterialCommunityIcons name="cog" size={24} color={colors.text_primary} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search notes..." />

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
                    renderItem={({ item, index }) => {
                        if (item.type === 'header') {
                            return (
                                <Animated.View entering={FadeInDown.delay(100).springify()}>
                                    <View style={[styles.sectionHeader, { backgroundColor: colors.bg_dark }]}>
                                        <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>{item.title}</Text>
                                    </View>
                                </Animated.View>
                            );
                        }
                        return (
                            <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                                <NoteCard
                                    note={item.data}
                                    onPress={() => handleNotePress(item.data)}
                                    onDelete={deleteNote}
                                    onTogglePin={togglePin}
                                />
                            </Animated.View>
                        );
                    }}
                    contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPadding }]}
                    key={isTablet ? 'grid' : 'list'}
                    scrollEnabled
                    numColumns={isTablet ? 2 : 1}
                    columnWrapperStyle={isTablet ? styles.row : null}
                />
            )}

            <FAB icon="plus" onPress={handleCreatePress} bottom={fabBottom} />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing.md,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    arcReactorIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.md,
    },
    headerTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerButton: {
        padding: THEME.spacing.sm,
        marginLeft: THEME.spacing.sm
    },
    sectionHeader: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        marginTop: THEME.spacing.md,
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.semibold
    },
    listContent: {
        paddingBottom: THEME.spacing.xxl
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md
    },
});

export default HomeScreen;