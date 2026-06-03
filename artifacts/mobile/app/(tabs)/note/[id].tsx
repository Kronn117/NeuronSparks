import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryPicker, ColorPicker, TagChips } from '@/components/ColorPicker';
import { useNotes } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';
import { NOTE_COLORS, NoteCategory, NoteColor } from '@/types/note';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, updateNote, deleteNote, togglePin, toggleArchive } = useNotes();

  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [noteColor, setNoteColor] = useState<NoteColor>((note?.color as NoteColor) ?? NOTE_COLORS[0]);
  const [category, setCategory] = useState<NoteCategory>(note?.category ?? 'General');
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
    setNoteColor(note.color as NoteColor);
    setCategory(note.category);
    setTags(note.tags);
  }, [note?.id]);

  const markDirty = () => setDirty(true);

  if (!note) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centeredMsg}>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>
            Note not found
          </Text>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
    let valid = true;
    if (!title.trim()) { setTitleError(true); valid = false; }
    if (!content.trim()) { setContentError(true); valid = false; }
    if (!valid) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setSaving(true);
    try {
      await updateNote(id!, {
        title: title.trim(),
        content: content.trim(),
        color: noteColor,
        category,
        tags,
      });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditing(false);
      setDirty(false);
    } catch {
      Alert.alert('Error', 'Could not save note.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? You can restore it from Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteNote(id!);
            router.back();
          },
        },
      ],
    );
  };

  const handlePin = async () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    await togglePin(id!);
  };

  const handleArchive = async () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    await toggleArchive(id!);
    router.back();
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setTagInput('');
      markDirty();
    }
  };

  const handleTagKey = (e: any) => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ',') {
      handleAddTag();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          testID="detail-back"
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            testID="detail-pin"
            onPress={handlePin}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Feather
              name="bookmark"
              size={20}
              color={note.isPinned ? noteColor : colors.mutedForeground}
            />
          </Pressable>
          <Pressable
            testID="detail-archive"
            onPress={handleArchive}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Feather
              name="archive"
              size={20}
              color={note.isArchived ? colors.text : colors.mutedForeground}
            />
          </Pressable>
          {editing && dirty ? (
            <Pressable
              testID="detail-save"
              onPress={handleSave}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: noteColor, opacity: saving ? 0.6 : 1 }]}
            >
              <Text style={styles.saveBtnText}>{saving ? '…' : 'Save'}</Text>
            </Pressable>
          ) : (
            <Pressable
              testID="detail-edit"
              onPress={() => setEditing(true)}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Feather name="edit-2" size={20} color={colors.text} />
            </Pressable>
          )}
          <Pressable
            testID="detail-delete"
            onPress={handleDelete}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Feather name="trash-2" size={20} color="#ff3355" />
          </Pressable>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 + (Platform.OS === 'web' ? 34 : 0) },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.colorAccentBar, { backgroundColor: noteColor }]} />

        {editing ? (
          <>
            <TextInput
              testID="detail-title-input"
              style={[
                styles.titleInput,
                {
                  color: colors.text,
                  borderBottomColor: titleError ? '#ff3355' : colors.border,
                },
              ]}
              value={title}
              onChangeText={(t) => { setTitle(t); markDirty(); if (t.trim()) setTitleError(false); }}
              placeholder="Note title…"
              placeholderTextColor={colors.mutedForeground}
            />
            {titleError && <Text style={styles.errorText}>Title is required</Text>}
            <TextInput
              testID="detail-content-input"
              style={[
                styles.contentInput,
                { color: colors.text, borderColor: contentError ? '#ff3355' : 'transparent' },
              ]}
              value={content}
              onChangeText={(t) => { setContent(t); markDirty(); if (t.trim()) setContentError(false); }}
              placeholder="Start writing…"
              placeholderTextColor={colors.mutedForeground}
              multiline
              textAlignVertical="top"
            />
            {contentError && <Text style={styles.errorText}>Content is required</Text>}
          </>
        ) : (
          <>
            <Text style={[styles.titleDisplay, { color: colors.text }]}>
              {title || 'Untitled'}
            </Text>
            <Text style={[styles.contentDisplay, { color: colors.text }]}>
              {content}
            </Text>
          </>
        )}

        <View style={[styles.metaSection, { borderTopColor: colors.border }]}>
          <View style={styles.metaRow}>
            <Feather name="clock" size={13} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              Created {formatDate(note.createdAt)}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Feather name="edit" size={13} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              Updated {formatDate(note.updatedAt)}
            </Text>
          </View>
        </View>

        {editing && (
          <>
            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>COLOR</Text>
              <ColorPicker
                selectedColor={noteColor}
                onSelectColor={(c) => { setNoteColor(c); markDirty(); }}
              />
            </View>
            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CATEGORY</Text>
              <CategoryPicker
                selected={category}
                onSelect={(c) => { setCategory(c); markDirty(); }}
                accentColor={noteColor}
              />
            </View>
            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TAGS</Text>
              {tags.length > 0 && (
                <TagChips
                  tags={tags}
                  onChangeTags={(t) => { setTags(t); markDirty(); }}
                  accentColor={noteColor}
                />
              )}
              <View style={[styles.tagInputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <TextInput
                  testID="detail-tag-input"
                  style={[styles.tagInput, { color: colors.text }]}
                  value={tagInput}
                  onChangeText={setTagInput}
                  placeholder="Add tag…"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                  onKeyPress={handleTagKey}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
                {tagInput.trim().length > 0 && (
                  <Pressable onPress={handleAddTag} hitSlop={8}>
                    <Feather name="plus" size={18} color={noteColor} />
                  </Pressable>
                )}
              </View>
            </View>
          </>
        )}

        {!editing && (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.categoryBadge, { borderColor: noteColor + '55', backgroundColor: noteColor + '15' }]}>
                <Text style={[styles.categoryBadgeText, { color: noteColor }]}>
                  {note.category}
                </Text>
              </View>
              {tags.map((t) => (
                <View
                  key={t}
                  style={[styles.tagBadge, { borderColor: colors.border, backgroundColor: colors.muted }]}
                >
                  <Text style={[styles.tagBadgeText, { color: colors.mutedForeground }]}>#{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 4,
  },
  iconBtn: { padding: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 2 },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, marginHorizontal: 4 },
  saveBtnText: { color: '#0a0a0f', fontFamily: 'Inter_700Bold', fontSize: 13 },
  scrollContent: { paddingHorizontal: 16 },
  colorAccentBar: { height: 2, borderRadius: 1, marginTop: 4, marginBottom: 16 },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 4,
  },
  errorText: { fontSize: 12, color: '#ff3355', fontFamily: 'Inter_400Regular', marginBottom: 8 },
  contentInput: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    minHeight: 180,
    paddingTop: 14,
    borderWidth: 0,
    textAlignVertical: 'top',
  },
  titleDisplay: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
    lineHeight: 30,
  },
  contentDisplay: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    marginBottom: 8,
  },
  metaSection: { borderTopWidth: 1, paddingTop: 12, gap: 6, marginTop: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  section: { borderTopWidth: 1, paddingTop: 16, marginTop: 4, gap: 10 },
  sectionLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 1.2 },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tagInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', padding: 0 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  categoryBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3, textTransform: 'uppercase' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  tagBadgeText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  centeredMsg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
