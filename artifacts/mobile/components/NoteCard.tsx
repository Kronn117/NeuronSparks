import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useColors } from '@/hooks/useColors';
import { Note } from '@/types/note';

interface NoteCardProps {
  note: Note;
  onLongPress?: () => void;
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function NoteCard({ note, onLongPress }: NoteCardProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    router.push(`/note/${note.id}`);
  };

  const handleLongPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const preview =
    note.content.length > 100
      ? note.content.substring(0, 100) + '…'
      : note.content || 'No content';

  return (
    <Pressable
      testID={`note-card-${note.id}`}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[styles.colorBar, { backgroundColor: note.color }]}
      />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {note.title || 'Untitled'}
          </Text>
          <View style={styles.icons}>
            {note.isPinned && (
              <Feather name="bookmark" size={13} color={note.color} style={styles.statusIcon} />
            )}
            {note.isArchived && (
              <Feather name="archive" size={13} color={colors.mutedForeground} style={styles.statusIcon} />
            )}
          </View>
        </View>

        <Text
          style={[styles.preview, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {preview}
        </Text>

        <View style={styles.bottomRow}>
          <View
            style={[
              styles.categoryBadge,
              { borderColor: note.color + '66', backgroundColor: note.color + '1a' },
            ]}
          >
            <Text style={[styles.categoryText, { color: note.color }]}>
              {note.category}
            </Text>
          </View>

          {note.tags.slice(0, 2).map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}
            >
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                #{tag}
              </Text>
            </View>
          ))}
          {note.tags.length > 2 && (
            <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
              +{note.tags.length - 2}
            </Text>
          )}

          <View style={{ flex: 1 }} />
          <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
            {formatRelativeTime(note.updatedAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  colorBar: {
    width: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
  icons: {
    flexDirection: 'row',
    gap: 4,
  },
  statusIcon: {
    marginLeft: 2,
  },
  preview: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});
