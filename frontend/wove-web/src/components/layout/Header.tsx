'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AgeTier } from 'shared';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsProfileMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getNavigationLinks = () => {
    if (!user) {
      return [
        { href: '/explore', label: 'Explore Stories', icon: 'explore' },
        { href: '/about', label: 'About', icon: 'info' },
      ];
    }

    const baseLinks = [
      { href: '/explore', label: 'Explore', icon: 'explore' },
      { href: '/create', label: 'Create', icon: 'create' },
      { href: '/library', label: 'My Library', icon: 'library' },
    ];

    // Age-specific links
    if (user.ageTier === AgeTier.ADULTS) {
      baseLinks.push(
        { href: '/community', label: 'Community', icon: 'community' },
        { href: '/analytics', label: 'Analytics', icon: 'analytics' },
      );
    } else if (user.ageTier === AgeTier.TEENS_16_PLUS || user.ageTier === AgeTier.TEENS_U16) {
      baseLinks.push({ href: '/community', label: 'Community', icon: 'community' });
    }

    return baseLinks;
  };

  const getIcon = (iconName: string) => {
    const iconClass = 'h-5 w-5';
    switch (iconName) {
      case 'explore':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="--z4mwk"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              data-oid="2p2gmay"
            />
          </svg>
        );

      case 'create':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="i4egg.x"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
              data-oid="dm36j68"
            />
          </svg>
        );

      case 'library':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="9ayu5-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              data-oid="nxn3_fk"
            />
          </svg>
        );

      case 'community':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid=":z0677p"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              data-oid="f4q7_nd"
            />
          </svg>
        );

      case 'analytics':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="vjd1mhl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              data-oid="fqczb2j"
            />
          </svg>
        );

      case 'info':
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="h8i.0_g"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              data-oid="eqh.fiv"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200" data-oid="vgnbvob">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="ct5fvg1">
          <div className="flex justify-between items-center h-16" data-oid="pn0vv2.">
            <div className="flex items-center" data-oid="iym9rh6">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" data-oid="362b7ub"></div>
            </div>
            <div className="flex items-center space-x-4" data-oid="qur2:rl">
              <div
                className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"
                data-oid=":f9qf:h"
              ></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
      } border-b border-gray-200`}
      data-oid="v5by801"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="s0r2k2x">
        <div className="flex justify-between items-center h-16" data-oid="hagirc.">
          {/* Logo */}
          <div className="flex items-center" data-oid="my_muyx">
            <Link href="/" className="flex items-center space-x-2 group" data-oid="zq23iqa">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg group-hover:scale-105 transition-transform"
                data-oid="v0j_zcy"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="h.fo3nq"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    data-oid="vatapa-"
                  />
                </svg>
              </div>
              <span
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                data-oid="_neuz:j"
              >
                Wove
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" data-oid="xwno90k">
            {getNavigationLinks().map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group"
                data-oid="zv-7lyp"
              >
                <span className="group-hover:scale-110 transition-transform" data-oid="-ci8qoc">
                  {getIcon(link.icon)}
                </span>
                <span className="font-medium" data-oid="jt1.tpo">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4" data-oid=":z:w_my">
            <ThemeToggle data-oid="g26l7yt" />
            {user ? (
              <>
                {/* Search Button */}
                <button
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  data-oid="xsn_ch-"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="nn4a8-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      data-oid="1.ncvzd"
                    />
                  </svg>
                </button>

                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  data-oid="rq65g9y"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="ebhiies"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      data-oid="8v893u9"
                    />
                  </svg>
                  {notifications > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
                      data-oid="6dbs5xc"
                    >
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </button>

                {/* Profile Menu */}
                <div className="relative" onClick={e => e.stopPropagation()} data-oid="qhnz0up">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    data-oid="h7k4bg-"
                  >
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-8 w-8 rounded-full object-cover border-2 border-purple-200"
                        data-oid="oqh:dr5"
                      />
                    ) : (
                      <div
                        className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm"
                        data-oid="9shuupc"
                      >
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </div>
                    )}
                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="98bshh1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                        data-oid="jikbyzz"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                      data-oid="chczhue"
                    >
                      <div className="px-4 py-3 border-b border-gray-100" data-oid="8cu4:mg">
                        <p className="text-sm font-medium text-gray-900" data-oid="b_3.xut">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500" data-oid="0i..nf8">
                          {user.email}
                        </p>
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1"
                          data-oid="cxjxd83"
                        >
                          {user.ageTier === AgeTier.KIDS && 'Kids (6-12)'}
                          {user.ageTier === AgeTier.TEENS_U16 && 'Teens (13-15)'}
                          {user.ageTier === AgeTier.TEENS_16_PLUS && 'Teens (16-17)'}
                          {user.ageTier === AgeTier.ADULTS && 'Adults (18+)'}
                        </span>
                      </div>

                      <div className="py-1" data-oid="eh2xadj">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                          data-oid="yaru8ie"
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="vgg.dwj"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              data-oid=".ey-.y-"
                            />
                          </svg>
                          Profile
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                          data-oid="dr1ka_y"
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="vtm7rho"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              data-oid="u969wjn"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              data-oid="vl6f4yf"
                            />
                          </svg>
                          Settings
                        </Link>

                        <Link
                          href="/help"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                          data-oid=".f.vxhv"
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="v5hu824"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              data-oid="ruqx-ud"
                            />
                          </svg>
                          Help & Support
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-1" data-oid="a0dgesp">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          data-oid="gslbh6f"
                        >
                          <svg
                            className="h-4 w-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="2j2njvw"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              data-oid="m1mfmty"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3" data-oid="2msozo3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  data-oid="vxphhpw"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  data-oid="u:i:-.z"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="md:hidden p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              data-oid="vpsd_rj"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="0t47f9_"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                    data-oid="nfji8:r"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                    data-oid="0byqwuq"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" data-oid="uxll_tz">
            <nav className="flex flex-col space-y-2" data-oid="_xl-iva">
              {getNavigationLinks().map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                  data-oid="q7_.g94"
                >
                  {getIcon(link.icon)}
                  <span className="font-medium" data-oid="sizil-h">
                    {link.label}
                  </span>
                </Link>
              ))}

              {!user && (
                <div className="pt-4 border-t border-gray-200 space-y-2" data-oid="iv::u32">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    data-oid="y-a3eft"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                    data-oid="zb_v231"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
