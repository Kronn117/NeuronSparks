/**
 * Export Service
 * Handles export operations to different formats
 */

import { logger } from '@utils/logger';
import { formatDate } from '@utils/helpers';
import { StorageService } from './StorageService';

/**
 * ExportService - Export operations
 */
export const ExportService = {
        /**
         * Export notes to JSON format
         * @param {Array} notes - Notes to export
         * @returns {object} Exported data
         */
        exportToJSON: async notes => {
            try {
                logger.log(`📤 Exporting ${notes.length} notes to JSON`);

                const exportData = {
                    version: '1.0.0',
                    exportedAt: new Date().toISOString(),
                    totalNotes: notes.length,
                    notes,
                };

                return JSON.stringify(exportData, null, 2);
            } catch (error) {
                logger.error('❌ JSON export error:', error);
                throw error;
            }
        },

        /**
         * Export notes to CSV format
         * @param {Array} notes - Notes to export
         * @returns {string} CSV string
         */
        exportToCSV: async notes => {
            try {
                logger.log(`📤 Exporting ${notes.length} notes to CSV`);

                // CSV headers
                const headers = ['ID', 'Title', 'Content', 'Tags', 'Color', 'Pinned', 'Archived', 'Created', 'Updated'];
                const rows = [headers];

                // Add note rows
                notes.forEach(note => {
                    rows.push([
                        note.id,
                        `"${(note.title || '').replace(/"/g, '""')}"`, // Escape quotes
                        `"${(note.content || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                        `"${(note.tags || []).join(', ')}"`,
                        note.color,
                        note.isPinned ? 'Yes' : 'No',
                        note.isArchived ? 'Yes' : 'No',
                        formatDate(note.createdAt, 'withTime'),
                        formatDate(note.updatedAt, 'withTime'),
                    ]);
                });

                return rows.map(row => row.join(',')).join('\n');
            } catch (error) {
                logger.error('❌ CSV export error:', error);
                throw error;
            }
        },

        /**
         * Export notes to Markdown format
         * @param {Array} notes - Notes to export
         * @returns {string} Markdown string
         */
        exportToMarkdown: async notes => {
                try {
                    logger.log(`📤 Exporting ${notes.length} notes to Markdown`);

                    let markdown = '# Neuro Sparks Export\n\n';
                    markdown += `**Exported:** ${formatDate(new Date(), 'withTime')}\n`;
                    markdown += `**Total Notes:** ${notes.length}\n\n`;
                    markdown += '---\n\n';

                    notes.forEach((note, index) => {
                                markdown += `## ${index + 1}. ${note.title}\n\n`;
                                markdown += `**Created:** ${formatDate(note.createdAt, 'withTime')}\n`;
                                markdown += `**Updated:** ${formatDate(note.updatedAt, 'withTime')}\n`;

                                if (note.tags && note.tags.length > 0) {
                                    markdown += `**Tags:** ${note.tags.map(tag => `\`${tag}\``).join(', ')}\n`;
        }

        markdown += '\n';
        markdown += note.content || '*No content*';
        markdown += '\n\n---\n\n';
      });

      return markdown;
    } catch (error) {
      logger.error('❌ Markdown export error:', error);
      throw error;
    }
  },

  /**
   * Export notes to PDF format
   * Note: Placeholder for future implementation with a PDF library
   * @param {Array} notes - Notes to export
   * @returns {Promise} PDF export result
   */
  exportToPDF: async notes => {
    try {
      logger.log(`📤 Exporting ${notes.length} notes to PDF (not yet implemented)`);
      // TODO: Implement with react-native-pdf or similar
      throw new Error('PDF export not yet implemented');
    } catch (error) {
      logger.error('❌ PDF export error:', error);
      throw error;
    }
  },

  /**
   * Export all notes and settings as backup
   * @returns {Promise<string>} Backup JSON string
   */
  createFullBackup: async () => {
    try {
      logger.log('📦 Creating full backup');

      const notes = await StorageService.getAllNotes();
      const settings = await StorageService.getSettings();

      const backup = {
        version: '1.0.0',
        backupDate: new Date().toISOString(),
        dataVersion: '1.0.0',
        notes,
        settings,
      };

      return JSON.stringify(backup, null, 2);
    } catch (error) {
      logger.error('❌ Full backup error:', error);
      throw error;
    }
  },

  /**
   * Get export filename with timestamp
   * @param {string} format - Export format ('json', 'csv', 'md')
   * @returns {string} Filename
   */
  getExportFilename: format => {
    const timestamp = new Date().toISOString().split('T')[0];
    const formatExt = {
      json: 'json',
      csv: 'csv',
      markdown: 'md',
      md: 'md',
    };

    return `neuro-sparks-${timestamp}.${formatExt[format] || 'txt'}`;
  },
};