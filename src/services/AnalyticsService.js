/**
 * Analytics Service
 * Tracks user events and app usage
 */

import { logger } from '@utils/logger';
import { StorageService } from './StorageService';

const ANALYTICS_STORAGE_KEY = 'app_analytics';

/**
 * AnalyticsService - Event tracking and analytics
 */
export const AnalyticsService = {
    /**
     * Track a generic event
     * @param {string} eventName - Event name
     * @param {object} data - Event data
     */
    trackEvent: async(eventName, data = {}) => {
        try {
            logger.log(`📊 Tracking event: ${eventName}`, data);

            const event = {
                name: eventName,
                timestamp: new Date().toISOString(),
                data,
            };

            // Store event in analytics
            const analytics = (await StorageService.getSettings().then(s => s.analytics)) || [];
            analytics.push(event);

            // Keep only last 1000 events
            if (analytics.length > 1000) {
                analytics.shift();
            }

            return true;
        } catch (error) {
            logger.error('❌ Analytics tracking error:', error);
            return false;
        }
    },

    /**
     * Track note created
     * @param {string} noteId - Note ID
     * @param {number} wordCount - Word count
     */
    trackNoteCreated: async(noteId, wordCount = 0) => {
        await AnalyticsService.trackEvent('note_created', {
            noteId,
            wordCount,
        });
    },

    /**
     * Track note updated
     * @param {string} noteId - Note ID
     * @param {number} wordCount - Word count
     */
    trackNoteUpdated: async(noteId, wordCount = 0) => {
        await AnalyticsService.trackEvent('note_updated', {
            noteId,
            wordCount,
        });
    },

    /**
     * Track note deleted
     * @param {string} noteId - Note ID
     */
    trackNoteDeleted: async noteId => {
        await AnalyticsService.trackEvent('note_deleted', {
            noteId,
        });
    },

    /**
     * Track note pinned
     * @param {string} noteId - Note ID
     * @param {boolean} isPinned - Pinned status
     */
    trackNotePinned: async(noteId, isPinned) => {
        await AnalyticsService.trackEvent('note_pinned', {
            noteId,
            isPinned,
        });
    },

    /**
     * Track note archived
     * @param {string} noteId - Note ID
     * @param {boolean} isArchived - Archived status
     */
    trackNoteArchived: async(noteId, isArchived) => {
        await AnalyticsService.trackEvent('note_archived', {
            noteId,
            isArchived,
        });
    },

    /**
     * Track search performed
     * @param {string} query - Search query
     * @param {number} resultCount - Number of results
     */
    trackSearch: async(query, resultCount) => {
        await AnalyticsService.trackEvent('search_performed', {
            query,
            resultCount,
        });
    },

    /**
     * Track app session start
     */
    trackSessionStart: async() => {
        await AnalyticsService.trackEvent('session_start', {
            timestamp: new Date().toISOString(),
        });
    },

    /**
     * Track app session end
     * @param {number} duration - Session duration in seconds
     */
    trackSessionEnd: async duration => {
        await AnalyticsService.trackEvent('session_end', {
            duration,
        });
    },

    /**
     * Track export performed
     * @param {string} format - Export format
     * @param {number} noteCount - Number of notes exported
     */
    trackExport: async(format, noteCount) => {
        await AnalyticsService.trackEvent('export_performed', {
            format,
            noteCount,
        });
    },

    /**
     * Get analytics summary
     * @returns {Promise<object>} Analytics summary
     */
    getAnalyticsSummary: async() => {
        try {
            logger.log('📊 Getting analytics summary');

            const settings = await StorageService.getSettings();
            const analytics = settings.analytics || [];

            const summary = {
                totalEvents: analytics.length,
                eventTypes: {},
                lastEvent: null,
            };

            analytics.forEach(event => {
                summary.eventTypes[event.name] = (summary.eventTypes[event.name] || 0) + 1;
            });

            if (analytics.length > 0) {
                summary.lastEvent = analytics[analytics.length - 1];
            }

            return summary;
        } catch (error) {
            logger.error('❌ Analytics summary error:', error);
            return {};
        }
    },

    /**
     * Clear analytics data
     * @returns {Promise<boolean>} Success status
     */
    clearAnalytics: async() => {
        try {
            logger.warn('🗑️  Clearing analytics data');
            const settings = await StorageService.getSettings();
            settings.analytics = [];
            await StorageService.saveSettings(settings);
            return true;
        } catch (error) {
            logger.error('❌ Clear analytics error:', error);
            return false;
        }
    },
};