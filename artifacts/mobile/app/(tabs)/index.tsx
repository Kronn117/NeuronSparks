import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoteCard } from '@/components/NoteCard';
import { SearchBar } from '@/components/SearchBar';
import { useNotes } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';
import { Note } from '@/types/note';

type FilterTab = 'all' | 'pinned' | 'archived';

const ACCENT = '#00f5ff';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, loading } = useNotes();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [searchVisible, setSearchVisible] = useState(false);

  const filtered = useMemo(() => {
    let result = notes.slice();

    if (filter === 'pinned') {
      result = result.filter((n) => n.isPinned && !n.isArchived);
    } else if (filter === 'archived') {
      result = result.filter((n) => n.isArchived);
    } else {
      result = result.filter((n) => !n.isArchived);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.category.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [notes, query, filter]);

  const topPad =
    Platform.OS === 'web' ? 67 : insets.top;

  const handleFab = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/create');
  };

  const handleSettings = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    router.push('/settings');
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="zap" size={40} color={ACCENT + '55'} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {query ? 'No results found' : filter === 'pinned' ? 'No pinned notes' : filter === 'archived' ? 'No archived notes' : 'No notes yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
        {query ? 'Try a different search' : filter === 'all' ? 'Tap + to create your first note' : ''}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Note }) => (
    <NoteCard note={item} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={[styles.logoDot, { backgroundColor: ACCENT }]} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>NeuronSparks</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              testID="toggle-search"
              onPress={() => {
                setSearchVisible((v) => !v);
                if (searchVisible) setQuery('');
              }}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Feather
                name={searchVisible ? 'x' : 'search'}
                size={20}
                color={searchVisible ? ACCENT : colors.text}
              />
            </Pressable>
            <Pressable
              testID="settings-btn"
              onPress={handleSettings}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Feather name="settings" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {searchVisible && (
          <View style={styles.searchWrapper}>
            <SearchBar value={query} onChangeText={setQuery} />
          </View>
        )}

        <View style={styles.filterRow}>
          {(['all', 'pinned', 'archived'] as FilterTab[]).map((tab) => (
            <Pressable
              key={tab}
              testID={`filter-${tab}`}
              onPress={() => setFilter(tab)}
              style={[
                styles.filterTab,
                {
                  borderBottomColor: filter === tab ? ACCENT : 'transparent',
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === tab ? ACCENT : colors.mutedForeground },
                ]}
              >
                {tab === 'all' ? `All (${notes.filter((n) => !n.isArchived).length})` :
                 tab === 'pinned' ? `Pinned (${notes.filter((n) => n.isPinned && !n.isArchived).length})` :
                 `Archived (${notes.filter((n) => n.isArchived).length})`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={ACCENT} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 80 + (Platform.OS === 'web' ? 34 : 0) },
          ]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          scrollEnabled={filtered.length > 0}
        />
      )}

      <Pressable
        testID="fab-create"
        onPress={handleFab}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: ACCENT,
            bottom: insets.bottom + 20 + (Platform.OS === 'web' ? 34 : 0),
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Feather name="plus" size={26} color="#0a0a0f" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 8,
  },
  searchWrapper: {
    paddingBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 0,
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00f5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
