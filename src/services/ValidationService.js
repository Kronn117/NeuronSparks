/**
 * Validation Service
 * Centralized validation for notes and related data
 */

import { logger } from '@utils/logger';
import { validateNote, validateTitle, validateContent, validateTags } from '@utils/validators';
import { ValidationError } from '@utils/errors';

/**
 * ValidationService - High-level validation operations
 */
export const ValidationService = {
    /**
     * Validate a complete note object
     * @param {object} note - Note to validate
     * @returns {object} { isValid: boolean, errors: string[] }
     */
    validateNote: note => {
        try {
            logger.log('🔍 Validating note');
            return validateNote(note);
        } catch (error) {
            logger.error('❌ Validation error:', error);
            return {
                isValid: false,
                errors: ['Validation failed due to internal error'],
            };
        }
    },

    /**
     * Validate note title only
     * @param {string} title - Title to validate
     * @returns {object} { isValid: boolean, error: string | null }
     */
    validateTitle: title => {
        try {
            return validateTitle(title);
        } catch (error) {
            logger.error('❌ Title validation error:', error);
            return {
                isValid: false,
                error: 'Validation failed',
            };
        }
    },

    /**
     * Validate note content only
     * @param {string} content - Content to validate
     * @returns {object} { isValid: boolean, error: string | null }
     */
    validateContent: content => {
        try {
            return validateContent(content);
        } catch (error) {
            logger.error('❌ Content validation error:', error);
            return {
                isValid: false,
                error: 'Validation failed',
            };
        }
    },

    /**
     * Validate tags array
     * @param {string[]} tags - Tags to validate
     * @returns {object} { isValid: boolean, errors: string[] }
     */
    validateTags: tags => {
        try {
            return validateTags(tags);
        } catch (error) {
            logger.error('❌ Tags validation error:', error);
            return {
                isValid: false,
                errors: ['Validation failed'],
            };
        }
    },

    /**
     * Validate multiple notes for import
     * @param {Array} notes - Array of notes to validate
     * @returns {object} { isValid: boolean, errors: object }
     */
    validateBatch: notes => {
        try {
            logger.log(`🔍 Validating batch of ${notes.length} notes`);

            if (!Array.isArray(notes)) {
                return {
                    isValid: false,
                    errors: { overall: 'Not an array' },
                };
            }

            const errors = {};
            let invalidCount = 0;

            notes.forEach((note, index) => {
                const validation = ValidationService.validateNote(note);
                if (!validation.isValid) {
                    errors[index] = validation.errors;
                    invalidCount++;
                }
            });

            return {
                isValid: invalidCount === 0,
                errors,
                validCount: notes.length - invalidCount,
                invalidCount,
            };
        } catch (error) {
            logger.error('❌ Batch validation error:', error);
            return {
                isValid: false,
                errors: { overall: 'Validation failed' },
            };
        }
    },

    /**
     * Sanitize note data before saving
     * @param {object} note - Note to sanitize
     * @returns {object} Sanitized note
     */
    sanitizeNote: note => {
        try {
            return {
                ...note,
                title: (note.title || '').trim().slice(0, 200),
                content: (note.content || '').trim().slice(0, 50000),
                tags: Array.isArray(note.tags) ?
                    note.tags.map(tag => String(tag).trim().slice(0, 50)).filter(tag => tag.length > 0) :
                    [],
            };
        } catch (error) {
            logger.error('❌ Sanitization error:', error);
            return note;
        }
    },

    /**
     * Normalize note data for consistency
     * @param {object} note - Note to normalize
     * @returns {object} Normalized note
     */
    normalizeNote: note => {
        try {
            const now = new Date().toISOString();

            return {
                id: note.id || '',
                title: note.title || '',
                content: note.content || '',
                tags: Array.isArray(note.tags) ? note.tags : [],
                color: note.color || '#1E90FF',
                isPinned: Boolean(note.isPinned),
                isArchived: Boolean(note.isArchived),
                createdAt: note.createdAt || now,
                updatedAt: note.updatedAt || now,
                wordCount: note.wordCount || 0,
            };
        } catch (error) {
            logger.error('❌ Normalization error:', error);
            return note;
        }
    },
};