'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Footer: React.FC = () => {
  const { ageTier } = useTheme();
  const { user } = useAuth();

  const getAgeAppropriateContent = () => {
    switch (ageTier) {
      case 'kids':
        return {
          links: [
            { href: '/help', label: 'Help', icon: '❓' },
            { href: '/safety', label: 'Stay Safe', icon: '🛡️' },
            { href: '/parents', label: 'For Parents', icon: '👨‍👩‍👧‍👦' },
          ],
          copyright: '© 2024 Wove - A safe place for young storytellers! 🌟',
          bgColor: 'bg-gradient-to-r from-yellow-100 to-pink-100',
          textColor: 'text-gray-700',
        };
      case 'teens':
        return {
          links: [
            { href: '/help', label: 'Help Center', icon: '❓' },
            { href: '/community', label: 'Community', icon: '👥' },
            { href: '/safety', label: 'Safety', icon: '🛡️' },
            { href: '/privacy', label: 'Privacy', icon: '🔒' },
          ],
          copyright: '© 2024 Wove - Express your creativity safely',
          bgColor: 'bg-gradient-to-r from-blue-50 to-purple-50',
          textColor: 'text-gray-700',
        };
      case 'adults':
        return {
          links: [
            { href: '/about', label: 'About', icon: 'ℹ️' },
            { href: '/help', label: 'Help', icon: '❓' },
            { href: '/privacy', label: 'Privacy Policy', icon: '🔒' },
            { href: '/terms', label: 'Terms of Service', icon: '📄' },
            { href: '/contact', label: 'Contact', icon: '📧' },
          ],
          copyright: '© 2024 Wove. All rights reserved.',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        };
      default:
        return {
          links: [
            { href: '/about', label: 'About', icon: 'ℹ️' },
            { href: '/help', label: 'Help', icon: '❓' },
            { href: '/privacy', label: 'Privacy', icon: '🔒' },
            { href: '/terms', label: 'Terms', icon: '📄' },
          ],
          copyright: '© 2024 Wove. All rights reserved.',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
        };
    }
  };

  const content = getAgeAppropriateContent();

  return (
    <footer className={`${content.bgColor} border-t border-gray-200 mt-auto`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📖</span>
              <span className={`text-xl font-bold ${content.textColor}`}>
                Wove
              </span>
            </div>
            <p className={`text-sm ${content.textColor} text-center md:text-left max-w-xs`}>
              {ageTier === 'kids' 
                ? 'Create amazing stories with friends in a safe, fun environment!' 
                : ageTier === 'teens'
                ? 'Collaborative storytelling platform for creative minds'
                : 'Professional collaborative storytelling and content creation platform'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className={`text-sm font-semibold ${content.textColor} mb-4`}>
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              {content.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${content.textColor} hover:text-blue-600 transition-colors flex items-center space-x-1`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Social/Contact Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className={`text-sm font-semibold ${content.textColor} mb-4`}>
              {ageTier === 'kids' ? 'Get Help' : 'Connect'}
            </h3>
            <div className="flex flex-col space-y-2">
              {ageTier === 'kids' ? (
                <>
                  <Link
                    href="/help"
                    className={`text-sm ${content.textColor} hover:text-blue-600 transition-colors flex items-center space-x-1`}
                  >
                    <span>🆘</span>
                    <span>Need Help?</span>
                  </Link>
                  <Link
                    href="/report"
                    className={`text-sm ${content.textColor} hover:text-blue-600 transition-colors flex items-center space-x-1`}
                  >
                    <span>🚨</span>
                    <span>Report Something</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/support"
                    className={`text-sm ${content.textColor} hover:text-blue-600 transition-colors flex items-center space-x-1`}
                  >
                    <span>💬</span>
                    <span>Support</span>
                  </Link>
                  <Link
                    href="/feedback"
                    className={`text-sm ${content.textColor} hover:text-blue-600 transition-colors flex items-center space-x-1`}
                  >
                    <span>💡</span>
                    <span>Feedback</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-xs ${content.textColor}`}>
              {content.copyright}
            </p>
            
            {/* Age-appropriate additional info */}
            <div className="flex items-center space-x-4">
              {ageTier === 'kids' && (
                <div className="flex items-center space-x-1">
                  <span className="text-green-500">🔒</span>
                  <span className={`text-xs ${content.textColor}`}>COPPA Compliant</span>
                </div>
              )}
              {(ageTier === 'kids' || ageTier === 'teens') && (
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500">👨‍👩‍👧‍👦</span>
                  <span className={`text-xs ${content.textColor}`}>Parent Supervised</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <span className="text-purple-500">🛡️</span>
                <span className={`text-xs ${content.textColor}`}>Safe & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;