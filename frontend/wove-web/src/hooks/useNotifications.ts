import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
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
  userId: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  storyUpdates: boolean;
  collaborationInvites: boolean;
  parentalAlerts: boolean;
  systemAnnouncements: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  preferences: NotificationPreferences;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const useNotifications = (): UseNotificationsReturn => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    storyUpdates: true,
    collaborationInvites: true,
    parentalAlerts: true,
    systemAnnouncements: true,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.map((notification: any) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, token, API_BASE_URL]);

  // Fetch notification preferences
  const fetchPreferences = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  }, [user, token, API_BASE_URL]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [token, API_BASE_URL]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [token, API_BASE_URL]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [token, API_BASE_URL]);

  // Create new notification
  const createNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => {
    if (!token || !user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notificationData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications(prev => [{
          ...newNotification,
          timestamp: new Date(newNotification.timestamp),
        }, ...prev]);
      }
    } catch (err) {
      console.error('Error creating notification:', err);
    }
  }, [token, user, API_BASE_URL]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        const updatedPreferences = await response.json();
        setPreferences(updatedPreferences);
      }
    } catch (err) {
      console.error('Error updating notification preferences:', err);
    }
  }, [token, API_BASE_URL]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Initial fetch when user logs in
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      fetchPreferences();
    }
  }, [user, token, fetchNotifications, fetchPreferences]);

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user || !token) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, token, fetchNotifications]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    updatePreferences,
    refreshNotifications,
  };
};

export default useNotifications;