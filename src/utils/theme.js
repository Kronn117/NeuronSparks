/**
 * Central Theme Configuration
 * All colors, spacing, typography, and component styles defined here
 * RULE: THEME is IMMUTABLE - never modify directly
 */

const COLORS = {
    // Primary Colors - Cyberpunk Neon Palette
    primary: '#00FF41', // Bright neon green
    primaryDark: '#00CC33',
    primaryLight: '#39FF14',

    // Background Colors
    bg_dark: '#0A0E27', // Deep space blue
    bg_darker: '#050810', // Nearly black
    bg_secondary: '#1A1F3A', // Slightly lighter blue
    bg_tertiary: '#2D3561', // Medium blue

    // Accent Colors
    accent_purple: '#B300FF', // Neon purple
    accent_cyan: '#00D9FF', // Neon cyan
    accent_pink: '#FF006E', // Neon pink
    accent_orange: '#FF6B00', // Neon orange
    accent_yellow: '#FFE600', // Neon yellow

    // Status Colors
    success: '#00FF41', // Green (same as primary)
    warning: '#FFE600', // Yellow
    error: '#FF006E', // Pink/Red
    info: '#00D9FF', // Cyan

    // Text Colors
    text_primary: '#E8E8E8', // Light gray
    text_secondary: '#A8A8A8', // Medium gray
    text_tertiary: '#707070', // Dark gray
    text_inverse: '#0A0E27', // Dark (for light backgrounds)

    // Borders & Dividers
    border_light: 'rgba(232, 232, 232, 0.1)',
    border_medium: 'rgba(232, 232, 232, 0.2)',
    border_dark: 'rgba(232, 232, 232, 0.05)',

    // Overlay
    overlay_light: 'rgba(0, 0, 0, 0.3)',
    overlay_medium: 'rgba(0, 0, 0, 0.5)',
    overlay_dark: 'rgba(0, 0, 0, 0.8)',

    // Note Colors
    note_blue: '#1E90FF',
    note_purple: '#9933FF',
    note_pink: '#FF1493',
    note_green: '#00CC33',
    note_orange: '#FF8C00',
    note_cyan: '#00D9FF',
};

const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

const FONT_SIZES = {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    giant: 48,
};

const FONT_WEIGHTS = {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
};

const BORDER_RADIUS = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 24,
    full: 9999,
};

const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    glow: {
        shadowColor: '#00FF41',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
};

const ANIMATION_DURATION = {
    fast: 100,
    base: 300,
    slow: 500,
    slower: 800,
};

const Z_INDEX = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    notification: 800,
};

export const THEME = {
    colors: COLORS,
    spacing: SPACING,
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    animationDuration: ANIMATION_DURATION,
    zIndex: Z_INDEX,
};

/**
 * Text Styles - Predefined typography combinations
 */
export const TEXT_STYLES = {
    h1: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        lineHeight: 40,
        color: THEME.colors.text_primary,
    },
    h2: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        lineHeight: 32,
        color: THEME.colors.text_primary,
    },
    h3: {
        fontSize: THEME.fontSizes.xl,
        fontWeight: THEME.fontWeights.semibold,
        lineHeight: 28,
        color: THEME.colors.text_primary,
    },
    body: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.normal,
        lineHeight: 24,
        color: THEME.colors.text_primary,
    },
    bodySecondary: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.normal,
        lineHeight: 24,
        color: THEME.colors.text_secondary,
    },
    caption: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.normal,
        lineHeight: 18,
        color: THEME.colors.text_secondary,
    },
    button: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        lineHeight: 20,
        color: THEME.colors.text_primary,
    },
    code: {
        fontSize: THEME.fontSizes.base,
        fontWeight: THEME.fontWeights.normal,
        fontFamily: 'JetBrainsMono-Regular',
        color: THEME.colors.accent_cyan,
    },
};

/**
 * Component Styles - Common component dimensions and styles
 */
export const COMPONENT_STYLES = {
    // Buttons
    buttonSmall: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.sm,
        minHeight: 36,
    },
    buttonMedium: {
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        minHeight: 44,
    },
    buttonLarge: {
        paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        minHeight: 52,
    },

    // Input Fields
    inputSmall: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.sm,
        fontSize: THEME.fontSizes.sm,
        borderWidth: 1,
        borderColor: THEME.colors.border_medium,
    },
    inputMedium: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        fontSize: THEME.fontSizes.md,
        borderWidth: 1,
        borderColor: THEME.colors.border_medium,
    },

    // Cards
    cardSmall: {
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: THEME.colors.bg_secondary,
        ...THEME.shadows.small,
    },
    cardMedium: {
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: THEME.colors.bg_secondary,
        ...THEME.shadows.medium,
    },
    cardLarge: {
        padding: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: THEME.colors.bg_secondary,
        ...THEME.shadows.large,
    },

    // FAB (Floating Action Button)
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.large,
    },

    // Badge
    badge: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.full,
        minHeight: 28,
    },
};