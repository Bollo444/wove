'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBell from '../notifications/NotificationBell';
import NotificationSettings from '../notifications/NotificationSettings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { ageTier, currentTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const getAgeAppropriateNavigation = () => {
    const baseNav = [
      { href: '/', label: 'Home', icon: '🏠' },
      { href: '/explore', label: 'Explore', icon: '🔍' },
    ];

    switch (ageTier) {
      case 'kids':
        return [
          ...baseNav,
          { href: '/create', label: 'Create Story', icon: '✨' },
          { href: '/my-stories', label: 'My Stories', icon: '📚' },
        ];
      case 'teens':
        return [
          ...baseNav,
          { href: '/create', label: 'Create', icon: '✍️' },
          { href: '/collaborate', label: 'Collaborate', icon: '🤝' },
          { href: '/my-stories', label: 'My Stories', icon: '📖' },
        ];
      case 'adults':
        return [
          ...baseNav,
          { href: '/create', label: 'Create', icon: '✍️' },
          { href: '/collaborate', label: 'Collaborate', icon: '🤝' },
          { href: '/my-stories', label: 'Library', icon: '📚' },
          { href: '/analytics', label: 'Analytics', icon: '📊' },
        ];
      default:
        return baseNav;
    }
  };

  const getHeaderStyles = () => {
    switch (ageTier) {
      case 'kids':
        return {
          background: 'bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400',
          text: 'text-white',
          shadow: 'shadow-lg',
          logoSize: 'text-2xl',
          navStyle: 'hover:bg-white hover:bg-opacity-20 rounded-full px-3 py-2 transition-all duration-200'
        };
      case 'teens':
        return {
          background: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600',
          text: 'text-white',
          shadow: 'shadow-md',
          logoSize: 'text-xl',
          navStyle: 'hover:bg-white hover:bg-opacity-15 rounded-md px-3 py-2 transition-all duration-200'
        };
      case 'adults':
        return {
          background: 'bg-white border-b border-gray-200',
          text: 'text-gray-800',
          shadow: 'shadow-sm',
          logoSize: 'text-xl',
          navStyle: 'hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-200'
        };
      default:
        return {
          background: 'bg-white border-b border-gray-200',
          text: 'text-gray-800',
          shadow: 'shadow-sm',
          logoSize: 'text-xl',
          navStyle: 'hover:bg-gray-100 rounded-md px-3 py-2 transition-all duration-200'
        };
    }
  };

  const navigation = getAgeAppropriateNavigation();
  const styles = getHeaderStyles();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className={`${styles.background} ${styles.shadow} sticky top-0 z-40`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">📖</span>
              <span className={`font-bold ${styles.logoSize} ${styles.text}`}>
                Wove
              </span>
            </Link>

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 ${styles.text} ${styles.navStyle}`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side - User actions */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notification Bell */}
                  <NotificationBell className="" />
                  
                  {/* Notification Settings Button */}
                  <button
                    onClick={() => setShowNotificationSettings(true)}
                    className={`p-2 rounded-full ${styles.navStyle} ${styles.text}`}
                    title="Notification Settings"
                  >
                    ⚙️
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-2 ${styles.text} ${styles.navStyle}`}
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.firstName?.[0] || user.username?.[0] || '?'}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm font-medium">
                        {user.firstName || user.username}
                      </span>
                      <span className="text-xs">▼</span>
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          👤 Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ⚙️ Settings
                        </Link>
                        {ageTier === 'kids' || ageTier === 'teens' ? (
                          <Link
                            href="/parental-controls"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            👨‍👩‍👧‍👦 Parental Controls
                          </Link>
                        ) : null}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className={`${styles.text} ${styles.navStyle} text-sm font-medium`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {user && (
            <div className="md:hidden border-t border-opacity-20 py-2">
              <nav className="flex items-center justify-around">
                {navigation.slice(0, 4).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center space-y-1 ${styles.text} ${styles.navStyle} py-2`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Click outside to close user menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Notification Settings Modal */}
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </>
  );
};

export default Header;