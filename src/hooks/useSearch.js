/**
 * Custom Hooks - useSearch
 * Hook for search functionality
 */

import { useContext } from 'react';
import { SearchContext } from '@context/SearchContext';

/**
 * Hook to use SearchContext
 * @throws Error if used outside SearchContextProvider
 * @returns {object} SearchContext value
 */
export const useSearch = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error('useSearch must be used within SearchContextProvider');
    }

    return context;
};