'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

interface DarkModeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface DarkModeProviderProps {
  children: ReactNode;
  defaultThemeMode?: ThemeMode;
  storageKey?: string;
}

export function DarkModeProvider({
  children,
  defaultThemeMode = 'light',
  storageKey = 'wove-theme-mode',
}: DarkModeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultThemeMode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after hydration
    try {
      const storedMode = window.localStorage.getItem(storageKey) as ThemeMode | null;
      if (storedMode) {
        setThemeMode(storedMode);
      } else {
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeMode(userPrefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      console.error('Error reading theme mode from localStorage or media query', e);
      // Fallback to default if error occurs
      setThemeMode(defaultThemeMode);
    }
    setHydrated(true);
  }, [defaultThemeMode, storageKey]); // Dependencies ensure this runs if props change, though unlikely for these

  useEffect(() => {
    // This effect applies the theme class and saves to localStorage
    // It should only run after hydration and when themeMode actually changes
    if (!hydrated) return; // Don't run on initial server render or before client-side check

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
    try {
      window.localStorage.setItem(storageKey, themeMode);
    } catch (e) {
      console.error('Error saving theme mode to localStorage', e);
    }
  }, [themeMode, storageKey, hydrated]);

  const toggleThemeMode = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Prevent UI flash by not rendering children until theme is determined on client
  // Or, to avoid layout shift, you might render children immediately but accept potential initial mismatch
  // For now, let's render children immediately to avoid blocking rendering.
  // The key is that the *initial* state for themeMode matches the server.

  return (
    <DarkModeContext.Provider
      value={{ themeMode, setThemeMode, toggleThemeMode }}
      data-oid="o03dn9c"
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
