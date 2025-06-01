'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AgeTier } from '@shared/types/age-tier';
import { ThemeConfig, getTheme, generateCSSVariables } from '../styles/themes';
import { useAuth } from './AuthContext';

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
  defaultAgeTier = AgeTier.UNVERIFIED 
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const [ageTier, setAgeTier] = useState<AgeTier>(defaultAgeTier);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getTheme(defaultAgeTier));

  // Update age tier based on authenticated user
  useEffect(() => {
    if (!authLoading) {
      if (user?.ageTier) {
        const userAgeTier = user.ageTier as AgeTier;
        setAgeTier(userAgeTier);
        setCurrentTheme(getTheme(userAgeTier));
      } else {
        // User not authenticated or no age tier, use default
        setAgeTier(defaultAgeTier);
        setCurrentTheme(getTheme(defaultAgeTier));
      }
      setIsLoading(false);
    }
  }, [user, authLoading, defaultAgeTier]);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const cssVariables = generateCSSVariables(currentTheme);
    
    // Create a style element to inject CSS variables
    let styleElement = document.getElementById('theme-variables');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-variables';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `:root { ${cssVariables} }`;
    
    // Add age tier class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${ageTier}`);
    
    return () => {
      // Cleanup on unmount
      const element = document.getElementById('theme-variables');
      if (element) {
        element.remove();
      }
    };
  }, [currentTheme, ageTier]);

  const handleSetAgeTier = (newAgeTier: AgeTier) => {
    setAgeTier(newAgeTier);
    setCurrentTheme(getTheme(newAgeTier));
  };

  const value: ThemeContextType = {
    currentTheme,
    ageTier,
    setAgeTier: handleSetAgeTier,
    isLoading: isLoading || authLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;