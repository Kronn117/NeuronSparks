/**
 * ============================================================================
 * Note Context & Provider
 * ============================================================================
 *
 * @file NoteContext.js
 * @description The single source of truth for all note data in the application.
 *              Uses useReducer for predictable state transitions and exposes CRUD
 *              operations (add, update, delete, pin, archive, restore) plus
 *              selector helpers (getPinnedNotes, getArchivedNotes, getStatistics).
 *
 * State Flow:
 *   1. On mount, loadNotes() reads from AsyncStorage via StorageService
 *   2. Every mutation validates via ValidationService, persists via StorageService,
 *      then dispatches a reducer action to update React state
 *   3. AnalyticsService tracks create/update/delete/pin/archive events
 *
 * RULE: All note state changes MUST go through this context - never call
 *       StorageService directly from screens or components.
 *
 * @module context/NoteContext
 * @see StorageService   for the persistence layer
 * @see ValidationService for sanitise/normalise logic
 * @see AnalyticsService for event tracking
 */

import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { ValidationService } from '@services/ValidationService';
import { AnalyticsService } from '@services/AnalyticsService';
import { generateId } from '@utils/helpers';
import { SORT_OPTIONS, DEFAULT_SORT } from '@utils/constants';

// Create context
export const NoteContext = createContext();

/**
 * Initial state for notes
 */
const initialState = {
    notes: [],
    loading: true,
    error: null,
    sortBy: DEFAULT_SORT,
    lastDeletedNote: null,
};

/**
 * Action types for reducer
 */
const ACTIONS = {
    // Loading
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',

    // Notes operations
    SET_NOTES: 'SET_NOTES',
    ADD_NOTE: 'ADD_NOTE',
    UPDATE_NOTE: 'UPDATE_NOTE',
    DELETE_NOTE: 'DELETE_NOTE',
    DELETE_MULTIPLE: 'DELETE_MULTIPLE',
    SET_LAST_DELETED: 'SET_LAST_DELETED',
    CLEAR_LAST_DELETED: 'CLEAR_LAST_DELETED',

    // Note properties
    TOGGLE_PIN: 'TOGGLE_PIN',
    TOGGLE_ARCHIVE: 'TOGGLE_ARCHIVE',

    // Sorting
    SET_SORT: 'SET_SORT',
};

/**
 * Sort notes based on sort criteria
 * @param {Array} notes - Notes to sort
 * @param {string} sortBy - Sort option ID
 * @returns {Array} Sorted notes
 */
const sortNotes = (notes, sortBy = DEFAULT_SORT) => {
    const sortOption = SORT_OPTIONS.find(opt => opt.id === sortBy);
    if (!sortOption) return notes;

    const sorted = [...notes];

    if (sortOption.id === 'pinned') {
        return sorted.sort((a, b) => {
            if (a.isPinned === b.isPinned) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            return b.isPinned - a.isPinned;
        });
    }

    if (sortOption.field === 'title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption.field === 'updatedAt') {
        sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    if (sortOption.order === 'asc') {
        sorted.reverse();
    }

    return sorted;
};

/**
 * Reducer function for note state management
 * @param {object} state - Current state
 * @param {object} action - Action object
 * @returns {object} New state
 */
const noteReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return {...state, loading: action.payload, error: null };

        case ACTIONS.SET_ERROR:
            return {...state, error: action.payload, loading: false };

        case ACTIONS.SET_NOTES:
            return {
                ...state,
                notes: sortNotes(action.payload, state.sortBy),
                loading: false,
                error: null,
            };

        case ACTIONS.ADD_NOTE:
            {
                const newNotes = [action.payload, ...state.notes];
                return {
                    ...state,
                    notes: sortNotes(newNotes, state.sortBy),
                };
            }

        case ACTIONS.UPDATE_NOTE:
            {
                const updatedNotes = state.notes.map(n => (n.id === action.payload.id ? action.payload : n));
                return {
                    ...state,
                    notes: sortNotes(updatedNotes, state.sortBy),
                };
            }

        case ACTIONS.DELETE_NOTE:
            return {
                ...state,
                notes: state.notes.filter(n => n.id !== action.payload),
            };

        case ACTIONS.SET_LAST_DELETED:
            return {...state, lastDeletedNote: action.payload };

        case ACTIONS.CLEAR_LAST_DELETED:
            return {...state, lastDeletedNote: null };

        case ACTIONS.DELETE_MULTIPLE:
            return {
                ...state,
                notes: state.notes.filter(n => !action.payload.includes(n.id)),
            };

        case ACTIONS.TOGGLE_PIN:
            {
                const pinned = state.notes.map(n =>
                    n.id === action.payload ? {...n, isPinned: !n.isPinned } : n
                );
                return {
                    ...state,
                    notes: sortNotes(pinned, state.sortBy),
                };
            }

        case ACTIONS.TOGGLE_ARCHIVE:
            return {
                ...state,
                notes: state.notes.map(n =>
                    n.id === action.payload ? {...n, isArchived: !n.isArchived } : n
                ),
            };

        case ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload,
                notes: sortNotes(state.notes, action.payload),
            };

        default:
            return state;
    }
};

