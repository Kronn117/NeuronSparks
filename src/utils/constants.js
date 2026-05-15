/**
 * Application-wide Constants
 * Screen names, default values, configuration constants
 */

// Screen Names - Must match navigation setup
export const SCREEN_NAMES = {
    HOME: 'Home',
    CREATE: 'Create',
    DETAIL: 'Detail',
    SEARCH: 'Search',
    SETTINGS: 'Settings',
    ARCHIVE: 'Archive',
};

// Default Tags for Notes
export const DEFAULT_TAGS = [
    { id: 'urgent', label: 'urgent', color: '#FF006E' },
    { id: 'work', label: 'work', color: '#1E90FF' },
    { id: 'personal', label: 'personal', color: '#00CC33' },
    { id: 'project', label: 'project', color: '#9933FF' },
    { id: 'meeting', label: 'meeting', color: '#FFE600' },
    { id: 'shopping', label: 'shopping', color: '#FF8C00' },
    { id: 'ideas', label: 'ideas', color: '#00D9FF' },
    { id: 'reading', label: 'reading', color: '#1E90FF' },
];

// Note Colors Available for Selection
export const NOTE_COLORS = [
    { name: 'Blue', value: '#1E90FF' },
    { name: 'Purple', value: '#9933FF' },
    { name: 'Pink', value: '#FF1493' },
    { name: 'Green', value: '#00CC33' },
    { name: 'Orange', value: '#FF8C00' },
    { name: 'Cyan', value: '#00D9FF' },
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