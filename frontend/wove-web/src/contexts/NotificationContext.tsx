'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import notificationService from '@/services/notification.service'; // Adjust path as needed
import { Notification } from '@shared/types/notification.types'; // Assuming shared types
// import { useAuth } from './AuthContext'; // Assuming you have an AuthContext that provides the token

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  connectNotifications: (token: string) => void;
  disconnectNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void; // Example additional method
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  // const { token } = useAuth(); // Get token from your AuthContext
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null; // Placeholder for token retrieval

  const updateUnreadCount = useCallback((currentNotifications: Notification[]) => {
    const count = currentNotifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, []);

  const connectNotifications = useCallback(
    (authToken: string) => {
      console.log(
        'NotificationProvider: Attempting to connect with token:',
        authToken ? 'present' : 'absent',
      );
      notificationService.connect(authToken);

      // Example: Fetch initial notifications (optional, could be handled by a main app load)
      // const fetchInitial = async () => {
      //   try {
      //     // const initialNotifs = await notificationService.getInitialNotifications(); // Implement this in service
      //     // setNotifications(initialNotifs);
      //     // updateUnreadCount(initialNotifs);
      //   } catch (error) {
      //     console.error('Failed to fetch initial notifications:', error);
      //   }
      // };
      // fetchInitial();

      notificationService.onNotification((newNotification: Notification) => {
        console.log('NotificationProvider: Received new notification', newNotification);
        setNotifications(prev => {
          const updated = [newNotification, ...prev];
          updateUnreadCount(updated);
          return updated;
        });
      });

      notificationService.onNotificationUpdate(
        (updatedNotificationData: Partial<Notification> & { id: string }) => {
          console.log(
            'NotificationProvider: Received notification update',
            updatedNotificationData,
          );
          setNotifications(prev => {
            const updated = prev.map(n =>
              n.id === updatedNotificationData.id ? { ...n, ...updatedNotificationData } : n,
            );
            updateUnreadCount(updated);
            return updated;
          });
        },
      );
    },
    [updateUnreadCount],
  );

  const disconnectNotifications = useCallback(() => {
    notificationService.disconnect();
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Or get from AuthContext
    if (token && notificationService && !notificationService.isConnected()) {
      console.log('NotificationContext: Attempting to connect WebSocket with token.');
      connectNotifications(token);
    }

    // Cleanup on unmount or when token changes to undefined (logout)
    return () => {
      if (notificationService?.isConnected()) {
        console.log('NotificationContext: Disconnecting WebSocket on cleanup.');
        disconnectNotifications();
      }
    };
  }, [connectNotifications, disconnectNotifications]); // Re-run if connect/disconnect functions change (should be stable)

  const markAsRead = useCallback(
    (notificationId: string) => {
      notificationService.markNotificationAsRead(notificationId);
      // Optimistic update or wait for 'notification_update' event
      setNotifications(prev => {
        const updated = prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n));
        updateUnreadCount(updated);
        return updated;
      });
    },
    [updateUnreadCount],
  );

  const clearAllNotifications = useCallback(() => {
    // This would typically involve a backend call to delete/mark all as read
    // For now, just clearing client-side for example purposes
    setNotifications([]);
    setUnreadCount(0);
    console.log('All notifications cleared (client-side). Implement backend call for persistence.');
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        connectNotifications,
        disconnectNotifications,
        markAsRead,
        clearAllNotifications,
      }}
      data-oid="b6b1428"
    >
      {children}
    </NotificationContext.Provider>
  );
};
