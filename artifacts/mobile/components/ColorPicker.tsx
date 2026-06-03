import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useColors } from '@/hooks/useColors';
import { NOTE_CATEGORIES, NOTE_COLORS, NoteCategory, NoteColor } from '@/types/note';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onSelectColor: (color: NoteColor) => void;
}

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <View style={styles.row}>
      {NOTE_COLORS.map((color) => (
        <Pressable
          key={color}
          testID={`color-${color}`}
          onPress={() => onSelectColor(color)}
          style={[
            styles.swatch,
            { backgroundColor: color, opacity: selectedColor === color ? 1 : 0.45 },
          ]}
        >
          {selectedColor === color && (
            <Feather name="check" size={12} color="#000" />
          )}
        </Pressable>
      ))}
    </View>
  );
}

interface CategoryPickerProps {
  selected: NoteCategory;
  onSelect: (cat: NoteCategory) => void;
  accentColor: NoteColor;
}

export function CategoryPicker({ selected, onSelect, accentColor }: CategoryPickerProps) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryRow}
    >
      {NOTE_CATEGORIES.map((cat) => {
        const isSelected = cat === selected;
        return (
          <Pressable
            key={cat}
            testID={`cat-${cat}`}
            onPress={() => onSelect(cat)}
            style={[
              styles.categoryChip,
              {
                borderColor: isSelected ? accentColor : colors.border,
                backgroundColor: isSelected
                  ? accentColor + '22'
                  : colors.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: isSelected ? accentColor : colors.mutedForeground },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

interface TagEditorProps {
  tags: string[];
  onChangeTags: (tags: string[]) => void;
  accentColor: NoteColor;
}

export function TagChips({ tags, onChangeTags, accentColor }: TagEditorProps) {
  const colors = useColors();
  const removeTag = (t: string) => onChangeTags(tags.filter((x) => x !== t));
  return (
    <View style={styles.tagRow}>
      {tags.map((tag) => (
        <Pressable
          key={tag}
          testID={`tag-remove-${tag}`}
          onPress={() => removeTag(tag)}
          style={[
            styles.tagChip,
            { borderColor: accentColor + '55', backgroundColor: accentColor + '15' },
          ]}
        >
          <Text style={[styles.tagChipText, { color: accentColor }]}>#{tag}</Text>
          <Feather name="x" size={10} color={accentColor} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
