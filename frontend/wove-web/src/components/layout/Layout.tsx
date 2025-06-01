'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = false,
}) => {
  const { currentTheme, ageTier, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen theme-${ageTier}`}
      style={{
        backgroundColor: currentTheme.colors.background,
        fontFamily: currentTheme.fonts.primary,
      }}
    >
      <Header />
      <div className="flex">
        {showSidebar && (
          <div className="w-64 bg-surface shadow-sm">
            <Sidebar />
          </div>
        )}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
