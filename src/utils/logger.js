/**
 * Logging Utility
 * Centralized logging with development/production awareness
 */

const isDevelopment = __DEV__;

const LogLevels = {
    DEBUG: 'DEBUG',
    LOG: 'LOG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

const LogColors = {
    DEBUG: '\x1b[36m', // Cyan
    LOG: '\x1b[37m', // White
    INFO: '\x1b[34m', // Blue
    WARN: '\x1b[33m', // Yellow
    ERROR: '\x1b[31m', // Red
    RESET: '\x1b[0m', // Reset
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 * @returns {string} Formatted message
 */
const formatLogMessage = (level, message, data) => {
    const timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
    const color = LogColors[level] || LogColors.LOG;
    const reset = LogColors.RESET;

    let output = `${color}[${timestamp}] [${level}] ${message}${reset}`;

    if (data) {
        output += ` | ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`;
    }

    return output;
};

/**
 * Logger object with methods for different log levels
 */
export const logger = {
    /**
     * Log debug message (development only)
     */
    debug: (message, data) => {
        if (isDevelopment) {
            console.log(formatLogMessage(LogLevels.DEBUG, message, data));
        }
    },

    /**
     * Log general message
     */
    log: (message, data) => {
        if (isDevelopment) {
            console.log(formatLogMessage(LogLevels.LOG, message, data));
        }
    },

    /**
     * Log info message
     */
    info: (message, data) => {
        if (isDevelopment) {
            console.info(formatLogMessage(LogLevels.INFO, message, data));
        }
    },

    /**
     * Log warning message
     */
    warn: (message, data) => {
        console.warn(formatLogMessage(LogLevels.WARN, message, data));
    },

    /**
     * Log error message
     */
    error: (message, error) => {
        console.error(formatLogMessage(LogLevels.ERROR, message, null));
        if (error) {
            console.error(error);
        }
    },

    /**
     * Log performance timing
     */
    time: (label) => {
        if (isDevelopment) {
            console.time(label);
        }
    },

    /**
     * End performance timing
     */
    timeEnd: (label) => {
        if (isDevelopment) {
            console.timeEnd(label);
        }
    },

    /**
     * Log table (for structured data)
     */
    table: (data) => {
        if (isDevelopment) {
            console.table(data);
        }
    },

    /**
     * Log group start
     */
    groupStart: (label) => {
        if (isDevelopment) {
            console.group(label);
        }
    },

    /**
     * Log group end
     */
    groupEnd: () => {
        if (isDevelopment) {
            console.groupEnd();
        }
    },
};

/**
 * Get current debug status
 */
export const isDebugEnabled = () => isDevelopment;