/**
 * ============================================================================
 * Helper Functions
 * ============================================================================
 *
 * @file helpers.js
 * @description Miscellaneous utility functions: unique-ID generation,
 * date/time formatting ("time ago"), text truncation, word counting,
 * colour manipulation, and deep cloning.
 *
 * All functions are pure (no side-effects).
 */

/**
 * Generate a unique ID for notes
 * Format: note_<timestamp>_<random>
 */
export const generateId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `note_${timestamp}_${random}`;
};

/**
 * Generate a unique backup ID
 * Format: backup_<timestamp>
 */
export const generateBackupId = () => {
    const date = new Date();
    return `backup_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;
};

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - Format pattern ('short', 'long', 'withTime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    switch (format) {
        case 'short':
            return `${months[d.getMonth()]} ${day}, ${year}`;
        case 'long':
            return `${months[d.getMonth()]} ${day}, ${year}`;
        case 'withTime':
            {
                const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
                const h12 = (d.getHours() % 12 || 12).toString().padStart(2, '0');
                return `${months[d.getMonth()]} ${day}, ${year} ${h12}:${minutes} ${ampm}`;
            }
        case 'iso':
            return `${year}-${month}-${day}`;
        default:
            return `${months[d.getMonth()]} ${day}, ${year}`;
    }
};

/**
 * Get time ago string (e.g., "2 hours ago", "3 days ago")
 * @param {Date|string} date - The date to compare
 * @returns {string} Time ago string
 */
export const getTimeAgo = date => {
    if (!date) return '';

    const now = new Date();
    const then = new Date(date);
    const secondsAgo = Math.floor((now - then) / 1000);

    if (secondsAgo < 60) return 'just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

    return formatDate(date, 'short');
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Get word count from text
 * @param {string} text - The text to count
 * @returns {number} Word count
 */
export const getWordCount = text => {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Get character count from text
 * @param {string} text - The text to count
 * @returns {number} Character count
 */
export const getCharacterCount = text => {
    if (!text || typeof text !== 'string') return 0;
    return text.length;
};

/**
 * Get reading time estimate (words per minute: 200)
 * @param {string} text - The text
 * @returns {number} Reading time in minutes
 */
export const getReadingTime = text => {
    const wordCount = getWordCount(text);
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

/**
 * Check if text is mostly empty (whitespace only)
 * @param {string} text - The text to check
 * @returns {boolean} True if empty or whitespace only
 */
export const isEmptyText = text => {
    if (!text || typeof text !== 'string') return true;
    return text.trim().length === 0;
};

/**
 * Capitalize first letter of string
 * @param {string} text - The text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = text => {
    if (!text || typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Extract hashtags from text
 * @param {string} text - The text to search
 * @returns {string[]} Array of hashtags
 */
export const extractHashtags = text => {
    if (!text || typeof text !== 'string') return [];
    const regex = /#\w+/g;
    const hashtags = text.match(regex) || [];
    return hashtags.map(tag => tag.substring(1).toLowerCase());
};

/**
 * Get color brightness (for text color determination)
 * @param {string} hex - Hex color value
 * @returns {number} Brightness value (0-255)
 */
export const getColorBrightness = hex => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    return Math.sqrt(r * r * 0.241 + g * g * 0.691 + b * b * 0.068);
};

/**
 * Create a summary from text (first sentence or first N chars)
 * @param {string} text - The text to summarize
 * @param {number} length - Maximum length
 * @returns {string} Summary
 */
export const createSummary = (text, length = 100) => {
    if (!text || typeof text !== 'string') return '';

    // Get first sentence or truncate
    const firstPeriod = text.indexOf('.');
    if (firstPeriod > 0 && firstPeriod < length) {
        return text.substring(0, firstPeriod + 1);
    }

    return truncateText(text, length);
};

/**
 * Deep clone an object (for state management)
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = obj => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const cloned = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
};