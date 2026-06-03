/**
 * ============================================================================
 * useSearch Hook
 * ============================================================================
 *
 * @file useSearch.js
 * @description Convenience wrapper around `useContext(SearchContext)` with a
 * guard that throws if called outside the provider tree.  Components use this
 * hook to read/write search query, results, filters, and recent-search history.
 *
 * @returns {object} The full SearchContext value
 * @throws {Error} If used outside SearchContextProvider
 * @see src/context/SearchContext.js
 */

import { useContext } from 'react';
import { SearchContext } from '@context/SearchContext';

/**
 * Access the SearchContext from any descendant component.
 *
 * @returns {object} SearchContext value — query, results, filters, and action dispatchers
 * @throws {Error} If called outside of SearchContextProvider
 */
export const useSearch = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error('useSearch must be used within SearchContextProvider');
    }

    return context;
};