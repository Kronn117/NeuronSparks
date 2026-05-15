/**
 * NoteCard Component
 * Displays a single note in list view
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@utils/theme';
import { truncateText, getTimeAgo } from '@utils/helpers';

const NoteCard = ({ note, onPress, onDelete, onTogglePin }) => {
    const handleDelete = useCallback(() => {
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            { text: 'Cancel', onPress: () => null },
            {
                text: 'Delete',
                onPress: () => onDelete?.(note.id),
                style: 'destructive',
            },
        ]);
    }, [note.id, onDelete]);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(note.id)}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.colorIndicator,
                    { backgroundColor: note.color || THEME.colors.note_blue },
                ]}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {note.title}
                    </Text>
                    {note.isPinned ? (
                        <MaterialCommunityIcons
                            name="pin"
                            size={16}
                            color={THEME.colors.primary}
                        />
                    ) : null}
                </View>

                <Text style={styles.timestamp}>{getTimeAgo(note.updatedAt)}</Text>

                {note.content ? (
                    <Text style={styles.preview} numberOfLines={2}>
                        {truncateText(note.content, 80)}
                    </Text>
                ) : null}

                {note.tags?.length > 0 ? (
                    <View style={styles.tagsContainer}>
                        {note.tags.slice(0, 3).map(tag => (
                            <Text key={tag} style={styles.tag}>
                                #{tag}
                            </Text>
                        ))}
                        {note.tags.length > 3 ? (
                            <Text style={styles.moreTag}>+{note.tags.length - 3}</Text>
                        ) : null}
                    </View>
                ) : null}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onTogglePin?.(note.id)}
                        hitSlop={10}
                    >
                        <MaterialCommunityIcons
                            name={note.isPinned ? 'pin' : 'pin-outline'}
                            size={20}
                            color={
                                note.isPinned
                                    ? THEME.colors.primary
                                    : THEME.colors.text_secondary
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} hitSlop={10}>
                        <MaterialCommunityIcons
                            name="delete-outline"
                            size={20}
                            color={THEME.colors.text_secondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.bg_secondary,
        borderRadius: THEME.borderRadius.lg,
        marginVertical: THEME.spacing.sm,
        marginHorizontal: THEME.spacing.md,
        ...THEME.shadows.small,
        overflow: 'hidden',
    },
    colorIndicator: {
        width: 6,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.sm,
    },
    title: {
        flex: 1,
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: THEME.colors.text_primary,
    },
    timestamp: {
        fontSize: THEME.fontSizes.xs,
        color: THEME.colors.text_tertiary,
        marginBottom: THEME.spacing.xs,
    },
    preview: {
        fontSize: THEME.fontSizes.sm,
        color: THEME.colors.text_secondary,
        marginBottom: THEME.spacing.sm,
        lineHeight: 18,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: THEME.spacing.sm,
    },
    tag: {
        fontSize: THEME.fontSizes.xs,
        color: THEME.colors.accent_cyan,
        marginRight: THEME.spacing.sm,
        marginTop: THEME.spacing.xs,
    },
    moreTag: {
        fontSize: THEME.fontSizes.xs,
        color: THEME.colors.text_tertiary,
        marginTop: THEME.spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: THEME.spacing.sm,
        justifyContent: 'flex-start',
    },
    actionButton: {
        marginRight: THEME.spacing.md,
    },
});

export default NoteCard;
