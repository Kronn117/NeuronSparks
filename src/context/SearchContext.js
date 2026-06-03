/**
 * ============================================================================
 * Search Context
 * ============================================================================
 *
 * @file SearchContext.js
 * @description Centralised state management for everything search-related:
 * the current query string, result set, recent-search history, loading flag,
 * and filter options (tags, colour, pin status, archive status).
 *
 * Recent searches are persisted to AsyncStorage via StorageService so they
 * survive app restarts.  The maximum number of stored entries is governed by
 * `SEARCH_CONFIG.MAX_RESULTS` in `src/utils/constants.js`.
 *
 * State shape:
 *   {
 *     query: string,
 *     results: Note[],
 *     recentSearches: string[],
 *     loading: boolean,
 *     filters: { tags: string[], color: string|null, isPinned: boolean|undefined, isArchived: boolean }
 *   }
 *
 * @see src/services/SearchService.js  - Actual search algorithm
 * @see src/services/StorageService.js - Persistence for recent searches
 * @see src/utils/constants.js         - SEARCH_CONFIG
 */

import React, { createContext, useReducer, useCallback } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { SEARCH_CONFIG } from '@utils/constants';

/** The raw React context — prefer the `useSearchContext` hook (see useSearch.js). */
export const SearchContext = createContext();

/**
 * Initial reducer state — empty query, no results, no filters.
 */
const initialState = {
    query: '',
    results: [],
    recentSearches: [],
    loading: false,
    filters: {
        tags: [],
        color: null,
        isPinned: undefined,
        isArchived: false,
    },
};

/**
 * Action type constants consumed by the search reducer.
 */
const ACTIONS = {
    SET_QUERY: 'SET_QUERY',
    SET_RESULTS: 'SET_RESULTS',
    SET_LOADING: 'SET_LOADING',
    SET_RECENT_SEARCHES: 'SET_RECENT_SEARCHES',
    ADD_TO_RECENT: 'ADD_TO_RECENT',
    CLEAR_RECENT: 'CLEAR_RECENT',
    SET_FILTERS: 'SET_FILTERS',
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    CLEAR_SEARCH: 'CLEAR_SEARCH',
};

/**
 * Search reducer — immutable state transitions for search UI.
 *
 * Notable behaviour:
 * - `ADD_TO_RECENT` prepends the new query and trims the list to
 *   `SEARCH_CONFIG.MAX_RESULTS` entries.
 * - `CLEAR_FILTERS` resets every filter field to its default value.
 * - `CLEAR_SEARCH` wipes query + results but leaves recent searches intact.
 *
 * @param {object} state  - Current search state
 * @param {object} action - Dispatch action with `type` and `payload`
 * @returns {object} Next state
 */
const searchReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_QUERY:
            return {...state, query: action.payload };

        case ACTIONS.SET_RESULTS:
            return {...state, results: action.payload, loading: false };

        case ACTIONS.SET_LOADING:
            return {...state, loading: action.payload };

        case ACTIONS.SET_RECENT_SEARCHES:
            return {...state, recentSearches: action.payload };

        case ACTIONS.ADD_TO_RECENT:
            {
                const newRecent = [action.payload, ...state.recentSearches].slice(
                    0,
                    SEARCH_CONFIG.MAX_RESULTS
                );
                return {...state, recentSearches: newRecent };
            }

        case ACTIONS.CLEAR_RECENT:
            return {...state, recentSearches: [] };

        case ACTIONS.SET_FILTERS:
            return {...state, filters: {...state.filters, ...action.payload } };

        case ACTIONS.CLEAR_FILTERS:
            return {
                ...state,
                filters: {
                    tags: [],
                    color: null,
                    isPinned: undefined,
                    isArchived: false,
                },
            };

        case ACTIONS.CLEAR_SEARCH:
            return {
                ...state,
                query: '',
                results: [],
                loading: false,
            };

        default:
            return state;
    }
};

/**
 * SearchContextProvider
 *
 * Provides search state and memoised action dispatchers to all descendants.
 * Recent-search persistence is handled asynchronously through StorageService.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Context provider wrapping children
 */
export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(searchReducer, initialState);

    /**
     * Update the current search query string.
     *
     * @param {string} query - New search text
     */
    const setQuery = useCallback(query => {
        dispatch({ type: ACTIONS.SET_QUERY, payload: query });
    }, []);

    /**
     * Replace the current result set (typically called after SearchService runs).
     *
     * @param {object[]} results - Array of matching note objects
     */
    const setResults = useCallback(results => {
        dispatch({ type: ACTIONS.SET_RESULTS, payload: results });
    }, []);

    /**
     * Toggle the loading spinner on or off.
     *
     * @param {boolean} loading
     */
    const setLoading = useCallback(loading => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
    }, []);

    /**
     * Push a query into the recent-searches list and persist to storage.
     * The list is trimmed to SEARCH_CONFIG.MAX_RESULTS entries.
     *
     * @param {string} query - The search term to remember
     */
    const addToRecent = useCallback(async query => {
        try {
            logger.log(`➕ Adding to recent searches: ${query}`);

            dispatch({ type: ACTIONS.ADD_TO_RECENT, payload: query });

            // Save to storage
            const newRecent = [query, ...state.recentSearches].slice(0, SEARCH_CONFIG.MAX_RESULTS);
            await StorageService.saveSearchHistory(newRecent);
        } catch (error) {
            logger.error('❌ Add to recent error:', error);
        }
    }, [state.recentSearches]);

    /**
     * Clear all recent searches from memory and storage.
     */
    const clearRecent = useCallback(async() => {
        try {
            logger.log('🗑️  Clearing recent searches');

            dispatch({ type: ACTIONS.CLEAR_RECENT });
            await StorageService.saveSearchHistory([]);
        } catch (error) {
            logger.error('❌ Clear recent error:', error);
        }
    }, []);

    /**
     * Hydrate recent searches from AsyncStorage on app start.
     */
    const loadRecent = useCallback(async() => {
        try {
            logger.log('📖 Loading recent searches');

            const recent = await StorageService.getSearchHistory();
            dispatch({ type: ACTIONS.SET_RECENT_SEARCHES, payload: recent });
        } catch (error) {
            logger.error('❌ Load recent error:', error);
        }
    }, []);

    /**
     * Merge partial filter updates into the existing filter state.
     *
     * @param {object} filters - Partial filter object (tags, color, isPinned, isArchived)
     */
    const setFilters = useCallback(filters => {
        dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    }, []);

    /**
     * Reset all filters to their default values.
     */
    const clearFilters = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_FILTERS });
    }, []);

    /**
     * Wipe query, results, and loading flag in one dispatch.
     * Recent searches are intentionally preserved.
     */
    const clearSearch = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_SEARCH });
    }, []);

    /** Public context value — state fields + memoised action dispatchers. */
    const value = {
        // State
        query: state.query,
        results: state.results,
        recentSearches: state.recentSearches,
        loading: state.loading,
        filters: state.filters,

        // Operations
        setQuery,
        setResults,
        setLoading,
        addToRecent,
        clearRecent,
        loadRecent,
        setFilters,
        clearFilters,
        clearSearch,
    };

    return <SearchContext.Provider value = { value } > { children } < /SearchContext.Provider>;
};