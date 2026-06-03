import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Note } from '@/types/note';

const NOTES_KEY = '@neuronsparks/notes_v1';
const LAST_DELETED_KEY = '@neuronsparks/last_deleted_v1';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  lastDeleted: Note | null;
  addNote: (
    data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Note>;
  updateNote: (
    id: string,
    data: Partial<Omit<Note, 'id' | 'createdAt'>>,
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  restoreLastDeleted: () => Promise<boolean>;
  clearAll: () => Promise<void>;
  exportNotes: () => string;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDeleted, setLastDeleted] = useState<Note | null>(null);

  const notesRef = useRef<Note[]>(notes);
  notesRef.current = notes;

  useEffect(() => {
    (async () => {
      try {
        const [notesRaw, deletedRaw] = await Promise.all([
          AsyncStorage.getItem(NOTES_KEY),
          AsyncStorage.getItem(LAST_DELETED_KEY),
        ]);
        if (notesRaw) setNotes(JSON.parse(notesRaw));
        if (deletedRaw) setLastDeleted(JSON.parse(deletedRaw));
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (updated: Note[]) => {
    setNotes(updated);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  }, []);

  const addNote = useCallback(
    async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
      const now = new Date().toISOString();
      const note: Note = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        createdAt: now,
        updatedAt: now,
      };
      await persist([...notesRef.current, note]);
      return note;
    },
    [persist],
  );

  const updateNote = useCallback(
    async (id: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
      const updated = notesRef.current.map((n) =>
        n.id === id
          ? { ...n, ...data, updatedAt: new Date().toISOString() }
          : n,
      );
      await persist(updated);
    },
    [persist],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      const note = notesRef.current.find((n) => n.id === id);
      if (note) {
        setLastDeleted(note);
        await AsyncStorage.setItem(LAST_DELETED_KEY, JSON.stringify(note));
      }
      await persist(notesRef.current.filter((n) => n.id !== id));
    },
    [persist],
  );

  const togglePin = useCallback(
    async (id: string) => {
      const note = notesRef.current.find((n) => n.id === id);
      if (note) await updateNote(id, { isPinned: !note.isPinned });
    },
    [updateNote],
  );

  const toggleArchive = useCallback(
    async (id: string) => {
      const note = notesRef.current.find((n) => n.id === id);
      if (note) await updateNote(id, { isArchived: !note.isArchived });
    },
    [updateNote],
  );

  const restoreLastDeleted = useCallback(async (): Promise<boolean> => {
    let note = lastDeleted;
    if (!note) {
      const raw = await AsyncStorage.getItem(LAST_DELETED_KEY);
      if (raw) note = JSON.parse(raw);
    }
    if (!note) return false;
    await persist([...notesRef.current, note]);
    setLastDeleted(null);
    await AsyncStorage.removeItem(LAST_DELETED_KEY);
    return true;
  }, [lastDeleted, persist]);

  const clearAll = useCallback(async () => {
    await AsyncStorage.removeItem(NOTES_KEY);
    setNotes([]);
  }, []);

  const exportNotes = useCallback(() => {
    return JSON.stringify(notesRef.current, null, 2);
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        lastDeleted,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        toggleArchive,
        restoreLastDeleted,
        clearAll,
        exportNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
