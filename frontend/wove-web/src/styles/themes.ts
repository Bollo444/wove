/**
 * Age-appropriate theming system for Wove
 * Provides different visual themes based on user's age tier
 */

import { AgeTier } from 'shared';

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

// Kids Theme (Under 13) - Bright, playful, rounded
const kidsTheme: ThemeConfig = {
  colors: {
    primary: '#FF6B6B',     // Bright coral
    secondary: '#4ECDC4',   // Turquoise
    accent: '#FFE66D',      // Sunny yellow
    background: '#FFF8F0',  // Warm cream
    surface: '#FFFFFF',
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
  fonts: {
    primary: '"Comic Neue", "Nunito", sans-serif',
    secondary: '"Nunito", sans-serif',
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
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
};

// Teens Theme (13-17) - Modern, vibrant, trendy
const teensTheme: ThemeConfig = {
  colors: {
    primary: '#667EEA',     // Purple-blue
    secondary: '#764BA2',   // Deep purple
    accent: '#F093FB',      // Pink gradient
    background: '#F7FAFC',  // Light gray
    surface: '#FFFFFF',
    text: {
      primary: '#1A202C',
      secondary: '#2D3748',
      accent: '#667EEA',
    },
    border: '#E2E8F0',
    success: '#38B2AC',
    warning: '#ED8936',
    error: '#E53E3E',
  },
  fonts: {
    primary: '"Inter", "Poppins", sans-serif',
    secondary: '"Poppins", sans-serif',
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
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

// Adults Theme (18+) - Professional, sophisticated, clean
const adultsTheme: ThemeConfig = {
  colors: {
    primary: '#2B6CB0',     // Professional blue
    secondary: '#2D3748',   // Dark gray
    accent: '#38B2AC',      // Teal
    background: '#FFFFFF',  // Pure white
    surface: '#F7FAFC',
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      accent: '#2B6CB0',
    },
    border: '#E2E8F0',
    success: '#38A169',
    warning: '#D69E2E',
    error: '#E53E3E',
  },
  fonts: {
    primary: '"Inter", "system-ui", sans-serif',
    secondary: '"system-ui", sans-serif',
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
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

// Default/Unverified Theme - Neutral, accessible
const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#4A5568',     // Neutral gray
    secondary: '#718096',   // Light gray
    accent: '#38B2AC',      // Teal accent
    background: '#F7FAFC',  // Light background
    surface: '#FFFFFF',
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      accent: '#38B2AC',
    },
    border: '#E2E8F0',
    success: '#38A169',
    warning: '#D69E2E',
    error: '#E53E3E',
  },
  fonts: {
    primary: '"Inter", "system-ui", sans-serif',
    secondary: '"system-ui", sans-serif',
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
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

export const themes: Record<AgeTier, ThemeConfig> = {
  [AgeTier.KIDS]: kidsTheme,
  [AgeTier.TEENS]: teensTheme,
  [AgeTier.ADULTS]: adultsTheme,
  [AgeTier.UNVERIFIED]: defaultTheme,
};

export const getTheme = (ageTier: AgeTier): ThemeConfig => {
  return themes[ageTier] || defaultTheme;
};

export const generateCSSVariables = (theme: ThemeConfig): string => {
  return `
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-accent: ${theme.colors.text.accent};
    --color-border: ${theme.colors.border};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
    --font-primary: ${theme.fonts.primary};
    --font-secondary: ${theme.fonts.secondary};
    --font-size-xs: ${theme.fonts.sizes.xs};
    --font-size-sm: ${theme.fonts.sizes.sm};
    --font-size-base: ${theme.fonts.sizes.base};
    --font-size-lg: ${theme.fonts.sizes.lg};
    --font-size-xl: ${theme.fonts.sizes.xl};
    --font-size-2xl: ${theme.fonts.sizes['2xl']};
    --font-size-3xl: ${theme.fonts.sizes['3xl']};
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --border-radius-sm: ${theme.borderRadius.sm};
    --border-radius-md: ${theme.borderRadius.md};
    --border-radius-lg: ${theme.borderRadius.lg};
    --border-radius-xl: ${theme.borderRadius.xl};
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
  `;
};