/**
 * ============================================================================
 * useNotes Hook
 * ============================================================================
 *
 * @file useNotes.js
 * @description Thin convenience wrapper around `useContext(NoteContext)` with
 * a built-in guard that throws if the hook is called outside the provider tree.
 * This is the preferred way for any component to interact with notes state.
 *
 * @returns {object} The full NoteContext value (state + dispatchers)
 * @throws {Error} If used outside NoteContextProvider
 * @see src/context/NoteContext.js
 */

import { useContext } from 'react';
import { NoteContext } from '@context/NoteContext';

/**
 * Access the NoteContext from any descendant component.
 *
 * @returns {object} NoteContext value — notes array, CRUD helpers, sort state, etc.
 * @throws {Error} If called outside of NoteContextProvider
 */
export const useNotes = () => {
    const context = useContext(NoteContext);

    if (!context) {
        throw new Error('useNotes must be used within NoteContextProvider');
    }

    return context;
};