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

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { currentTheme, ageTier, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-oid="i8p.nuy">
        <div className="text-center" data-oid="5ns_9lv">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            data-oid="icd:.ii"
          ></div>
          <p className="text-gray-600" data-oid="jkj:ona">
            Loading...
          </p>
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
      data-oid="lkfee27"
    >
      <Header data-oid="j._nsul" />
      <div className="flex" data-oid="m3-r_.x">
        {showSidebar && (
          <div className="w-64 bg-surface shadow-sm" data-oid="5zzwh3p">
            <Sidebar data-oid="vejxutv" />
          </div>
        )}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`} data-oid="f03mz1c">
          <div className="container mx-auto px-4 py-6" data-oid="mz9._zk">
            {children}
          </div>
        </main>
      </div>
      <Footer data-oid=":ey.x8-" />
    </div>
  );
};

export default Layout;
