/**
 * Storage Service
 * Abstracts AsyncStorage operations and provides high-level data access
 * RULE: All storage operations must go through this service, never direct AsyncStorage calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@utils/logger';
import {
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    safeMultiGet,
    safeMultiSet,
    safeMultiRemove,
    safeGetAllKeys,
} from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';
import { StorageError } from '@utils/errors';

/**
 * StorageService - Centralized storage management
 * Provides abstraction over AsyncStorage for notes and settings
 */
export const StorageService = {
    /**
     * Get all notes from storage
     * @returns {Promise<Array>} Array of notes
     */
    getAllNotes: async() => {
        try {
            logger.log('📖 Fetching all notes from storage');
            const notes = await safeGetItem(STORAGE_KEYS.APP_NOTES);
            return Array.isArray(notes) ? notes : [];
        } catch (error) {
            logger.error('❌ Failed to get notes:', error);
            throw new StorageError('Failed to retrieve notes', { originalError: error });
        }
    },

    /**
     * Get a single note by ID
     * @param {string} noteId - The note ID
     * @returns {Promise<object|null>} Note object or null
     */
    getNoteById: async noteId => {
        try {
            const notes = await StorageService.getAllNotes();
            return notes.find(n => n.id === noteId) || null;
        } catch (error) {
            logger.error('❌ Failed to get note:', error);
            throw new StorageError(`Failed to retrieve note ${noteId}`, { originalError: error });
        }
    },

    /**
     * Save notes to storage
     * @param {Array} notes - Array of notes to save
     * @returns {Promise<boolean>} Success status
     */
    saveNotes: async notes => {
        try {
            if (!Array.isArray(notes)) {
                throw new StorageError('Notes must be an array');
            }

            logger.log(`💾 Saving ${notes.length} notes to storage`);
            const success = await safeSetItem(STORAGE_KEYS.APP_NOTES, notes);

            if (success) {
                logger.log('✅ Notes saved successfully');
            } else {
                throw new StorageError('Failed to save notes to AsyncStorage');
            }

            return success;
        } catch (error) {
            logger.error('❌ Failed to save notes:', error);
            throw new StorageError('Failed to save notes', { originalError: error });
        }
    },

    /**
     * Add a new note
     * @param {object} note - Note object
     * @returns {Promise<Array>} Updated notes array
     */
    addNote: async note => {
        try {
            logger.log(`➕ Adding new note: ${note.id}`);
            const notes = await StorageService.getAllNotes();
            notes.unshift(note); // Add to beginning for "most recent" sorting
            await StorageService.saveNotes(notes);
            logger.log('✅ Note added successfully');
            return notes;
        } catch (error) {
            logger.error('❌ Failed to add note:', error);
            throw new StorageError('Failed to add note', { originalError: error });
        }
    },

    /**
     * Update an existing note
     * @param {string} noteId - Note ID
     * @param {object} updates - Fields to update
     * @returns {Promise<Array>} Updated notes array
     */
    updateNote: async(noteId, updates) => {
        try {
            logger.log(`✏️  Updating note: ${noteId}`);
            const notes = await StorageService.getAllNotes();
            const noteIndex = notes.findIndex(n => n.id === noteId);

            if (noteIndex === -1) {
                throw new StorageError(`Note ${noteId} not found`);
            }

            notes[noteIndex] = {
                ...notes[noteIndex],
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            await StorageService.saveNotes(notes);
            logger.log('✅ Note updated successfully');
            return notes;
        } catch (error) {
            logger.error('❌ Failed to update note:', error);
            throw new StorageError('Failed to update note', { originalError: error });
        }
    },

    /**
     * Delete a note
     * @param {string} noteId - Note ID
     * @returns {Promise<Array>} Updated notes array
     */
    deleteNote: async noteId => {
        try {
            logger.log(`🗑️  Deleting note: ${noteId}`);
            const notes = await StorageService.getAllNotes();
            const filteredNotes = notes.filter(n => n.id !== noteId);

            if (filteredNotes.length === notes.length) {
                throw new StorageError(`Note ${noteId} not found`);
            }

            await StorageService.saveNotes(filteredNotes);
            logger.log('✅ Note deleted successfully');
            return filteredNotes;
        } catch (error) {
            logger.error('❌ Failed to delete note:', error);
            throw new StorageError('Failed to delete note', { originalError: error });
        }
    },

    /**
     * Delete multiple notes
     * @param {string[]} noteIds - Array of note IDs
     * @returns {Promise<Array>} Updated notes array
     */
    deleteMultiple: async noteIds => {
        try {
            logger.log(`🗑️  Deleting ${noteIds.length} notes`);
            const notes = await StorageService.getAllNotes();
            const filteredNotes = notes.filter(n => !noteIds.includes(n.id));

            await StorageService.saveNotes(filteredNotes);
            logger.log('✅ Notes deleted successfully');
            return filteredNotes;
        } catch (error) {
            logger.error('❌ Failed to delete notes:', error);
            throw new StorageError('Failed to delete notes', { originalError: error });
        }
    },

    /**
     * Get notes by tag
     * @param {string} tag - Tag name
     * @returns {Promise<Array>} Notes with this tag
     */
    getNotesByTag: async tag => {
        try {
            const notes = await StorageService.getAllNotes();
            return notes.filter(n => n.tags && n.tags.includes(tag));
        } catch (error) {
            logger.error('❌ Failed to get notes by tag:', error);
            throw new StorageError('Failed to get notes by tag', { originalError: error });
        }
    },

    /**
     * Get all tags from all notes
     * @returns {Promise<string[]>} Array of unique tags
     */
    getAllTags: async() => {
        try {
            const notes = await StorageService.getAllNotes();
            const tagSet = new Set();

            notes.forEach(note => {
                if (Array.isArray(note.tags)) {
                    note.tags.forEach(tag => tagSet.add(tag));
                }
            });

            return Array.from(tagSet).sort();
        } catch (error) {
            logger.error('❌ Failed to get tags:', error);
            return [];
        }
    },

    /**
     * Save user settings
     * @param {object} settings - Settings object
     * @returns {Promise<boolean>} Success status
     */
    saveSettings: async settings => {
        try {
            logger.log('⚙️  Saving settings');
            return await safeSetItem(STORAGE_KEYS.APP_SETTINGS, settings);
        } catch (error) {
            logger.error('❌ Failed to save settings:', error);
            throw new StorageError('Failed to save settings', { originalError: error });
        }
    },

    /**
     * Get user settings
     * @returns {Promise<object>} Settings object
     */
    getSettings: async() => {
        try {
            const settings = await safeGetItem(STORAGE_KEYS.APP_SETTINGS);
            return settings || {};
        } catch (error) {
            logger.error('❌ Failed to get settings:', error);
            return {};
        }
    },

    /**
     * Save search history
     * @param {string[]} queries - Search queries
     * @returns {Promise<boolean>} Success status
     */
    saveSearchHistory: async queries => {
        try {
            logger.log('🔍 Saving search history');
            return await safeSetItem(STORAGE_KEYS.APP_SEARCH_HISTORY, queries);
        } catch (error) {
            logger.error('❌ Failed to save search history:', error);
            return false;
        }
    },

    /**
     * Get search history
     * @returns {Promise<string[]>} Array of previous searches
     */
    getSearchHistory: async() => {
        try {
            const history = await safeGetItem(STORAGE_KEYS.APP_SEARCH_HISTORY);
            return Array.isArray(history) ? history : [];
        } catch (error) {
            logger.error('❌ Failed to get search history:', error);
            return [];
        }
    },

    /**
     * Create a backup of all notes
     * @param {string} backupId - Backup ID
     * @returns {Promise<boolean>} Success status
     */
    createBackup: async backupId => {
        try {
            logger.log(`📦 Creating backup: ${backupId}`);
            const notes = await StorageService.getAllNotes();
            const backupData = {
                notes,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
            };

            return await safeSetItem(STORAGE_KEYS.BACKUP_PREFIX + backupId, backupData);
        } catch (error) {
            logger.error('❌ Failed to create backup:', error);
            throw new StorageError('Failed to create backup', { originalError: error });
        }
    },

    /**
     * Restore from backup
     * @param {string} backupId - Backup ID
     * @returns {Promise<boolean>} Success status
     */
    restoreBackup: async backupId => {
        try {
            logger.log(`📥 Restoring backup: ${backupId}`);
            const backupData = await safeGetItem(STORAGE_KEYS.BACKUP_PREFIX + backupId);

            if (!backupData || !backupData.notes) {
                throw new StorageError('Invalid backup data');
            }

            return await StorageService.saveNotes(backupData.notes);
        } catch (error) {
            logger.error('❌ Failed to restore backup:', error);
            throw new StorageError('Failed to restore backup', { originalError: error });
        }
    },

    /**
     * Get all storage keys
     * @returns {Promise<string[]>} Array of all storage keys
     */
    getAllKeys: async() => {
        try {
            return await safeGetAllKeys();
        } catch (error) {
            logger.error('❌ Failed to get all keys:', error);
            return [];
        }
    },

    /**
     * Clear all storage
     * @returns {Promise<boolean>} Success status
     */
    clearAll: async() => {
        try {
            logger.warn('🔴 Clearing all storage');
            return await AsyncStorage.clear();
        } catch (error) {
            logger.error('❌ Failed to clear storage:', error);
            throw new StorageError('Failed to clear storage', { originalError: error });
        }
    },

    /**
     * Export notes to JSON
     * @returns {Promise<string>} JSON string of notes
     */
    exportToJSON: async() => {
        try {
            logger.log('📤 Exporting notes to JSON');
            const notes = await StorageService.getAllNotes();
            return JSON.stringify(notes, null, 2);
        } catch (error) {
            logger.error('❌ Failed to export notes:', error);
            throw new StorageError('Failed to export notes', { originalError: error });
        }
    },

    /**
     * Import notes from JSON
     * @param {string} jsonString - JSON string of notes
     * @returns {Promise<Array>} Imported notes array
     */
    importFromJSON: async jsonString => {
        try {
            logger.log('📥 Importing notes from JSON');
            const notes = JSON.parse(jsonString);

            if (!Array.isArray(notes)) {
                throw new StorageError('Invalid JSON format');
            }

            await StorageService.saveNotes(notes);
            return notes;
        } catch (error) {
            logger.error('❌ Failed to import notes:', error);
            throw new StorageError('Failed to import notes', { originalError: error });
        }
    },
};
