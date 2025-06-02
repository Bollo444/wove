import { io, Socket } from 'socket.io-client';
import { Notification } from '@shared/types/notification.types'; // Assuming shared types

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Adjust if your API is elsewhere

class NotificationService {
  private socket: Socket | null = null;
  private token: string | null = null;

  constructor() {}

  public connect(authToken: string): void {
    if (this.socket && this.socket.connected) {
      console.log('Socket already connected');
      return;
    }

    this.token = authToken;
    console.log('Attempting to connect to WebSocket with token:', authToken ? 'present' : 'absent');

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'], // Explicitly use WebSocket transport
      auth: {
        token: authToken,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.socket.on('connect', () => {
      console.log('Successfully connected to WebSocket server:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected from WebSocket server:', reason);
      if (reason === 'io server disconnect') {
        // The server intentionally disconnected the socket, e.g., due to auth failure
        this.socket?.connect(); // Optionally attempt to reconnect if appropriate
      }
      // else the socket will automatically try to reconnect
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error.message);
      // Potentially handle specific errors, e.g., auth errors, differently
    });

    // Generic error handler for other socket errors
    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  public onNotification(callback: (notification: Notification) => void): void {
    this.socket?.on('notification', callback);
  }

  public offNotification(callback?: (notification: Notification) => void): void {
    this.socket?.off('notification', callback);
  }

  public onNotificationUpdate(callback: (notification: Partial<Notification> & { id: string }) => void): void {
    this.socket?.on('notification_update', callback);
  }

  public offNotificationUpdate(callback?: (notification: Partial<Notification> & { id: string }) => void): void {
    this.socket?.off('notification_update', callback);
  }

  // Example: Method to tell the backend a notification was seen/read
  public markNotificationAsRead(notificationId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected. Cannot mark notification as read.');
      return;
    }
    this.socket.emit('mark_notification_read', { notificationId });
    console.log(`Emitted mark_notification_read for ${notificationId}`);
  }

  // Potentially add methods to fetch initial notifications via HTTP if needed
  // public async getInitialNotifications(): Promise<Notification[]> { ... }
}

const notificationService = new NotificationService();
export default notificationService;