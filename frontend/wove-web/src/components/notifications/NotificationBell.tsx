'use client';

import React, { useState } from 'react';
import useNotifications from '../../hooks/useNotifications';
import NotificationCenter from './NotificationCenter';
import { useTheme } from '../../contexts/ThemeContext';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const { unreadCount, loading } = useNotifications();
  const { ageTier } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Age-appropriate bell icons
  const getBellIcon = () => {
    switch (ageTier) {
      case 'kids':
        return '🔔'; // Fun bell emoji for kids
      case 'teens':
        return '🔔'; // Standard bell for teens
      case 'adults':
        return '🔔'; // Professional bell for adults
      default:
        return '🔔';
    }
  };

  // Age-appropriate styling
  const getAgeAppropriateStyles = () => {
    switch (ageTier) {
      case 'kids':
        return {
          button: 'hover:bg-yellow-100 focus:ring-yellow-300',
          badge: 'bg-red-500 text-white',
          animation: 'hover:animate-bounce',
        };
      case 'teens':
        return {
          button: 'hover:bg-blue-100 focus:ring-blue-300',
          badge: 'bg-purple-500 text-white',
          animation: 'hover:scale-110 transition-transform',
        };
      case 'adults':
        return {
          button: 'hover:bg-gray-100 focus:ring-gray-300',
          badge: 'bg-blue-600 text-white',
          animation: 'hover:scale-105 transition-transform',
        };
      default:
        return {
          button: 'hover:bg-gray-100 focus:ring-gray-300',
          badge: 'bg-gray-600 text-white',
          animation: 'hover:scale-105 transition-transform',
        };
    }
  };

  const styles = getAgeAppropriateStyles();

  return (
    <>
      <div className={`relative ${className}`} data-oid="m9kh.vh">
        <button
          onClick={handleToggle}
          className={`
            relative p-2 rounded-full transition-all duration-200
            ${styles.button}
            ${styles.animation}
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isOpen ? 'bg-gray-100' : ''}
          `}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          disabled={loading}
          data-oid="271wkc7"
        >
          {/* Bell Icon */}
          <span className="text-xl" data-oid="ihu.qg0">
            {getBellIcon()}
          </span>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center" data-oid="-t8aao2">
              <div
                className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
                data-oid="-h8yp_1"
              ></div>
            </div>
          )}

          {/* Unread Count Badge */}
          {unreadCount > 0 && !loading && (
            <span
              className={`
              absolute -top-1 -right-1 inline-flex items-center justify-center
              px-2 py-1 text-xs font-bold leading-none rounded-full
              ${styles.badge}
              min-w-[1.25rem] h-5
              animate-pulse
            `}
              data-oid="x6w_7fi"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Active Indicator */}
          {isOpen && (
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"
              data-oid="67oykyi"
            ></div>
          )}
        </button>

        {/* Tooltip for accessibility */}
        <div className="sr-only" data-oid="2v0cj6:">
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
            : 'No unread notifications'}
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter isOpen={isOpen} onClose={handleClose} data-oid="4ref_on" />
    </>
  );
};

export default NotificationBell;
