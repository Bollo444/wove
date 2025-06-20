'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useStory } from '../../contexts/StoryContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { stories, loadUserStories } = useStory();
  const { ageTier } = useTheme();
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      loadRecentStories();
    }
  }, [user, isOpen]);

  const loadRecentStories = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await loadUserStories(user.id);
      // Get the 5 most recent stories
      const recent = stories
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime(),
        )
        .slice(0, 5);
      setRecentStories(recent);
    } catch (error) {
      console.error('Failed to load recent stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Explore Stories',
        href: '/explore',
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="dyp:x55"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              data-oid=":ht35_8"
            />
          </svg>
        ),

        description: 'Discover amazing stories',
      },
      {
        name: 'Create Story',
        href: '/create',
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="amzq3w2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
              data-oid="gzrsvpa"
            />
          </svg>
        ),

        description: 'Start a new adventure',
      },
    ];

    if (user) {
      baseItems.push(
        {
          name: 'My Stories',
          href: '/my-stories',
          icon: (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="odr2vit"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                data-oid="tv2n_3m"
              />
            </svg>
          ),

          description: 'Your created stories',
        },
        {
          name: 'Favorites',
          href: '/favorites',
          icon: (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="a4eoiyu"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                data-oid="54gqzjx"
              />
            </svg>
          ),

          description: 'Stories you love',
        },
        {
          name: 'Reading List',
          href: '/reading-list',
          icon: (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="plett2f"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                data-oid="qham:hf"
              />
            </svg>
          ),

          description: 'Stories to read later',
        },
      );
    }

    // Add age-appropriate items
    if (ageTier === 'kids') {
      baseItems.push({
        name: 'Safety Center',
        href: '/safety',
        icon: (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="t0n:7fl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              data-oid="n03sz3r"
            />
          </svg>
        ),

        description: 'Stay safe online',
      });
    }

    return baseItems;
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const storyDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        data-oid="vt5xsll"
      />

      {/* Sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
        data-oid="hhi6_9p"
      >
        <div className="flex flex-col h-full" data-oid="452u0js">
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b border-gray-200"
            data-oid="efezy6a"
          >
            <div className="flex items-center space-x-3" data-oid="y2emdk2">
              <div
                className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center"
                data-oid="6:9zp88"
              >
                <span className="text-white font-bold text-lg" data-oid="-k6e46n">
                  W
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900" data-oid="i-agy-9">
                Wove
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-oid="-4rphzl"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="ea-0eta"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  data-oid="-7oc-n."
                />
              </svg>
            </button>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-6 border-b border-gray-200" data-oid="97l2utq">
              <div className="flex items-center space-x-3 mb-4" data-oid="_7bomlv">
                <div
                  className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  data-oid="q3lpw0h"
                >
                  <span className="text-white font-semibold text-lg" data-oid="rpe_v38">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0" data-oid="lbbsm2m">
                  <p className="text-sm font-medium text-gray-900 truncate" data-oid="z-:xtji">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate" data-oid="5gaejql">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-3 gap-4 text-center" data-oid="bgsebxm">
                <div data-oid=".1tgeuh">
                  <p className="text-lg font-semibold text-gray-900" data-oid="f628sqi">
                    {stories.length}
                  </p>
                  <p className="text-xs text-gray-500" data-oid="rsh6:12">
                    Stories
                  </p>
                </div>
                <div data-oid="xxisxm2">
                  <p className="text-lg font-semibold text-gray-900" data-oid="y5rn5ng">
                    0
                  </p>
                  <p className="text-xs text-gray-500" data-oid="e_s-5s0">
                    Followers
                  </p>
                </div>
                <div data-oid="y-hoimv">
                  <p className="text-lg font-semibold text-gray-900" data-oid="apse18c">
                    0
                  </p>
                  <p className="text-xs text-gray-500" data-oid="lysovhs">
                    Following
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto" data-oid="zacag8s">
            <div className="space-y-1" data-oid="drpz5pa">
              {getNavigationItems().map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-200"
                  data-oid="f:k_cwz"
                >
                  <span
                    className="text-gray-400 group-hover:text-purple-600 mr-3"
                    data-oid="a4riax_"
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1" data-oid="b0xugwo">
                    <div className="font-medium" data-oid="x_pf522">
                      {item.name}
                    </div>
                    <div
                      className="text-xs text-gray-500 group-hover:text-purple-600"
                      data-oid="q:onxdo"
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Stories Section */}
            {user && recentStories.length > 0 && (
              <div className="mt-8" data-oid="l34uawh">
                <h3
                  className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
                  data-oid="7pwd2ad"
                >
                  Recent Stories
                </h3>
                <div className="space-y-2" data-oid="8bg4297">
                  {recentStories.map(story => (
                    <Link
                      key={story.id}
                      href={`/story/${story.id}`}
                      onClick={onClose}
                      className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      data-oid=".52qgt8"
                    >
                      <div className="flex items-start space-x-3" data-oid="43rwy6d">
                        <div
                          className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center"
                          data-oid="3vdgb4d"
                        >
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="ieapgj7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              data-oid="8d0d-g2"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0" data-oid="_mnayj:">
                          <p
                            className="text-sm font-medium text-gray-900 truncate"
                            data-oid="y3k8-8q"
                          >
                            {story.title}
                          </p>
                          <p className="text-xs text-gray-500" data-oid="_dwdx-2">
                            {formatTimeAgo(story.updatedAt || story.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8" data-oid="aht831p">
              <h3
                className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
                data-oid="kh-820j"
              >
                Quick Actions
              </h3>
              <div className="space-y-2" data-oid="iv-.fc8">
                <button
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  data-oid="clmwvo_"
                >
                  <svg
                    className="h-4 w-4 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="nkzwrhh"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      data-oid="_xsi-ft"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      data-oid="9jnhid:"
                    />
                  </svg>
                  Settings
                </button>
                <button
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  data-oid="7b3-1pe"
                >
                  <svg
                    className="h-4 w-4 mr-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="83w7714"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      data-oid="rbfe:0l"
                    />
                  </svg>
                  Help & Support
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200" data-oid="3_8snuv">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                data-oid="oh8pgx-"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="k44szxs"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    data-oid="p1nzbpz"
                  />
                </svg>
                Sign Out
              </button>
            ) : (
              <div className="space-y-2" data-oid="b6ziu1n">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  data-oid="lv:x32p"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  data-oid=":dsu2c1"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
