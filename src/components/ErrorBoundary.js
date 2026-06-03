/**
 * ErrorBoundary Component
 * Catches errors in component tree
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '@utils/theme';
import { logger } from '@utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, _errorInfo) {
        logger.error('ErrorBoundary caught error:', error);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.error}>{this.state.error?.message || 'Unknown error'}</Text>
                    <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.colors.bg_dark,
        paddingHorizontal: THEME.spacing.xl,
    },
    title: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.bold,
        color: THEME.colors.error,
        marginBottom: THEME.spacing.md,
        textAlign: 'center',
    },
    error: {
        fontSize: THEME.fontSizes.md,
        color: THEME.colors.text_secondary,
        marginBottom: THEME.spacing.xl,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.md,
        backgroundColor: THEME.colors.primary,
        borderRadius: THEME.borderRadius.lg,
    },
    buttonText: {
        color: THEME.colors.text_inverse,
        fontWeight: THEME.fontWeights.semibold,
    },
});

export default ErrorBoundary;