/**
 * NoteContextProvider Component
 * Provides note state and operations to all child components
 */
export const NoteContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(noteReducer, initialState);

    /**
     * Load notes from storage on mount
     */
    useEffect(() => {
        const loadNotes = async() => {
            try {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });
                logger.log('📖 Loading notes from storage...');

                const notes = await StorageService.getAllNotes();
                logger.log(`✅ Loaded ${notes.length} notes`);

                dispatch({ type: ACTIONS.SET_NOTES, payload: notes });
            } catch (error) {
                logger.error('❌ Failed to load notes:', error);
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: 'Failed to load notes. Please try again.',
                });
            }
        };

        loadNotes();
    }, []);

    /**
     * Create a new note
     */
    const addNote = useCallback(async noteData => {
        try {
            logger.log('➕ Adding new note');

            // Validate
            const validation = ValidationService.validateNote(noteData);
            if (!validation.isValid) {
                throw new Error(validation.errors[0]);
            }

            // Sanitize and normalize
            const sanitized = ValidationService.sanitizeNote(noteData);
            const normalized = ValidationService.normalizeNote({
                id: generateId(),
                ...sanitized,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Save to storage
            await StorageService.addNote(normalized);

            // Update state
            dispatch({ type: ACTIONS.ADD_NOTE, payload: normalized });
            AnalyticsService.trackNoteCreated(normalized.id, normalized.wordCount);

            logger.log('✅ Note added successfully');
            return normalized;
        } catch (error) {
            logger.error('❌ Add note error:', error);
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to add note',
            });
            throw error;
        }
    }, []);

    /**
     * Update an existing note
     */
    const updateNote = useCallback(async(noteId, updates) => {
        try {
            logger.log(`✏️  Updating note: ${noteId}`);

            // Get current note
            const currentNote = state.notes.find(n => n.id === noteId);
            if (!currentNote) {
                throw new Error('Note not found');
            }

            // Merge and validate
            const updated = {...currentNote, ...updates };
            const validation = ValidationService.validateNote(updated);
            if (!validation.isValid) {
                throw new Error(validation.errors[0]);
            }

            // Sanitize and update
            const sanitized = ValidationService.sanitizeNote(updated);
            const normalized = ValidationService.normalizeNote({
                ...sanitized,
                updatedAt: new Date().toISOString(),
            });

            // Save to storage
            await StorageService.updateNote(noteId, normalized);

            // Update state
            dispatch({ type: ACTIONS.UPDATE_NOTE, payload: normalized });
            AnalyticsService.trackNoteUpdated(normalized.id, normalized.wordCount);

            logger.log('✅ Note updated successfully');
            return normalized;
        } catch (error) {
            logger.error('❌ Update note error:', error);
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to update note',
            });
            throw error;
        }
    }, [state.notes]);

    /**
     * Delete a note
     */
    const deleteNote = useCallback(async noteId => {
        try {
            logger.log(`🗑️  Deleting note: ${noteId}`);

            const deletedNote = state.notes.find(n => n.id === noteId);

            // Save to storage
            await StorageService.deleteNote(noteId);

            // Update state
            if (deletedNote) {
                dispatch({ type: ACTIONS.SET_LAST_DELETED, payload: deletedNote });
            }
            dispatch({ type: ACTIONS.DELETE_NOTE, payload: noteId });
            AnalyticsService.trackNoteDeleted(noteId);

            logger.log('✅ Note deleted successfully');
        } catch (error) {
            logger.error('❌ Delete note error:', error);
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to delete note',
            });
            throw error;
        }
    }, [state.notes]);

    const restoreLastDeleted = useCallback(async() => {
        if (!state.lastDeletedNote) return null;

        try {
            const restored = {
                ...state.lastDeletedNote,
                updatedAt: new Date().toISOString(),
            };

            await StorageService.addNote(restored);
            dispatch({ type: ACTIONS.ADD_NOTE, payload: restored });
            dispatch({ type: ACTIONS.CLEAR_LAST_DELETED });
            AnalyticsService.trackEvent('note_restored', { noteId: restored.id });
            return restored;
        } catch (error) {
            logger.error('Restore deleted note error:', error);
            dispatch({
                type: ACTIONS.SET_ERROR,
                payload: error.message || 'Failed to restore note',
            });
            throw error;
        }
    }, [state.lastDeletedNote]);

    const clearLastDeleted = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_LAST_DELETED });
    }, []);

    /**
     * Delete multiple notes
     */
    const deleteMultiple = useCallback(async noteIds => {
        try {
            logger.log(`🗑️  Deleting ${noteIds.length} notes`);

            // Save to storage
            await StorageService.deleteMultiple(noteIds);

            // Update state
            dispatch({ type: ACTIONS.DELETE_MULTIPLE, payload: noteIds });

            logger.log('✅ Notes deleted successfully');
        } catch (error) {
            logger.error('❌ Delete multiple error:', error);
            throw error;
        }
    }, []);

    /**
     * Toggle pin status
     */
    const togglePin = useCallback(async noteId => {
        try {
            logger.log(`📌 Toggling pin for: ${noteId}`);

            const note = state.notes.find(n => n.id === noteId);
            if (!note) throw new Error('Note not found');

            const updated = {...note, isPinned: !note.isPinned };
            await StorageService.updateNote(noteId, updated);

            dispatch({ type: ACTIONS.TOGGLE_PIN, payload: noteId });
            AnalyticsService.trackNotePinned(noteId, updated.isPinned);
        } catch (error) {
            logger.error('❌ Toggle pin error:', error);
            throw error;
        }
    }, [state.notes]);

    /**
     * Toggle archive status
     */
    const toggleArchive = useCallback(async noteId => {
        try {
            logger.log(`📦 Toggling archive for: ${noteId}`);

            const note = state.notes.find(n => n.id === noteId);
            if (!note) throw new Error('Note not found');

            const updated = {...note, isArchived: !note.isArchived };
            await StorageService.updateNote(noteId, updated);

            dispatch({ type: ACTIONS.TOGGLE_ARCHIVE, payload: noteId });
            AnalyticsService.trackNoteArchived(noteId, updated.isArchived);
        } catch (error) {
            logger.error('❌ Toggle archive error:', error);
            throw error;
        }
    }, [state.notes]);

    /**
     * Set sort option
     */
    const setSortBy = useCallback(sortOption => {
        logger.log(`📊 Setting sort: ${sortOption}`);
        dispatch({ type: ACTIONS.SET_SORT, payload: sortOption });
    }, []);

    /**
     * Get filtered notes
     */
    const getPinnedNotes = useCallback(() => {
        return state.notes.filter(n => n.isPinned && !n.isArchived);
    }, [state.notes]);

    const getArchivedNotes = useCallback(() => {
        return state.notes.filter(n => n.isArchived);
    }, [state.notes]);

    const getRegularNotes = useCallback(() => {
        return state.notes.filter(n => !n.isPinned && !n.isArchived);
    }, [state.notes]);

    /**
     * Get statistics
     */
    const getStatistics = useCallback(() => {
        return {
            total: state.notes.length,
            pinned: getPinnedNotes().length || 0,
            archived: getArchivedNotes().length,
            regular: getRegularNotes().length,
        };
    }, [state.notes]);

    // Context value
    const value = {
        // State
        notes: state.notes,
        loading: state.loading,
        error: state.error,
        sortBy: state.sortBy,
        lastDeletedNote: state.lastDeletedNote,

        // Operations
        addNote,
        updateNote,
        deleteNote,
        deleteMultiple,
        restoreLastDeleted,
        clearLastDeleted,
        togglePin,
        toggleArchive,
        setSortBy,

        // Selectors
        getPinnedNotes,
        getArchivedNotes,
        getRegularNotes,
        getStatistics,
    };

    return <NoteContext.Provider value = { value } > { children } < /NoteContext.Provider>;
};