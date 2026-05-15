/**
 * Custom Hooks - useNotes
 * Hook for accessing note context with error handling
 */

import { useContext } from 'react';
import { NoteContext } from '@context/NoteContext';

/**
 * Hook to use NoteContext
 * @throws Error if used outside NoteContextProvider
 * @returns {object} NoteContext value
 */
export const useNotes = () => {
    const context = useContext(NoteContext);

    if (!context) {
        throw new Error('useNotes must be used within NoteContextProvider');
    }

    return context;
};