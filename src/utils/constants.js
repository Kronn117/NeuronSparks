/**
 * ============================================================================
 * Application-wide Constants
 * ============================================================================
 *
 * @file constants.js
 * @description Central repository for magic-free constant values used across
 * the app: screen names, app version, default settings, storage keys,
 * validation rules, search config, default tags, note colours, and UI
 * configuration.
 *
 * @see RootNavigator.js   - SCREEN_NAMES
 * @see NoteContext.js      - DEFAULT_SORT
 * @see StorageService.js   - STORAGE_KEYS
 */

// Screen Names - Must match navigation setup
export const APP_VERSION = '1.0.2';

export const SCREEN_NAMES = {
    HOME: 'Home',
    CREATE: 'Create',
    DETAIL: 'Detail',
    SEARCH: 'Search',
    SETTINGS: 'Settings',
    ARCHIVE: 'Archive',
};

// Default Tags for Notes - Updated with modern color palette
export const DEFAULT_TAGS = [
    { id: 'urgent', label: 'urgent', color: '#EF4444' },
    { id: 'work', label: 'work', color: '#0EA5E9' },
    { id: 'personal', label: 'personal', color: '#10B981' },
    { id: 'project', label: 'project', color: '#8B5CF6' },
    { id: 'meeting', label: 'meeting', color: '#F59E0B' },
    { id: 'shopping', label: 'shopping', color: '#F97316' },
    { id: 'ideas', label: 'ideas', color: '#06B6D4' },
    { id: 'reading', label: 'reading', color: '#6366F1' },
];

// Note Colors Available for Selection - Updated with modern palette
export const NOTE_COLORS = [
    { name: 'Blue', value: '#0EA5E9' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Gold', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
];

// Default Note Color (first from array)
export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].value;

// Storage Keys - Must be consistent
export const STORAGE_KEYS = {
    APP_NOTES: 'app_notes',
    APP_SETTINGS: 'app_settings',
    APP_SEARCH_HISTORY: 'app_search_history',
    APP_THEME: 'app_theme',
    BACKUP_PREFIX: 'backup_',
};

// Pagination Settings
export const PAGINATION = {
    PAGE_SIZE: 20,
    INITIAL_NUM_TO_RENDER: 10,
    MAX_TO_RENDER_PER_BATCH: 10,
    UPDATE_CELLS_BATCHING_PERIOD: 50,
};

// Search Configuration
export const SEARCH_CONFIG = {
    DEBOUNCE_MS: 300,
    MIN_QUERY_LENGTH: 1,
    MAX_RESULTS: 100,
    RELEVANCE_THRESHOLD: 0.3,
};

// Sort Options for Notes
export const SORT_OPTIONS = [
    { id: 'recent', label: 'Most Recent', order: 'desc', field: 'updatedAt' },
    { id: 'oldest', label: 'Oldest', order: 'asc', field: 'updatedAt' },
    { id: 'title', label: 'Title (A-Z)', order: 'asc', field: 'title' },
    { id: 'pinned', label: 'Pinned First', order: 'desc', field: 'isPinned' },
];

// Default Sort Option
export const DEFAULT_SORT = 'recent';

// Date Format Options
export const DATE_FORMAT_OPTIONS = {
    SHORT: 'MMM d, YYYY',
    LONG: 'MMMM d, YYYY',
    WITH_TIME: 'MMM d, YYYY h:mm A',
    ISO: 'YYYY-MM-DD',
};

// Validation Rules
export const VALIDATION_RULES = {
    NOTE_TITLE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 200,
        REQUIRED: true,
    },
    NOTE_CONTENT: {
        MAX_LENGTH: 50000,
        REQUIRED: false,
    },
    TAGS: {
        MAX_COUNT: 20,
        MAX_LENGTH: 50,
    },
};

// Animation Timings
export const ANIMATION_TIMINGS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

// Empty State Messages
export const EMPTY_STATES = {
    NO_NOTES: {
        title: '🧠 No Notes Yet',
        description: 'Create your first note to get started!',
    },
    NO_SEARCH_RESULTS: {
        title: '🔍 No Results Found',
        description: 'Try searching with different keywords',
    },
    NO_ARCHIVED: {
        title: '📦 Archive Empty',
        description: 'Archived notes will appear here',
    },
};

// Error Messages
export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    STORAGE_ERROR: 'Failed to save note. Please check storage.',
    DELETE_ERROR: 'Failed to delete note. Please try again.',
    SYNC_ERROR: 'Failed to sync notes. Will retry later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    NOTE_CREATED: 'Note created successfully',
    NOTE_UPDATED: 'Note updated successfully',
    NOTE_DELETED: 'Note deleted successfully',
    NOTE_ARCHIVED: 'Note archived successfully',
    NOTE_RESTORED: 'Note restored successfully',
    NOTES_EXPORTED: 'Notes exported successfully',
};

// Limits and Constraints
export const LIMITS = {
    MAX_NOTES: 10000,
    MAX_TAGS_PER_NOTE: 20,
    MAX_SEARCH_HISTORY: 50,
    BACKUP_RETENTION_DAYS: 30,
    AUTO_BACKUP_INTERVAL_MS: 300000, // 5 minutes
};