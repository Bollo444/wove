'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'story' | 'collaboration' | 'parental';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  ageTierRelevant?: string[];
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { ageTier } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'story' | 'collaboration'>('all');

  // Mock notifications for demonstration
  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'story',
            title: 'New Story Update',
            message: 'Your collaborative story "The Magic Forest" has a new chapter!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            actionUrl: '/story/123',
            actionText: 'Read Chapter',
            priority: 'medium',
            ageTierRelevant: ['kids', 'teens'],
          },
          {
            id: '2',
            type: 'collaboration',
            title: 'Collaboration Invite',
            message: 'Sarah invited you to collaborate on "Space Adventure"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false,
            actionUrl: '/collaborate/456',
            actionText: 'Accept Invite',
            priority: 'high',
          },
          {
            id: '3',
            type: 'parental',
            title: 'Parental Approval Required',
            message: 'Your parent needs to approve your new story before publishing',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            read: true,
            priority: 'high',
            ageTierRelevant: ['kids', 'teens'],
          },
          {
            id: '4',
            type: 'success',
            title: 'Story Published!',
            message: 'Your story "The Brave Knight" has been successfully published',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            priority: 'low',
          },
        ];

        // Filter notifications based on age tier relevance
        const filteredNotifications = mockNotifications.filter(
          notification =>
            !notification.ageTierRelevant || notification.ageTierRelevant.includes(ageTier),
        );

        setNotifications(filteredNotifications);
        setLoading(false);
      }, 500);
    }
  }, [user, isOpen, ageTier]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'story':
        return notifications.filter(n => n.type === 'story');
      case 'collaboration':
        return notifications.filter(n => n.type === 'collaboration');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'story':
        return '📖';
      case 'collaboration':
        return '🤝';
      case 'parental':
        return '👨‍👩‍👧‍👦';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-oid="2ba48xi">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        data-oid="0hd42hp"
      />

      {/* Notification Panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-xl"
        data-oid="lk:d6:d"
      >
        <div className="flex h-full flex-col" data-oid="_ahc333">
          {/* Header */}
          <div className="border-b border-default p-4" data-oid="7e93yb1">
            <div className="flex items-center justify-between" data-oid="x55xfk:">
              <h2 className="text-lg font-semibold text-primary" data-oid="ol6e-6y">
                Notifications
                {unreadCount > 0 && (
                  <span
                    className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
                    data-oid="1lgjcdm"
                  >
                    {unreadCount}
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary hover:text-primary transition-colors"
                data-oid="hj6h0tj"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="mt-4 flex space-x-2" data-oid="dlq95na">
              {['all', 'unread', 'story', 'collaboration'].map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === filterType
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                  }`}
                  data-oid="2ezujjt"
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Mark All Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-2 text-sm text-accent hover:text-primary transition-colors"
                data-oid="s75eda6"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto" data-oid="ckci2--">
            {loading ? (
              <div className="flex items-center justify-center h-32" data-oid="br-vl-n">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                  data-oid="fo4jbef"
                ></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-32 text-secondary"
                data-oid="0q0.9y8"
              >
                <div className="text-4xl mb-2" data-oid="w5evzoz">
                  🔔
                </div>
                <p data-oid="gk7_85t">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1" data-oid="3kqmyvv">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                      notification.read ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gray-50 transition-colors`}
                    data-oid="1zepi8b"
                  >
                    <div className="flex items-start justify-between" data-oid="zofe4g5">
                      <div className="flex items-start space-x-3 flex-1" data-oid="p-:tm__">
                        <span className="text-xl" data-oid="o9n-u2t">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0" data-oid="jtsywp0">
                          <div className="flex items-center space-x-2" data-oid="_a2:i7.">
                            <h3
                              className={`text-sm font-medium ${
                                notification.read ? 'text-secondary' : 'text-primary'
                              }`}
                              data-oid=".ljw4gx"
                            >
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full"
                                data-oid="d2-8w0z"
                              ></div>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-secondary" data-oid="jdhr1-8">
                            {notification.message}
                          </p>
                          <div
                            className="mt-2 flex items-center justify-between"
                            data-oid="h780ru."
                          >
                            <span className="text-xs text-gray-400" data-oid="x3-3pvh">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="text-xs text-accent hover:text-primary transition-colors"
                                onClick={() => markAsRead(notification.id)}
                                data-oid="kbna3_8"
                              >
                                {notification.actionText}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2" data-oid="noo6.:-">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-accent hover:text-primary transition-colors"
                            title="Mark as read"
                            data-oid="09yh-33"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                          data-oid="j:pp0d-"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
