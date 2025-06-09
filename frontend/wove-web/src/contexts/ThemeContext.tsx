'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AgeTier } from 'shared'; // Assuming AgeTier is exported from a shared location
import { ThemeConfig, generateCSSVariables, getTheme } from '../styles/themes'; // Corrected import path, removed unused themes, defaultTheme
import { useAuth } from './AuthContext'; // Assuming useAuth is in the same directory or a sub-directory
import { useDarkMode, ThemeMode } from '@/components/DarkModeProvider'; // Import useDarkMode and ThemeMode

interface ThemeContextType {
  currentTheme: ThemeConfig;
  ageTier: AgeTier;
  setAgeTier: (ageTier: AgeTier) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultAgeTier?: AgeTier;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultAgeTier = AgeTier.UNVERIFIED,
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const [ageTier, setAgeTier] = useState<AgeTier>(defaultAgeTier);
  const [isLoading, setIsLoading] = useState(true);
  // const { themeMode } = useDarkMode(); // Removed: DarkModeProvider handles dark mode
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getTheme(defaultAgeTier)); // Removed themeMode from getTheme

  useEffect(() => {
    if (!authLoading) {
      const newAgeTier = user?.ageTier || defaultAgeTier;
      setAgeTier(newAgeTier);
      const newTheme = getTheme(newAgeTier); // Removed themeMode from getTheme
      setCurrentTheme(newTheme);
      setIsLoading(false);

      // Apply theme as CSS variables to :root
      const cssVariables = generateCSSVariables(newTheme);
      const root = document.documentElement;
      Object.entries(cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Add age tier class to body. Dark mode class is handled by DarkModeProvider.
      document.body.className = ''; // Clear existing classes
      document.body.classList.add(`age-tier-${newAgeTier.toLowerCase()}`);
      // document.body.classList.add(themeMode); // REMOVED: DarkModeProvider handles this on <html>
    } else {
      setIsLoading(true);
    }
  }, [user, authLoading, defaultAgeTier]); // Removed themeMode from dependencies

  const handleSetAgeTier = (newAgeTier: AgeTier) => {
    setAgeTier(newAgeTier);
    setCurrentTheme(getTheme(newAgeTier)); // Removed themeMode from getTheme
  };

  const value: ThemeContextType = {
    currentTheme,
    ageTier,
    setAgeTier: handleSetAgeTier,
    isLoading: isLoading || authLoading,
  };

  return (
    <ThemeContext.Provider value={value} data-oid="rw:e:-l">
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
