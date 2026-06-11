import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  primary: '#FEC92D',
  primaryPressed: '#DCA900',
  success: '#35D07F',
  warning: '#F5A623',
  danger: '#FF5A5F',
  info: '#4DA3FF',
  route: '#3478F6',
} as const;

export const Colors = {
  light: {
    text: '#111318',
    background: '#F7F6F1',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#FFF4C5',
    textSecondary: '#68707D',
    surface: '#FFFFFF',
    surfaceElevated: '#F0EFEA',
    border: 'rgba(17, 19, 24, 0.08)',
    overlay: 'rgba(247, 246, 241, 0.92)',
    shadow: 'rgba(28, 24, 12, 0.14)',
  },
  dark: {
    text: '#FFFFFF',
    background: '#07080B',
    backgroundElement: '#191C22',
    backgroundSelected: '#2C281A',
    textSecondary: '#A6AAB4',
    surface: '#111318',
    surfaceElevated: '#20232B',
    border: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(11, 12, 16, 0.92)',
    shadow: 'rgba(0, 0, 0, 0.58)',
  },
} as const;

export const ChargeThemes = {
  light: { ...Colors.light, mode: 'light' as const, isDark: false },
  dark: { ...Colors.dark, mode: 'dark' as const, isDark: true },
};

export type ChargeTheme = (typeof ChargeThemes)[keyof typeof ChargeThemes];

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  twoHalf: 12,
  three: 16,
  threeHalf: 20,
  four: 24,
  five: 32,
  fiveHalf: 40,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Radius = {
  small: 12,
  control: 16,
  card: 24,
  hero: 32,
  pill: 999,
} as const;
