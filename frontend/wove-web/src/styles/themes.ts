/**
 * Age-appropriate theming system for Wove
 * Provides different visual themes based on user's age tier
 */

import { AgeTier } from 'shared';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ThemeVariant {
  light: ThemeConfig;
  dark: ThemeConfig;
}

// Base theme configuration
const baseTheme = {
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Georgia, serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
};

// Kids Theme (Light)
const kidsLightTheme: ThemeConfig = {
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
      accent: '#FF6B6B',
    },
    border: '#E2E8F0',
    success: '#48BB78',
    warning: '#ED8936',
    error: '#F56565',
  },
  ...baseTheme,
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

// Kids Theme (Dark)
const kidsDarkTheme: ThemeConfig = {
  colors: {
    primary: '#FF8A8A',
    secondary: '#5EDDD4',
    accent: '#FFE66D',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: {
      primary: '#F7FAFC',
      secondary: '#CBD5E0',
      accent: '#FF8A8A',
    },
    border: '#4A5568',
    success: '#68D391',
    warning: '#F6AD55',
    error: '#FC8181',
  },
  ...baseTheme,
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
};

// Teens Theme (Light)
const teensLightTheme: ThemeConfig = {
  colors: {
    primary: '#667EEA',
    secondary: '#764BA2',
    accent: '#F093FB',
    background: '#FFFFFF',
    surface: '#F7FAFC',
    text: {
      primary: '#1A202C',
      secondary: '#2D3748',
      accent: '#667EEA',
    },
    border: '#E2E8F0',
    success: '#48BB78',
    warning: '#ED8936',
    error: '#F56565',
  },
  ...baseTheme,
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.12)',
  },
};

// Teens Theme (Dark)
const teensDarkTheme: ThemeConfig = {
  colors: {
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    accent: '#F093FB',
    background: '#111827',
    surface: '#1F2937',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      accent: '#7C3AED',
    },
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  ...baseTheme,
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
  },
};

// Adults Theme (Light)
const adultsLightTheme: ThemeConfig = {
  colors: {
    primary: '#2563EB',
    secondary: '#64748B',
    accent: '#0EA5E9',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: {
      primary: '#0F172A',
      secondary: '#334155',
      accent: '#2563EB',
    },
    border: '#E2E8F0',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
  },
  ...baseTheme,
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

// Adults Theme (Dark)
const adultsDarkTheme: ThemeConfig = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#0EA5E9',
    background: '#0F172A',
    surface: '#1E293B',
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      accent: '#3B82F6',
    },
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  ...baseTheme,
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },
};

// Default theme variants
const defaultThemeVariant: ThemeVariant = {
  light: adultsLightTheme,
  dark: adultsDarkTheme,
};

// Theme variants by age tier
export const themeVariants: Record<AgeTier, ThemeVariant> = {
  [AgeTier.KIDS]: {
    light: kidsLightTheme,
    dark: kidsDarkTheme,
  },
  [AgeTier.TEENS]: {
    light: teensLightTheme,
    dark: teensDarkTheme,
  },
  [AgeTier.ADULTS]: {
    light: adultsLightTheme,
    dark: adultsDarkTheme,
  },
  [AgeTier.UNVERIFIED]: defaultThemeVariant,
};

// Legacy exports for backward compatibility
export const themes: Record<AgeTier, ThemeConfig> = {
  [AgeTier.KIDS]: kidsLightTheme,
  [AgeTier.TEENS]: teensLightTheme,
  [AgeTier.ADULTS]: adultsLightTheme,
  [AgeTier.UNVERIFIED]: adultsLightTheme,
};

export const defaultTheme = adultsLightTheme;

// Utility functions
// Updated: getTheme now only returns the base (light) theme for the ageTier.
// Dark mode is handled by DarkModeProvider applying a class to <html> and Tailwind's dark: variants.
export function getTheme(ageTier: AgeTier): ThemeConfig {
  // Always return the light variant; dark mode is handled by CSS and Tailwind dark: variants
  return themeVariants[ageTier]?.light || defaultThemeVariant.light;
}

export function generateCSSVariables(theme: ThemeConfig): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text-primary': theme.colors.text.primary,
    '--color-text-secondary': theme.colors.text.secondary,
    '--color-text-accent': theme.colors.text.accent,
    '--color-border': theme.colors.border,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
    '--font-primary': theme.fonts.primary,
    '--font-secondary': theme.fonts.secondary,
    '--spacing-xs': theme.spacing.xs,
    '--spacing-sm': theme.spacing.sm,
    '--spacing-md': theme.spacing.md,
    '--spacing-lg': theme.spacing.lg,
    '--spacing-xl': theme.spacing.xl,
    '--border-radius-sm': theme.borderRadius.sm,
    '--border-radius-md': theme.borderRadius.md,
    '--border-radius-lg': theme.borderRadius.lg,
    '--border-radius-xl': theme.borderRadius.xl,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
  };
}