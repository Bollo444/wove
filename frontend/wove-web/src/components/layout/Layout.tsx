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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-oid="4d4ct1x">
        <div className="text-center" data-oid="1jrv4l4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            data-oid=":uugd_z"
          ></div>
          <p className="text-gray-600" data-oid="bv8ui2l">
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
      data-oid="ej20b.2"
    >
      <Header data-oid="8w:vssm" />
      <div className="flex" data-oid="gzrgvld">
        {showSidebar && (
          <div className="w-64 bg-surface shadow-sm" data-oid="51924je">
            <Sidebar data-oid="oh61jq_" />
          </div>
        )}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`} data-oid="v4bqpxy">
          <div className="container mx-auto px-4 py-6" data-oid="g5mxuxc">
            {children}
          </div>
        </main>
      </div>
      <Footer data-oid="p4:5kxg" />
    </div>
  );
};

export default Layout;
