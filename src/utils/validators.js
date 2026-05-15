/**
 * Input Validation Service
 * All validation functions return { isValid, errors }
 */

import { VALIDATION_RULES } from './constants';

/**
 * Validate a complete note object
 * @param {object} note - The note to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateNote = note => {
    const errors = [];

    if (!note) {
        return { isValid: false, errors: ['Note object is required'] };
    }

    // Validate title
    if (!note.title || typeof note.title !== 'string') {
        errors.push('Title is required');
    } else if (note.title.trim().length < VALIDATION_RULES.NOTE_TITLE.MIN_LENGTH) {
        errors.push('Title must not be empty');
    } else if (note.title.length > VALIDATION_RULES.NOTE_TITLE.MAX_LENGTH) {
        errors.push(`Title must be less than ${VALIDATION_RULES.NOTE_TITLE.MAX_LENGTH} characters`);
    }

    // Validate content (optional but if present, check length)
    if (note.content && typeof note.content !== 'string') {
        errors.push('Content must be text');
    } else if (note.content && note.content.length > VALIDATION_RULES.NOTE_CONTENT.MAX_LENGTH) {
        errors.push(
            `Content must be less than ${VALIDATION_RULES.NOTE_CONTENT.MAX_LENGTH} characters`
        );
    }

    // Validate tags if present
    if (note.tags) {
        if (!Array.isArray(note.tags)) {
            errors.push('Tags must be an array');
        } else if (note.tags.length > VALIDATION_RULES.TAGS.MAX_COUNT) {
            errors.push(`Maximum ${VALIDATION_RULES.TAGS.MAX_COUNT} tags allowed`);
        } else {
            note.tags.forEach((tag, index) => {
                if (typeof tag !== 'string') {
                    errors.push(`Tag at index ${index} must be a string`);
                } else if (tag.length > VALIDATION_RULES.TAGS.MAX_LENGTH) {
                    errors.push(`Tag "${tag}" is too long`);
                }
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate note title
 * @param {string} title - The title to validate
 * @returns {object} { isValid: boolean, error: string | null }
 */
export const validateTitle = title => {
    if (!title || typeof title !== 'string') {
        return { isValid: false, error: 'Title is required' };
    }

    if (title.trim().length < VALIDATION_RULES.NOTE_TITLE.MIN_LENGTH) {
        return { isValid: false, error: 'Title cannot be empty' };
    }

    if (title.length > VALIDATION_RULES.NOTE_TITLE.MAX_LENGTH) {
        return {
            isValid: false,
            error: `Title must be less than ${VALIDATION_RULES.NOTE_TITLE.MAX_LENGTH} characters`,
        };
    }

    return { isValid: true, error: null };
};

/**
 * Validate note content
 * @param {string} content - The content to validate
 * @returns {object} { isValid: boolean, error: string | null }
 */
export const validateContent = content => {
    if (!content) {
        // Content is optional
        return { isValid: true, error: null };
    }

    if (typeof content !== 'string') {
        return { isValid: false, error: 'Content must be text' };
    }

    if (content.length > VALIDATION_RULES.NOTE_CONTENT.MAX_LENGTH) {
        return {
            isValid: false,
            error: `Content must be less than ${VALIDATION_RULES.NOTE_CONTENT.MAX_LENGTH} characters`,
        };
    }

    return { isValid: true, error: null };
};

/**
 * Validate tags array
 * @param {string[]} tags - Array of tags
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateTags = tags => {
    const errors = [];

    if (!Array.isArray(tags)) {
        return { isValid: false, errors: ['Tags must be an array'] };
    }

    if (tags.length > VALIDATION_RULES.TAGS.MAX_COUNT) {
        errors.push(`Maximum ${VALIDATION_RULES.TAGS.MAX_COUNT} tags allowed`);
    }

    tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
            errors.push(`Tag at index ${index} must be a string`);
        } else if (tag.trim().length === 0) {
            errors.push(`Tag at index ${index} cannot be empty`);
        } else if (tag.length > VALIDATION_RULES.TAGS.MAX_LENGTH) {
            errors.push(`Tag "${tag}" exceeds maximum length`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = email => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate color hex value
 * @param {string} color - Hex color to validate
 * @returns {boolean} True if valid hex color
 */
export const validateColor = color => {
    if (!color || typeof color !== 'string') return false;
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorRegex.test(color);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const validateURL = url => {
    if (!url || typeof url !== 'string') return false;
    try {
        const parsed = new URL(url);
        return Boolean(parsed);
    } catch {
        return false;
    }
};

/**
 * Sanitize user input to prevent issues
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = input => {
    if (!input || typeof input !== 'string') return '';

    // Remove special characters that could cause issues
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .slice(0, 10000); // Limit length for safety
};