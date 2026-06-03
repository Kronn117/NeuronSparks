/**
 * Create Screen
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
    useRoute
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
    NOTE_COLORS,
    DEFAULT_NOTE_COLOR
} from '@utils/constants';
import ScreenContainer from '@components/ScreenContainer';
import {
    logger
} from '@utils/logger';

const EMPTY_INITIAL = {
    title: '',
    content: '',
    tags: []
};

const CreateScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        addNote
    } = useNotes();
    const routeParams = route.params || {};
    const initialData = routeParams.initialData || EMPTY_INITIAL;

    const responsiveFontSize = useResponsiveFontSize(THEME.fontSizes.xl);
    const {
        colors
    } = useTheme();
    const {
        animatedStyle: fadeInStyle,
        startAnimation: startFadeIn
    } = useFadeIn();

    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.content || '');
    const [selectedTags, setSelectedTags] = useState(initialData.tags || []);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_NOTE_COLOR);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        startFadeIn();
    }, [startFadeIn]);

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
            await addNote({
                title: title.trim(),
                content: content.trim(),
                tags: selectedTags,
                color: selectedColor,
                isPinned: false,
                isArchived: false,
            });
            navigation.goBack();
        } catch (error) {
            logger.error('Failed to save note:', error);
            Alert.alert('Error', 'Failed to save note. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [title, content, selectedTags, selectedColor, addNote, navigation]);

    return (
        <ScreenContainer>
            <Animated.View style={[styles.header, fadeInStyle, {
                backgroundColor: colors.bg_dark,
                borderBottomColor: colors.border_medium
            }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text_primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, {
                    fontSize: responsiveFontSize,
                    color: colors.text_primary
                }]}>New Note</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
                    <MaterialCommunityIcons
                        name="check"
                        size={24}
                        color={loading ? colors.text_tertiary : colors.primary}
                    />
                </TouchableOpacity>
            </Animated.View>

            <Animated.ScrollView
                style={[styles.content, { backgroundColor: colors.bg_dark }]}
                keyboardShouldPersistTaps="handled"
            >
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <TextInput
                        style={[styles.titleInput, { color: colors.text_primary }]}
                        placeholder="Note title..."
                        placeholderTextColor={colors.text_tertiary}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
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
    headerTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold
    },
    saveButton: {
        padding: THEME.spacing.sm
    },
    content: {
        flex: 1,
        padding: THEME.spacing.md
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
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.sm
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
});

export default CreateScreen;