/**
 * ============================================================================
 * Notification Service
 * ============================================================================
 *
 * @file NotificationService.js
 * @description Wrapper around React Native's `Alert` API with convenience
 * helpers for success / error / warning / info toasts and destructive
 * confirmations.  Currently all "toast" methods fall back to `Alert.alert`;
 * a future iteration will swap them for a proper toast component.
 *
 * Placeholder methods exist for local push notifications (to be implemented
 * with `react-native-notifications` or Expo Notifications).
 *
 * @see src/utils/logger.js
 */

import { logger } from '@utils/logger';
import { Alert } from 'react-native';

/** NotificationService singleton — all methods are synchronous unless noted. */
export const NotificationService = {
    /**
     * Show alert dialog
     * @param {string} title - Alert title
     * @param {string} message - Alert message
     * @param {object} options - Alert options
     */
    showAlert: (title, message, options = {}) => {
        try {
            logger.log(`🔔 Showing alert: ${title}`);

            Alert.alert(
                title,
                message,
                options.buttons || [{ text: 'OK', onPress: () => undefined }], {
                    cancelable: options.cancelable !== false,
                }
            );
        } catch (error) {
            logger.error('❌ Alert error:', error);
        }
    },

    /**
     * Show confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {function} onConfirm - Confirmation callback
     * @param {function} onCancel - Cancel callback
     */
    showConfirmation: (title, message, onConfirm, onCancel) => {
        try {
            logger.log(`❓ Showing confirmation: ${title}`);

            Alert.alert(title, message, [{
                    text: 'Cancel',
                    onPress: onCancel,
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: onConfirm,
                    style: 'default',
                },
            ]);
        } catch (error) {
            logger.error('❌ Confirmation error:', error);
        }
    },

    /**
     * Show destructive confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {function} onConfirm - Confirmation callback
     * @param {function} onCancel - Cancel callback
     */
    showDestructiveConfirmation: (title, message, onConfirm, onCancel) => {
        try {
            logger.log(`⚠️  Showing destructive confirmation: ${title}`);

            Alert.alert(title, message, [{
                    text: 'Cancel',
                    onPress: onCancel,
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: onConfirm,
                    style: 'destructive',
                },
            ]);
        } catch (error) {
            logger.error('❌ Destructive confirmation error:', error);
        }
    },

    /**
     * Show success notification (currently shows alert - can be replaced with Toast)
     * @param {string} message - Success message
     */
    showSuccess: message => {
        try {
            logger.log(`✅ Success: ${message}`);
            // TODO: Replace with Toast component
            Alert.alert('Success', message);
        } catch (error) {
            logger.error('❌ Success notification error:', error);
        }
    },

    /**
     * Show error notification
     * @param {string} message - Error message
     */
    showError: message => {
        try {
            logger.error(`❌ Error: ${message}`);
            // TODO: Replace with Toast component
            Alert.alert('Error', message);
        } catch (error) {
            logger.error('❌ Error notification error:', error);
        }
    },

    /**
     * Show warning notification
     * @param {string} message - Warning message
     */
    showWarning: message => {
        try {
            logger.warn(`⚠️  Warning: ${message}`);
            // TODO: Replace with Toast component
            Alert.alert('Warning', message);
        } catch (error) {
            logger.error('❌ Warning notification error:', error);
        }
    },

    /**
     * Show info notification
     * @param {string} message - Info message
     */
    showInfo: message => {
        try {
            logger.info(`ℹ️  Info: ${message}`);
            // TODO: Replace with Toast component
            Alert.alert('Information', message);
        } catch (error) {
            logger.error('❌ Info notification error:', error);
        }
    },

    /**
     * Schedule local notification (placeholder for future implementation)
     * @param {object} notificationData - Notification data
     */
    scheduleNotification: async notificationData => {
        try {
            logger.log('📅 Scheduling notification:', notificationData);
            // TODO: Implement with react-native-notifications or similar
        } catch (error) {
            logger.error('❌ Schedule notification error:', error);
        }
    },

    /**
     * Cancel scheduled notification
     * @param {string} notificationId - Notification ID
     */
    cancelNotification: async notificationId => {
        try {
            logger.log(`❌ Canceling notification: ${notificationId}`);
            // TODO: Implement cancellation logic
        } catch (error) {
            logger.error('❌ Cancel notification error:', error);
        }
    },
};