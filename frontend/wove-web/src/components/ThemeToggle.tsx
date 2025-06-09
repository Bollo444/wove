'use client';

import React from 'react';
import { Switch } from '@/components/ui/Switch'; // Assuming Switch is in ui folder
import { useDarkMode } from '@/components/DarkModeProvider';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'; // Or your preferred icons

export function ThemeToggle() {
  const { themeMode, toggleThemeMode } = useDarkMode();

  return (
    <div className="flex items-center space-x-2" data-oid="097k-d6">
      <SunIcon
        className={`h-5 w-5 ${themeMode === 'light' ? 'text-yellow-500' : 'text-gray-500'}`}
        data-oid="2q:xjj4"
      />
      <Switch
        id="theme-mode-switch"
        checked={themeMode === 'dark'}
        onCheckedChange={toggleThemeMode}
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        data-oid="u3_9ukh"
      />

      <MoonIcon
        className={`h-5 w-5 ${themeMode === 'dark' ? 'text-blue-500' : 'text-gray-500'}`}
        data-oid=":v..p.h"
      />
    </div>
  );
}
