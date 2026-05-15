/**
 * Search Service
 * Handles search, filtering, and indexing
 */

import { logger } from '@utils/logger';
import { SEARCH_CONFIG } from '@utils/constants';

/**
 * Calculate relevance score for search results
 * Higher score = better match
 * @param {object} note - Note to score
 * @param {string} query - Search query
 * @returns {number} Relevance score (0-100)
 */
const calculateRelevanceScore = (note, query) => {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase();
    let score = 0;

    // Exact title match (40 points)
    if (note.title && note.title.toLowerCase() === lowerQuery) {
        score += 40;
    }

    // Title starts with query (30 points)
    if (note.title && note.title.toLowerCase().startsWith(lowerQuery)) {
        score += 30;
    }

    // Title contains query (20 points)
    if (note.title && note.title.toLowerCase().includes(lowerQuery)) {
        score += 20;
    }

    // Content contains query (10 points)
    if (note.content && note.content.toLowerCase().includes(lowerQuery)) {
        score += 10;
    }

    // Tag match (15 points)
    if (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        score += 15;
    }

    // Pinned notes get bonus (5 points)
    if (note.isPinned) {
        score += 5;
    }

    return score;
};

/**
 * SearchService - Search and filtering operations
 */
export const SearchService = {
    /**
     * Search notes by query
     * @param {Array} notes - Array of notes to search
     * @param {string} query - Search query
     * @param {object} filters - Additional filters
     * @returns {Array} Matching notes sorted by relevance
     */
    search: (notes, query, filters = {}) => {
        try {
            if (!query || query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
                return [];
            }

            logger.log(`🔍 Searching for: "${query}"`);

            // Filter notes
            let results = notes.filter(note => {
                // By default, search in title, content, and tags
                const searchableText = `${note.title} ${note.content} ${(note.tags || []).join(' ')}`.toLowerCase();
                return searchableText.includes(query.toLowerCase());
            });

            // Apply additional filters
            if (filters.tags && filters.tags.length > 0) {
                results = results.filter(note =>
                    filters.tags.some(tag => note.tags && note.tags.includes(tag))
                );
            }

            if (filters.color) {
                results = results.filter(note => note.color === filters.color);
            }

            if (filters.isPinned !== undefined) {
                results = results.filter(note => note.isPinned === filters.isPinned);
            }

            if (filters.isArchived !== undefined) {
                results = results.filter(note => note.isArchived === filters.isArchived);
            }

            // Score and sort results
            results = results
                .map(note => ({
                    ...note,
                    relevanceScore: calculateRelevanceScore(note, query),
                }))
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, SEARCH_CONFIG.MAX_RESULTS);

            logger.log(`✅ Found ${results.length} results`);
            return results;
        } catch (error) {
            logger.error('❌ Search error:', error);
            return [];
        }
    },

    /**
     * Filter notes by tags
     * @param {Array} notes - Array of notes
     * @param {string[]} tags - Tags to filter by
     * @param {string} mode - 'any' (OR) or 'all' (AND)
     * @returns {Array} Filtered notes
     */
    filterByTags: (notes, tags, mode = 'any') => {
        try {
            if (!tags || tags.length === 0) return notes;

            logger.log(`📋 Filtering by ${mode} tags: ${tags.join(', ')}`);

            return notes.filter(note => {
                if (!note.tags || note.tags.length === 0) return false;

                if (mode === 'all') {
                    return tags.every(tag => note.tags.includes(tag));
                }
                // 'any' mode
                return tags.some(tag => note.tags.includes(tag));
            });
        } catch (error) {
            logger.error('❌ Tag filter error:', error);
            return notes;
        }
    },

    /**
     * Filter notes by date range
     * @param {Array} notes - Array of notes
     * @param {Date|string} startDate - Start date
     * @param {Date|string} endDate - End date
     * @returns {Array} Filtered notes
     */
    filterByDateRange: (notes, startDate, endDate) => {
        try {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();

            logger.log(`📅 Filtering by date range`);

            return notes.filter(note => {
                const noteDate = new Date(note.createdAt).getTime();
                return noteDate >= start && noteDate <= end;
            });
        } catch (error) {
            logger.error('❌ Date filter error:', error);
            return notes;
        }
    },

    /**
     * Get autocomplete suggestions
     * @param {Array} notes - Array of notes
     * @param {string} query - Partial query
     * @returns {string[]} Suggestions
     */
    getAutocompleteSuggestions: (notes, query) => {
        try {
            if (!query || query.length === 0) return [];

            const lowerQuery = query.toLowerCase();
            const suggestions = new Set();

            // Suggest from titles
            notes.forEach(note => {
                if (note.title && note.title.toLowerCase().startsWith(lowerQuery)) {
                    suggestions.add(note.title);
                }
            });

            // Suggest from tags
            notes.forEach(note => {
                if (note.tags) {
                    note.tags.forEach(tag => {
                        if (tag.toLowerCase().startsWith(lowerQuery)) {
                            suggestions.add(tag);
                        }
                    });
                }
            });

            return Array.from(suggestions)
                .sort()
                .slice(0, 10);
        } catch (error) {
            logger.error('❌ Autocomplete error:', error);
            return [];
        }
    },

    /**
     * Get advanced search results with multiple criteria
     * @param {Array} notes - Array of notes
     * @param {object} criteria - Search criteria
     * @returns {Array} Matching notes
     */
    advancedSearch: (notes, criteria) => {
        try {
            logger.log('🔍 Advanced search with multiple criteria');

            let results = notes;

            // Title search
            if (criteria.title) {
                results = results.filter(note =>
                    note.title.toLowerCase().includes(criteria.title.toLowerCase())
                );
            }

            // Content search
            if (criteria.content) {
                results = results.filter(note =>
                    note.content.toLowerCase().includes(criteria.content.toLowerCase())
                );
            }

            // Tags filter
            if (criteria.tags && criteria.tags.length > 0) {
                results = SearchService.filterByTags(results, criteria.tags, criteria.tagsMode || 'any');
            }

            // Date range filter
            if (criteria.startDate && criteria.endDate) {
                results = SearchService.filterByDateRange(results, criteria.startDate, criteria.endDate);
            }

            // Color filter
            if (criteria.color) {
                results = results.filter(note => note.color === criteria.color);
            }

            // Pinned filter
            if (criteria.isPinned !== undefined) {
                results = results.filter(note => note.isPinned === criteria.isPinned);
            }

            // Word count filter
            if (criteria.minWords !== undefined) {
                results = results.filter(note => {
                    const wordCount = (note.content || '').split(/\s+/).filter(w => w.length > 0).length;
                    return wordCount >= criteria.minWords;
                });
            }

            return results;
        } catch (error) {
            logger.error('❌ Advanced search error:', error);
            return [];
        }
    },

    /**
     * Get search statistics
     * @param {Array} notes - Array of notes
     * @returns {object} Search statistics
     */
    getSearchStats: notes => {
        try {
            const stats = {
                totalNotes: notes.length,
                totalWords: 0,
                totalCharacters: 0,
                averageNoteLength: 0,
                uniqueTags: new Set(),
                colorDistribution: {},
            };

            notes.forEach(note => {
                const wordCount = (note.content || '').split(/\s+/).filter(w => w.length > 0).length;
                stats.totalWords += wordCount;
                stats.totalCharacters += (note.content || '').length;

                if (note.tags) {
                    note.tags.forEach(tag => stats.uniqueTags.add(tag));
                }

                stats.colorDistribution[note.color] = (stats.colorDistribution[note.color] || 0) + 1;
            });

            stats.uniqueTags = stats.uniqueTags.size;
            stats.averageNoteLength = Math.round(stats.totalWords / (notes.length || 1));

            return stats;
        } catch (error) {
            logger.error('❌ Stats error:', error);
            return {};
        }
    },
};