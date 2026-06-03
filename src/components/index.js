/**
 * ============================================================================
 * Components Barrel Export
 * ============================================================================
 *
 * @file index.js
 * @description Central re-export point for all reusable UI components.
 *              Importing from '@components' resolves to this file via the
 *              babel module-resolver alias defined in babel.config.js.
 *
 * @module components
 */

export {
    default as NoteCard
}
from './NoteCard';
export {
    default as SearchBar
}
from './SearchBar';
export {
    default as FAB
}
from './FAB';
export {
    default as LoadingSpinner
}
from './LoadingSpinner';
export {
    default as EmptyState
}
from './EmptyState';
export {
    default as TagBadge
}
from './TagBadge';
export {
    default as ErrorBoundary
}
from './ErrorBoundary';
export {
    default as ScreenContainer
}
from './ScreenContainer';