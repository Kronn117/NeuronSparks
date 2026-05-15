/**
 * Search Context
 * Manages search state and recent searches
 */

import React, { createContext, useReducer, useCallback } from 'react';
import { logger } from '@utils/logger';
import { StorageService } from '@services/StorageService';
import { SEARCH_CONFIG } from '@utils/constants';

// Create context
export const SearchContext = createContext();

/**
 * Initial state
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
 * Action types
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
 * Reducer function
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
 * SearchContextProvider Component
 */
export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(searchReducer, initialState);

    /**
     * Set search query
     */
    const setQuery = useCallback(query => {
        dispatch({ type: ACTIONS.SET_QUERY, payload: query });
    }, []);

    /**
     * Set search results
     */
    const setResults = useCallback(results => {
        dispatch({ type: ACTIONS.SET_RESULTS, payload: results });
    }, []);

    /**
     * Set loading state
     */
    const setLoading = useCallback(loading => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
    }, []);

    /**
     * Add to recent searches
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
     * Clear recent searches
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
     * Load recent searches from storage
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
     * Set filters
     */
    const setFilters = useCallback(filters => {
        dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    }, []);

    /**
     * Clear filters
     */
    const clearFilters = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_FILTERS });
    }, []);

    /**
     * Clear all search state
     */
    const clearSearch = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_SEARCH });
    }, []);

    // Context value
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

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
