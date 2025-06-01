'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { ageTier } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('');

  const getAgeAppropriateSections = () => {
    const baseSections = [
      {
        title: 'Stories',
        icon: '📚',
        items: [
          { href: '/my-stories', label: 'My Stories', icon: '📖' },
          { href: '/favorites', label: 'Favorites', icon: '⭐' },
          { href: '/recent', label: 'Recently Read', icon: '🕒' },
        ]
      },
    ];

    switch (ageTier) {
      case 'kids':
        return [
          {
            title: 'My Stories',
            icon: '📚',
            items: [
              { href: '/my-stories', label: 'My Stories', icon: '📖' },
              { href: '/shared-with-me', label: 'Shared with Me', icon: '🤝' },
              { href: '/favorites', label: 'Favorites', icon: '⭐' },
            ]
          },
          {
            title: 'Create',
            icon: '✨',
            items: [
              { href: '/create/story', label: 'New Story', icon: '📝' },
              { href: '/create/character', label: 'Create Character', icon: '👤' },
              { href: '/templates', label: 'Story Templates', icon: '📋' },
            ]
          },
          {
            title: 'Friends',
            icon: '👥',
            items: [
              { href: '/friends', label: 'My Friends', icon: '👫' },
              { href: '/invites', label: 'Invitations', icon: '📨' },
            ]
          },
          {
            title: 'Safety',
            icon: '🛡️',
            items: [
              { href: '/safety/report', label: 'Report Problem', icon: '🚨' },
              { href: '/safety/help', label: 'Get Help', icon: '🆘' },
              { href: '/safety/rules', label: 'Safety Rules', icon: '📜' },
            ]
          },
        ];
      case 'teens':
        return [
          {
            title: 'Library',
            icon: '📚',
            items: [
              { href: '/my-stories', label: 'My Stories', icon: '📖' },
              { href: '/collaborations', label: 'Collaborations', icon: '🤝' },
              { href: '/drafts', label: 'Drafts', icon: '📝' },
              { href: '/published', label: 'Published', icon: '🌟' },
            ]
          },
          {
            title: 'Create',
            icon: '✍️',
            items: [
              { href: '/create/story', label: 'New Story', icon: '📝' },
              { href: '/create/series', label: 'Story Series', icon: '📚' },
              { href: '/create/world', label: 'World Building', icon: '🌍' },
            ]
          },
          {
            title: 'Community',
            icon: '👥',
            items: [
              { href: '/community/feed', label: 'Community Feed', icon: '📰' },
              { href: '/community/groups', label: 'Writing Groups', icon: '👥' },
              { href: '/community/challenges', label: 'Challenges', icon: '🏆' },
            ]
          },
          {
            title: 'Tools',
            icon: '🛠️',
            items: [
              { href: '/tools/editor', label: 'Advanced Editor', icon: '✏️' },
              { href: '/tools/analytics', label: 'Story Analytics', icon: '📊' },
              { href: '/tools/export', label: 'Export Stories', icon: '📤' },
            ]
          },
        ];
      case 'adults':
        return [
          {
            title: 'Content',
            icon: '📚',
            items: [
              { href: '/library', label: 'Library', icon: '📖' },
              { href: '/projects', label: 'Projects', icon: '📁' },
              { href: '/collaborations', label: 'Collaborations', icon: '🤝' },
              { href: '/published', label: 'Published Works', icon: '🌟' },
            ]
          },
          {
            title: 'Creation',
            icon: '✍️',
            items: [
              { href: '/create/story', label: 'New Story', icon: '📝' },
              { href: '/create/series', label: 'Story Series', icon: '📚' },
              { href: '/create/universe', label: 'Universe Builder', icon: '🌌' },
              { href: '/create/template', label: 'Custom Templates', icon: '📋' },
            ]
          },
          {
            title: 'Professional',
            icon: '💼',
            items: [
              { href: '/analytics', label: 'Analytics Dashboard', icon: '📊' },
              { href: '/monetization', label: 'Monetization', icon: '💰' },
              { href: '/publishing', label: 'Publishing Tools', icon: '📤' },
              { href: '/api', label: 'API Access', icon: '🔌' },
            ]
          },
          {
            title: 'Community',
            icon: '👥',
            items: [
              { href: '/network', label: 'Professional Network', icon: '🌐' },
              { href: '/mentorship', label: 'Mentorship', icon: '🎓' },
              { href: '/workshops', label: 'Workshops', icon: '🎪' },
            ]
          },
        ];
      default:
        return baseSections;
    }
  };

  const sections = getAgeAppropriateSections();

  const toggleSection = (sectionTitle: string) => {
    setActiveSection(activeSection === sectionTitle ? '' : sectionTitle);
  };

  const getSidebarStyles = () => {
    switch (ageTier) {
      case 'kids':
        return {
          background: 'bg-gradient-to-b from-yellow-50 to-pink-50',
          sectionHeader: 'text-purple-700 font-bold',
          itemHover: 'hover:bg-yellow-100 hover:text-purple-800',
          activeItem: 'bg-yellow-200 text-purple-800 font-medium',
          border: 'border-r border-yellow-200',
        };
      case 'teens':
        return {
          background: 'bg-gradient-to-b from-blue-50 to-purple-50',
          sectionHeader: 'text-blue-700 font-semibold',
          itemHover: 'hover:bg-blue-100 hover:text-blue-800',
          activeItem: 'bg-blue-200 text-blue-800 font-medium',
          border: 'border-r border-blue-200',
        };
      case 'adults':
        return {
          background: 'bg-white',
          sectionHeader: 'text-gray-700 font-semibold',
          itemHover: 'hover:bg-gray-100 hover:text-gray-900',
          activeItem: 'bg-gray-200 text-gray-900 font-medium',
          border: 'border-r border-gray-200',
        };
      default:
        return {
          background: 'bg-white',
          sectionHeader: 'text-gray-700 font-semibold',
          itemHover: 'hover:bg-gray-100 hover:text-gray-900',
          activeItem: 'bg-gray-200 text-gray-900 font-medium',
          border: 'border-r border-gray-200',
        };
    }
  };

  const styles = getSidebarStyles();

  if (!user) {
    return null;
  }

  return (
    <aside className={`${styles.background} ${styles.border} h-full overflow-y-auto ${className}`}>
      <div className="p-4">
        {/* User Info */}
        <div className="mb-6 p-3 bg-white bg-opacity-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.firstName?.[0] || user.username?.[0] || '?'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user.firstName || user.username}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {ageTier} Account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-2">
          {sections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center justify-between p-2 text-left ${styles.sectionHeader} ${styles.itemHover} rounded-md transition-colors`}
              >
                <div className="flex items-center space-x-2">
                  <span>{section.icon}</span>
                  <span className="text-sm">{section.title}</span>
                </div>
                <span className={`text-xs transition-transform ${
                  activeSection === section.title ? 'rotate-90' : ''
                }`}>
                  ▶
                </span>
              </button>
              
              {/* Section Items */}
              {activeSection === section.title && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 p-2 text-sm text-gray-600 ${styles.itemHover} rounded-md transition-colors`}
                    >
                      <span className="text-xs">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className={`text-xs font-semibold ${styles.sectionHeader} mb-2`}>
            Quick Actions
          </h3>
          <div className="space-y-1">
            <Link
              href="/create"
              className={`flex items-center space-x-2 p-2 text-sm text-gray-600 ${styles.itemHover} rounded-md transition-colors`}
            >
              <span>➕</span>
              <span>Create New</span>
            </Link>
            <Link
              href="/search"
              className={`flex items-center space-x-2 p-2 text-sm text-gray-600 ${styles.itemHover} rounded-md transition-colors`}
            >
              <span>🔍</span>
              <span>Search</span>
            </Link>
            {ageTier === 'kids' && (
              <Link
                href="/help"
                className={`flex items-center space-x-2 p-2 text-sm text-gray-600 ${styles.itemHover} rounded-md transition-colors`}
              >
                <span>🆘</span>
                <span>Get Help</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;