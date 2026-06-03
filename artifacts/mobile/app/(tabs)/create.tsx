import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
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

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addNote } = useNotes();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteColor, setNoteColor] = useState<NoteColor>(NOTE_COLORS[0]);
  const [category, setCategory] = useState<NoteCategory>('General');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const contentRef = useRef<TextInput>(null);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleTagInputKey = (e: any) => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ',') {
      handleAddTag();
    }
  };

  const handleSave = async () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError(true);
      valid = false;
    }
    if (!content.trim()) {
      setContentError(true);
      valid = false;
    }
    if (!valid) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setSaving(true);
    try {
      await addNote({
        title: title.trim(),
        content: content.trim(),
        color: noteColor,
        category,
        tags,
        isPinned: false,
        isArchived: false,
      });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert('Error', 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          testID="create-back"
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <Feather name="x" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Note</Text>
        <Pressable
          testID="create-save"
          onPress={handleSave}
          disabled={saving}
          style={[
            styles.saveBtn,
            { backgroundColor: noteColor, opacity: saving ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 + (Platform.OS === 'web' ? 34 : 0) },
        ]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.colorAccentBar, { backgroundColor: noteColor }]} />

        <TextInput
          testID="note-title-input"
          style={[
            styles.titleInput,
            {
              color: colors.text,
              borderBottomColor: titleError ? '#ff3355' : colors.border,
            },
          ]}
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            if (t.trim()) setTitleError(false);
          }}
          placeholder="Note title…"
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="next"
          onSubmitEditing={() => contentRef.current?.focus()}
        />
        {titleError && (
          <Text style={styles.errorText}>Title is required</Text>
        )}

        <TextInput
          ref={contentRef}
          testID="note-content-input"
          style={[
            styles.contentInput,
            {
              color: colors.text,
              borderColor: contentError ? '#ff3355' : 'transparent',
            },
          ]}
          value={content}
          onChangeText={(t) => {
            setContent(t);
            if (t.trim()) setContentError(false);
          }}
          placeholder="Start writing…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          textAlignVertical="top"
        />
        {contentError && (
          <Text style={styles.errorText}>Content is required</Text>
        )}

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>COLOR</Text>
          <ColorPicker selectedColor={noteColor} onSelectColor={setNoteColor} />
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CATEGORY</Text>
          <CategoryPicker
            selected={category}
            onSelect={setCategory}
            accentColor={noteColor}
          />
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TAGS</Text>
          {tags.length > 0 && (
            <TagChips
              tags={tags}
              onChangeTags={setTags}
              accentColor={noteColor}
            />
          )}
          <View style={[styles.tagInputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <TextInput
              testID="tag-input"
              style={[styles.tagInput, { color: colors.text }]}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tag…"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              onKeyPress={handleTagInputKey}
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
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: '#0a0a0f',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  colorAccentBar: {
    height: 2,
    borderRadius: 1,
    marginTop: 4,
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff3355',
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    minHeight: 180,
    paddingTop: 14,
    borderWidth: 0,
    textAlignVertical: 'top',
  },
  section: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 4,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
});
