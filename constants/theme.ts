/**
 * Caelestia Shell Theme - Arch Linux inspired purple/cyan gradient theme
 */

import { Platform } from 'react-native';

// Caelestia theme colors - Purple and Cyan gradients
const caelestiaPurple = '#7c3aed';
const caelestiaPurpleLight = '#a78bfa';
const caelestiaPurpleDark = '#5b21b6';
const caelestiaCyan = '#06b6d4';
const caelestiaCyanLight = '#67e8f9';
const caelestiaCyanDark = '#0891b2';
const caelestiaBackground = '#1a0d2e';
const caelestiaBackgroundLight = '#2d1b4e';
const caelestiaSurface = '#2d1b4e';
const caelestiaSurfaceLight = '#3d2a5e';

export const Colors = {
  light: {
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    background: caelestiaBackground,
    backgroundSecondary: caelestiaBackgroundLight,
    surface: caelestiaSurface,
    surfaceLight: caelestiaSurfaceLight,
    tint: caelestiaPurpleLight,
    accent: caelestiaCyan,
    accentLight: caelestiaCyanLight,
    icon: caelestiaPurpleLight,
    tabIconDefault: '#6b7280',
    tabIconSelected: caelestiaPurpleLight,
    primary: caelestiaPurple,
    primaryLight: caelestiaPurpleLight,
    primaryDark: caelestiaPurpleDark,
    secondary: caelestiaCyan,
    secondaryLight: caelestiaCyanLight,
    secondaryDark: caelestiaCyanDark,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    border: '#4c1d95',
    card: caelestiaSurface,
    cardLight: caelestiaSurfaceLight,
  },
  dark: {
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    background: caelestiaBackground,
    backgroundSecondary: caelestiaBackgroundLight,
    surface: caelestiaSurface,
    surfaceLight: caelestiaSurfaceLight,
    tint: caelestiaPurpleLight,
    accent: caelestiaCyan,
    accentLight: caelestiaCyanLight,
    icon: caelestiaPurpleLight,
    tabIconDefault: '#6b7280',
    tabIconSelected: caelestiaPurpleLight,
    primary: caelestiaPurple,
    primaryLight: caelestiaPurpleLight,
    primaryDark: caelestiaPurpleDark,
    secondary: caelestiaCyan,
    secondaryLight: caelestiaCyanLight,
    secondaryDark: caelestiaCyanDark,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    border: '#4c1d95',
    card: caelestiaSurface,
    cardLight: caelestiaSurfaceLight,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
