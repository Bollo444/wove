'use client';

import React from 'react';
import { Switch } from '@/components/ui/Switch'; // Assuming Switch is in ui folder
import { useDarkMode } from '@/components/DarkModeProvider';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'; // Or your preferred icons

export function ThemeToggle() {
  const { themeMode, toggleThemeMode } = useDarkMode();

  return (
    <div className="flex items-center space-x-2" data-oid="m8iv7az">
      <SunIcon
        className={`h-5 w-5 ${themeMode === 'light' ? 'text-yellow-500' : 'text-gray-500'}`}
        data-oid="zrnjce5"
      />

      <Switch
        id="theme-mode-switch"
        checked={themeMode === 'dark'}
        onCheckedChange={toggleThemeMode}
        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        data-oid="jjx0hpr"
      />

      <MoonIcon
        className={`h-5 w-5 ${themeMode === 'dark' ? 'text-blue-500' : 'text-gray-500'}`}
        data-oid="xhe.ao3"
      />
    </div>
  );
}
