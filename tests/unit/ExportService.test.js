jest.mock('@services/StorageService', () => ({
    StorageService: {
        getAllNotes: jest.fn(),
        getSettings: jest.fn(),
        importBackup: jest.fn(),
    },
}));

import { ExportService } from '@services/ExportService';
import { StorageService } from '@services/StorageService';

describe('ExportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('exports notes to JSON format', async() => {
        const notes = [
            { id: '1', title: 'First', content: 'Hello', tags: ['one'], color: '#00D4FF', isPinned: false, isArchived: false, createdAt: '2026-05-27T00:00:00Z', updatedAt: '2026-05-27T00:00:00Z' },
        ];

        const json = await ExportService.exportToJSON(notes);
        const parsed = JSON.parse(json);

        expect(parsed.totalNotes).toBe(1);
        expect(parsed.notes[0].title).toBe('First');
        expect(parsed.version).toBe('1.0.0');
    });

    it('exports notes to CSV format', async() => {
        const notes = [
            { id: '1', title: 'First', content: 'Hello\nWorld', tags: ['one'], color: '#00D4FF', isPinned: true, isArchived: false, createdAt: '2026-05-27T00:00:00Z', updatedAt: '2026-05-27T00:00:00Z' },
        ];

        const csv = await ExportService.exportToCSV(notes);

        expect(csv).toContain('ID,Title,Content,Tags,Color,Pinned,Archived,Created,Updated');
        expect(csv).toContain('First');
        expect(csv).toContain('Yes');
    });

    it('exports notes to Markdown format', async() => {
        const notes = [
            { id: '1', title: 'First', content: 'Hello world', tags: ['one', 'two'], color: '#00D4FF', isPinned: false, isArchived: false, createdAt: '2026-05-27T00:00:00Z', updatedAt: '2026-05-27T00:00:00Z' },
        ];

        const markdown = await ExportService.exportToMarkdown(notes);

        expect(markdown).toContain('Neuron Sparks Export');
        expect(markdown).toContain('First');
        expect(markdown).toContain('**Tags:**');
    });

    it('creates a full backup from storage', async() => {
        StorageService.getAllNotes.mockResolvedValue([{ id: '1', title: 'First', content: 'Hello', tags: [], color: '#00D4FF', isPinned: false, isArchived: false, createdAt: '2026-05-27T00:00:00Z', updatedAt: '2026-05-27T00:00:00Z' }]);
        StorageService.getSettings.mockResolvedValue({ theme: 'dark' });

        const backupJson = await ExportService.createFullBackup();
        const backup = JSON.parse(backupJson);

        expect(backup.notes).toHaveLength(1);
        expect(backup.settings.theme).toBe('dark');
        expect(backup.backupDate).toBeDefined();
    });
});