/**
 * ============================================================================
 * Central Theme Configuration
 * ============================================================================
 *
 * @file theme.js
 * @description Single source of truth for every colour, spacing scale,
 * typography token, shadow, border-radius, and animation constant used
 * across the app.  Supports both dark and light palettes; the current
 * build is locked to dark mode (Tony Stark / cyberpunk aesthetic).
 *
 * Key exports:
 *   - DARK_COLORS / LIGHT_COLORS — full colour palettes
 *   - SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS
 *   - THEME — merged object with `colors`, `spacing`, etc.
 *   - getThemeColors(isDark), getThemeShadows(isDark)
 *
 * RULE: THEME is IMMUTABLE — never modify it directly.
 *
 * @see ThemeContext.js - Consumes these tokens
 */

// Dark Mode Color Palette - Enhanced Tony Stark Theme
const DARK_COLORS = {
    // Primary Colors - Arc Reactor Blue (Enhanced)
    primary: '#00D4FF', // Brighter, more vibrant arc reactor blue
    primaryDark: '#0099CC',
    primaryLight: '#66E5FF',

    // Gold Accents - Premium Iron Gold
    gold: '#FFC800', // Warmer, more premium gold
    goldDark: '#D4A500',
    goldLight: '#FFE066',

    // Background Colors - Deep Space Dark
    bg_dark: '#0D1117', // GitHub dark-inspired, easier on eyes
    bg_darker: '#090C10', // Nearly black
    bg_secondary: '#161B22', // Dark gray with blue tint
    bg_tertiary: '#21262D', // Medium gray
    bg_card: '#1C2128', // Card background

    // Accent Colors - Modern Neon
    accent_purple: '#A855F7', // Modern purple
    accent_cyan: '#06B6D4', // Cyan
    accent_pink: '#EC4899', // Modern pink
    accent_orange: '#F97316', // Orange
    accent_red: '#EF4444', // Modern red
    accent_green: '#10B981', // Modern green

    // Status Colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Text Colors - High Contrast
    text_primary: '#F0F6FC', // Off-white for better readability
    text_secondary: '#8B949E', // Softer gray
    text_tertiary: '#6E7681', // Muted gray
    text_inverse: '#0D1117', // Dark for light mode

    // Borders & Dividers - Subtle
    border_light: 'rgba(240, 246, 252, 0.1)',
    border_medium: 'rgba(240, 246, 252, 0.15)',
    border_dark: 'rgba(240, 246, 252, 0.08)',
    border_accent: 'rgba(0, 212, 255, 0.3)', // Subtle blue border

    // Overlay
    overlay_light: 'rgba(13, 17, 23, 0.4)',
    overlay_medium: 'rgba(13, 17, 23, 0.6)',
    overlay_dark: 'rgba(13, 17, 23, 0.85)',

    // Note Colors - Modern Palette
    note_blue: '#00D4FF',
    note_purple: '#A855F7',
    note_pink: '#EC4899',
    note_green: '#22C55E',
    note_orange: '#F97316',
    note_cyan: '#06B6D4',
    note_gold: '#FFC800',
    note_red: '#EF4444',
    note_indigo: '#6366F1',
    note_teal: '#14B8A6',
};

// Light Mode Color Palette - Clean Modern Theme
const LIGHT_COLORS = {
    // Primary Colors - Ocean Blue
    primary: '#0EA5E9', // Sky blue
    primaryDark: '#0284C7',
    primaryLight: '#38BDF8',

    // Gold Accents - Warm Gold
    gold: '#F59E0B', // Amber
    goldDark: '#D97706',
    goldLight: '#FBBF24',

    // Background Colors - Clean White/Gray
    bg_dark: '#FFFFFF', // White
    bg_darker: '#F8FAFC', // Very light gray
    bg_secondary: '#F1F5F9', // Light gray
    bg_tertiary: '#E2E8F0', // Medium gray
    bg_card: '#FFFFFF', // Card background

    // Accent Colors - Vibrant but Soft
    accent_purple: '#8B5CF6',
    accent_cyan: '#06B6D4',
    accent_pink: '#EC4899',
    accent_orange: '#F97316',
    accent_red: '#EF4444',
    accent_green: '#10B981',

    // Status Colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Text Colors - Dark on Light
    text_primary: '#0F172A', // Dark slate
    text_secondary: '#475569', // Slate gray
    text_tertiary: '#94A3B8', // Light gray
    text_inverse: '#FFFFFF', // White for dark mode

    // Borders & Dividers - Subtle Gray
    border_light: 'rgba(15, 23, 42, 0.08)',
    border_medium: 'rgba(15, 23, 42, 0.12)',
    border_dark: 'rgba(15, 23, 42, 0.05)',
    border_accent: 'rgba(14, 165, 233, 0.3)', // Subtle blue border

    // Overlay
    overlay_light: 'rgba(255, 255, 255, 0.5)',
    overlay_medium: 'rgba(255, 255, 255, 0.7)',
    overlay_dark: 'rgba(255, 255, 255, 0.9)',

    // Note Colors - Light Mode Variants
    note_blue: '#0EA5E9',
    note_purple: '#8B5CF6',
    note_pink: '#EC4899',
    note_green: '#22C55E',
    note_orange: '#F97316',
    note_cyan: '#06B6D4',
    note_gold: '#F59E0B',
    note_red: '#EF4444',
    note_indigo: '#6366F1',
    note_teal: '#14B8A6',
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
        shadowColor: '#00D4FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    goldGlow: {
        shadowColor: '#FFC800',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    neon: {
        shadowColor: '#00D4FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
        elevation: 12,
    },
    // Light mode shadows
    lightSmall: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    lightMedium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    lightLarge: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    lightGlow: {
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    lightGoldGlow: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
};

const ANIMATION_DURATION = {
    fast: 100,
    base: 300,
    slow: 500,
    slower: 800,
    spring: 500,
};

const ANIMATION_SPRING = {
    bouncy: {
        damping: 8,
        stiffness: 400,
        mass: 1,
    },
    smooth: {
        damping: 15,
        stiffness: 150,
        mass: 1,
    },
    snappy: {
        damping: 10,
        stiffness: 500,
        mass: 0.5,
    },
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
    colors: DARK_COLORS, // Default to dark mode
    darkColors: DARK_COLORS,
    lightColors: LIGHT_COLORS,
    spacing: SPACING,
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    animationDuration: ANIMATION_DURATION,
    animationSpring: ANIMATION_SPRING,
    zIndex: Z_INDEX,
};

/**
 * Get colors based on theme mode
 * @param {boolean} isDarkMode - Whether to use dark mode colors
 * @returns {Object} Color palette for the specified mode
 */
export const getThemeColors = (isDarkMode = true) => {
    return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};

/**
 * Get shadows based on theme mode
 * @param {boolean} isDarkMode - Whether to use dark mode shadows
 * @returns {Object} Shadow styles for the specified mode
 */
export const getThemeShadows = (isDarkMode = true) => {
    if (isDarkMode) {
        return {
            small: SHADOWS.small,
            medium: SHADOWS.medium,
            large: SHADOWS.large,
            glow: SHADOWS.glow,
            goldGlow: SHADOWS.goldGlow,
            neon: SHADOWS.neon,
        };
    }
    return {
        small: SHADOWS.lightSmall,
        medium: SHADOWS.lightMedium,
        large: SHADOWS.lightLarge,
        glow: SHADOWS.lightGlow,
        goldGlow: SHADOWS.lightGoldGlow,
        neon: SHADOWS.lightGlow,
    };
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