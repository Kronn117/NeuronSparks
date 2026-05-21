/**
 * Detail Screen
 */

import React, {
    useState,
    useCallback,
    useEffect
} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import {
    MaterialCommunityIcons
} from '@expo/vector-icons';
import {
    useNavigation,
    useRoute,
    useFocusEffect
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
    DEFAULT_TAGS,
    NOTE_COLORS
} from '@utils/constants';
import {
    getTimeAgo
} from '@utils/helpers';
import ScreenContainer from '@components/ScreenContainer';
import {
    logger
} from '@utils/logger';

const DetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params || {};
    const initialNote = routeParams.note;
    const {
        updateNote,
        deleteNote,
        togglePin
    } = useNotes();

    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.xl);
    const {
        colors
    } = useTheme();
    const {
        animatedStyle: fadeInStyle,
        startAnimation: startFadeIn
    } = useFadeIn();

    const safeInitial = initialNote || {};
    const [note, setNote] = useState(safeInitial);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(safeInitial.title || '');
    const [content, setContent] = useState(safeInitial.content || '');
    const [selectedTags, setSelectedTags] = useState(safeInitial.tags || []);
    const [selectedColor, setSelectedColor] = useState(safeInitial.color || NOTE_COLORS[0].value);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        startFadeIn();
    }, [startFadeIn]);

    useFocusEffect(
        useCallback(() => {
            if (initialNote) {
                setNote(initialNote);
                setTitle(initialNote.title || '');
                setContent(initialNote.content || '');
                setSelectedTags(initialNote.tags || []);
                setSelectedColor(initialNote.color || NOTE_COLORS[0].value);
            }
        }, [initialNote]),
    );

    const toggleTag = useCallback((tagId) => {
        const tag = DEFAULT_TAGS.find(t => t.id === tagId);
        if (!tag) return;

        setSelectedTags(prev => {
            if (prev.includes(tag.label)) {
                return prev.filter(t => t !== tag.label);
            }
            if (prev.length >= 5) {
                Alert.alert('Limit Reached', 'Maximum 5 tags allowed');
                return prev;
            }
            return [...prev, tag.label];
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        try {
            setLoading(true);
            const updated = await updateNote(note.id, {
                title: title.trim(),
                content: content.trim(),
                tags: selectedTags,
                color: selectedColor,
            });
            setNote(updated);
            setIsEditing(false);
        } catch (error) {
            logger.error('Failed to update note:', error);
            Alert.alert('Error', 'Failed to update note. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [title, content, selectedTags, selectedColor, note.id, updateNote]);

    const handleDelete = useCallback(() => {
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [{
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteNote(note.id);
                        navigation.goBack();
                    } catch (error) {
                        logger.error('Failed to delete note:', error);
                        Alert.alert('Error', 'Failed to delete note');
                    }
                },
            },
        ]);
    }, [note.id, deleteNote, navigation]);

    const handleTogglePin = useCallback(async () => {
        try {
            await togglePin(note.id);
            setNote(prev => ({
                ...prev,
                isPinned: !prev.isPinned
            }));
        } catch (error) {
            logger.error('Failed to toggle pin:', error);
        }
    }, [note.id, togglePin]);

    if (!note.id) {
        return (
            <ScreenContainer>
                <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color={THEME.colors.text_tertiary} />
                    <Text style={styles.errorText}>Note not found</Text>
                </View>
            </ScreenContainer>
        );
    }

    const noteTags = note.tags || [];

    return (
        <ScreenContainer>
            <Animated.View style={[styles.header, fadeInStyle, {
                backgroundColor: colors.bg_dark,
                borderBottomColor: colors.border_medium
            }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text_primary} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    {isEditing ? (
                        <TouchableOpacity onPress={handleSave} style={styles.actionButton} disabled={loading}>
                            <MaterialCommunityIcons
                                name="check"
                                size={24}
                                color={loading ? colors.text_tertiary : colors.primary}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
                            <MaterialCommunityIcons name="pencil" size={24} color={colors.text_primary} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleTogglePin} style={styles.actionButton}>
                        <MaterialCommunityIcons
                            name={note.isPinned ? 'pin' : 'pin-outline'}
                            size={24}
                            color={note.isPinned ? colors.primary : colors.text_primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color={colors.text_primary} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.ScrollView
                style={[styles.content, { backgroundColor: colors.bg_dark }]}
                keyboardShouldPersistTaps="handled"
            >
                {isEditing ? (
                    <>
                        <Animated.View entering={FadeInDown.delay(100).springify()}>
                            <TextInput
                                style={[styles.titleInput, { color: colors.text_primary }]}
                                placeholder="Note title..."
                                placeholderTextColor={colors.text_tertiary}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            <TextInput
                                style={[styles.contentInput, { color: colors.text_secondary }]}
                                placeholder="Write your note here..."
                                placeholderTextColor={colors.text_tertiary}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                textAlignVertical="top"
                            />
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(300).springify()}>
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>Color</Text>
                                <View style={styles.colorOptions}>
                                    {NOTE_COLORS.map(color => (
                                        <TouchableOpacity
                                            key={color.value}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: color.value },
                                                selectedColor === color.value && styles.selectedColor,
                                            ]}
                                            onPress={() => setSelectedColor(color.value)}
                                        >
                                            {selectedColor === color.value ? (
                                                <MaterialCommunityIcons name="check" size={20} color={colors.text_inverse} />
                                            ) : null}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(400).springify()}>
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: colors.text_secondary }]}>Tags</Text>
                                <View style={styles.tagsContainer}>
                                    {DEFAULT_TAGS.map(tag => (
                                        <TouchableOpacity
                                            key={tag.id}
                                            style={[
                                                styles.tagOption,
                                                { borderColor: tag.color },
                                                selectedTags.includes(tag.label) && { backgroundColor: tag.color },
                                            ]}
                                            onPress={() => toggleTag(tag.id)}
                                        >
                                            <Text style={[styles.tagText, {
                                                color: selectedTags.includes(tag.label) ? colors.text_inverse : tag.color
                                            }]}>
                                                #{tag.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </Animated.View>
                    </>
                ) : (
                    <>
                        <Animated.View entering={FadeInDown.delay(100).springify()}>
                            <Text style={[styles.title, {
                                fontSize: responsiveFontSize,
                                color: colors.text_primary
                            }]}>{note.title}</Text>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            <Text style={[styles.timestamp, { color: colors.text_tertiary }]}>{getTimeAgo(note.updatedAt)}</Text>
                        </Animated.View>
                        <Animated.View entering={FadeInDown.delay(300).springify()}>
                            {note.content ? (
                                <Text style={[styles.contentText, { color: colors.text_secondary }]}>{note.content}</Text>
                            ) : null}
                        </Animated.View>
                        {noteTags.length > 0 ? (
                            <Animated.View entering={FadeInDown.delay(400).springify()}>
                                <View style={styles.tagsContainer}>
                                    {noteTags.map(tag => (
                                        <Text key={tag} style={[styles.tag, { color: colors.accent_cyan }]}>
                                            #{tag}
                                        </Text>
                                    ))}
                                </View>
                            </Animated.View>
                        ) : null}
                    </>
                )}
            </Animated.ScrollView>
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
    backButton: {
        padding: THEME.spacing.sm
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionButton: {
        padding: THEME.spacing.sm,
        marginLeft: THEME.spacing.sm
    },
    content: {
        flex: 1,
        padding: THEME.spacing.md
    },
    title: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        marginBottom: THEME.spacing.sm,
    },
    timestamp: {
        fontSize: THEME.fontSizes.sm,
        marginBottom: THEME.spacing.lg
    },
    contentText: {
        fontSize: THEME.fontSizes.md,
        lineHeight: 24,
        marginBottom: THEME.spacing.lg
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: THEME.spacing.lg
    },
    tag: {
        fontSize: THEME.fontSizes.sm,
        marginRight: THEME.spacing.sm,
        marginBottom: THEME.spacing.sm
    },
    titleInput: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.bold,
        marginBottom: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
    },
    contentInput: {
        fontSize: THEME.fontSizes.md,
        minHeight: 200,
        marginBottom: THEME.spacing.lg,
        lineHeight: 22,
    },
    section: {
        marginBottom: THEME.spacing.lg
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.semibold,
        marginBottom: THEME.spacing.sm,
    },
    colorOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.sm
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: THEME.colors.primary
    },
    tagOption: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
    },
    tagText: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.medium
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        fontSize: THEME.fontSizes.md,
        marginTop: THEME.spacing.md
    },
});

export default DetailScreen;