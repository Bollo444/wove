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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-oid="0nzsxol">
        <div className="text-center" data-oid=".0yc_es">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            data-oid="vspc8s4"
          ></div>
          <p className="text-gray-600" data-oid="hapxo7j">
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
      data-oid="4tb0e:_"
    >
      <Header data-oid="bgjzri8" />
      <div className="flex" data-oid="1yo8eg3">
        {showSidebar && (
          <div className="w-64 bg-surface shadow-sm" data-oid="t0msdrb">
            <Sidebar data-oid="t.tmtz:" />
          </div>
        )}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`} data-oid="ldo31x6">
          <div className="container mx-auto px-4 py-6" data-oid="fqr9a:2">
            {children}
          </div>
        </main>
      </div>
      <Footer data-oid="kmxq4td" />
    </div>
  );
};

export default Layout;
