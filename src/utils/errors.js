/**
 * ============================================================================
 * Custom Error Classes
 * ============================================================================
 *
 * @file errors.js
 * @description Application-specific error hierarchy.  Each error class
 * extends `Error` with a `code` string and optional `details` payload,
 * making it easy for services to throw typed errors and for catch-blocks
 * to differentiate failure modes.
 *
 * Class tree:
 *   AppError (base)
 *    ├─ StorageError
 *    ├─ ValidationError
 *    ├─ NetworkError
 *    ├─ NavigationError
 *    └─ AuthenticationError
 */

/**
 * Base Error class
 */
export class AppError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', details = null) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date();
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp,
        };
    }
}

/**
 * Storage error
 */
export class StorageError extends AppError {
    constructor(message, details = null) {
        super(message, 'STORAGE_ERROR', details);
        this.name = 'StorageError';
    }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
    constructor(message, errors = [], details = null) {
        super(message, 'VALIDATION_ERROR', { errors, ...details });
        this.name = 'ValidationError';
        this.errors = errors;
    }

    addError(error) {
        this.errors.push(error);
    }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
    constructor(resource, id) {
        super(`${resource} not found`, 'NOT_FOUND', { resource, id });
        this.name = 'NotFoundError';
    }
}

/**
 * Duplicate error
 */
export class DuplicateError extends AppError {
    constructor(resource, property, value) {
        super(`${resource} with ${property} already exists`, 'DUPLICATE_ERROR', {
            resource,
            property,
            value,
        });
        this.name = 'DuplicateError';
    }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
    constructor(message, statusCode = null) {
        super(message, 'NETWORK_ERROR', { statusCode });
        this.name = 'NetworkError';
        this.statusCode = statusCode;
    }
}

/**
 * Permission error
 */
export class PermissionError extends AppError {
    constructor(action, resource) {
        super(`Permission denied: ${action} ${resource}`, 'PERMISSION_ERROR', {
            action,
            resource,
        });
        this.name = 'PermissionError';
    }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
    constructor(operation, timeout) {
        super(`${operation} timed out after ${timeout}ms`, 'TIMEOUT_ERROR', {
            operation,
            timeout,
        });
        this.name = 'TimeoutError';
    }
}

/**
 * Sync error
 */
export class SyncError extends AppError {
    constructor(message, failedItems = []) {
        super(message, 'SYNC_ERROR', { failedItems });
        this.name = 'SyncError';
        this.failedItems = failedItems;
    }
}

/**
 * Configuration error
 */
export class ConfigError extends AppError {
    constructor(key, message) {
        super(`Configuration error for ${key}: ${message}`, 'CONFIG_ERROR', { key });
        this.name = 'ConfigError';
    }
}

/**
 * Parse error
 */
export class ParseError extends AppError {
    constructor(format, message) {
        super(`Failed to parse ${format}: ${message}`, 'PARSE_ERROR', { format });
        this.name = 'ParseError';
    }
}

/**
 * User-friendly error messages
 */
export const ErrorMessages = {
    STORAGE_ERROR: 'Failed to save data. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NOT_FOUND: 'Item not found.',
    DUPLICATE_ERROR: 'This item already exists.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    PERMISSION_ERROR: 'You do not have permission to perform this action.',
    TIMEOUT_ERROR: 'Operation timed out. Please try again.',
    SYNC_ERROR: 'Failed to sync. Will retry later.',
    CONFIG_ERROR: 'Configuration error. Please contact support.',
    UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly message
 */
export const getErrorMessage = error => {
    if (error instanceof AppError) {
        return ErrorMessages[error.code] || error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ErrorMessages.UNKNOWN_ERROR;
};