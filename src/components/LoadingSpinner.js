/**
 * ============================================================================
 * LoadingSpinner Component
 * ============================================================================
 *
 * @file LoadingSpinner.js
 * @description A full-screen loading indicator shown while data is being fetched
 *              from AsyncStorage during initial app startup. Renders a native
 *              ActivityIndicator centred on screen with an optional text message.
 *
 * @props {string} [size='large']           - ActivityIndicator size ('small' | 'large')
 * @props {string} [color]                  - Spinner colour (defaults to primary accent)
 * @props {string} [message]                - Optional text label below the spinner
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { THEME } from '@utils/theme';

const LoadingSpinner = ({ size = 'large', color = THEME.colors.primary, message }) => {
        return ( <
            View style = { styles.container } >
            <
            ActivityIndicator size = { size }
            color = { color }
            /> {
                message ? < Text style = { styles.message } > { message } < /Text> : null} <
                    /View>
            );
        };

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: THEME.colors.bg_dark,
            },
            message: {
                marginTop: THEME.spacing.md,
                fontSize: THEME.fontSizes.md,
                color: THEME.colors.text_primary,
            },
        });

        export default LoadingSpinner;