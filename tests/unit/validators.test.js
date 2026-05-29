import {
    validateNote,
    validateTitle,
    validateContent,
    validateTags,
} from '@utils/validators';

describe('Validators', () => {
    it('validates a complete note successfully', () => {
        const note = {
            title: 'Test Note',
            content: 'This is a sample note content.',
            tags: ['science', 'notes'],
        };

        const result = validateNote(note);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects a note without title', () => {
        const note = {
            title: '',
            content: 'No title here.',
        };

        const result = validateNote(note);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
    });

    it('rejects a note with too long title', () => {
        const note = {
            title: 'A'.repeat(201),
            content: 'Too long title test',
        };

        const result = validateNote(note);

        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toMatch(/less than 200 characters/);
    });

    it('validates title helper correctly', () => {
        const title = 'My Title';
        const result = validateTitle(title);

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
    });

    it('rejects invalid title helper values', () => {
        const result = validateTitle('');

        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Title is required');
    });

    it('validates optional content helper values', () => {
        const result = validateContent('Some content');

        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
    });

    it('validates tags helper correctly', () => {
        const result = validateTags(['tag1', 'tag2']);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects invalid tags array values', () => {
        const result = validateTags(['valid', '', 123]);

        expect(result.isValid).toBe(false);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                'Tag at index 1 cannot be empty',
                'Tag at index 2 must be a string',
            ])
        );
    });
});