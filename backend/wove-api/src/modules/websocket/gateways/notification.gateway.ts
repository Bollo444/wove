import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { UseGuards, Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WebSocketService } from '../services/websocket.service';
import { NotificationService } from '../../../notifications/notification.service';
import {
  SocketMessageType,
  NotificationMessage,
} from '../interfaces/socket-message.interface';
import { NotificationType } from '../../../notifications/dto/create-notification.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
@UseGuards(JwtAuthGuard)
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(NotificationGateway.name);
  private readonly connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly notificationService: NotificationService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Notification Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (!userId) {
        this.logger.warn(`Connection rejected: No user ID found`);
        client.disconnect();
        return;
      }

      // Store user connection
      this.connectedUsers.set(userId, client.id);
      
      // Join user to their personal notification room
      await client.join(`user:${userId}`);
      
      this.logger.log(`User ${userId} connected to notifications (${client.id})`);
      
      // Send unread notification count on connection
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      client.emit('unread_count', { count: unreadCount });
      
      // Send recent unread notifications
      const recentNotifications = await this.notificationService.findAllForUser(userId, {
        limit: 10,
        unreadOnly: true,
      });
      
      client.emit('recent_notifications', recentNotifications);
      
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected from notifications`);
    }
  }

  /**
   * Handle client requesting notification preferences
   */
  @SubscribeMessage('get_preferences')
  async handleGetPreferences(@ConnectedSocket() client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    try {
      const preferences = await this.notificationService.getNotificationPreferences(userId);
      client.emit('notification_preferences', preferences);
    } catch (error) {
      this.logger.error(`Error getting preferences for user ${userId}: ${error.message}`);
      client.emit('error', { message: 'Failed to get notification preferences' });
    }
  }

  /**
   * Handle client updating notification preferences
   */
  @SubscribeMessage('update_preferences')
  async handleUpdatePreferences(
    @ConnectedSocket() client: Socket,
    @MessageBody() preferences: any,
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    try {
      const updated = await this.notificationService.updateNotificationPreferences(
        userId,
        preferences,
      );
      client.emit('preferences_updated', updated);
    } catch (error) {
      this.logger.error(`Error updating preferences for user ${userId}: ${error.message}`);
      client.emit('error', { message: 'Failed to update notification preferences' });
    }
  }

  /**
   * Handle client marking notification as read
   */
  @SubscribeMessage('mark_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    try {
      await this.notificationService.markAsRead(data.notificationId, userId);
      
      // Send updated unread count
      const unreadCount = await this.notificationService.getUnreadCount(userId);
      client.emit('unread_count', { count: unreadCount });
      
      client.emit('notification_read', { notificationId: data.notificationId });
    } catch (error) {
      this.logger.error(`Error marking notification as read: ${error.message}`);
      client.emit('error', { message: 'Failed to mark notification as read' });
    }
  }

  /**
   * Handle client marking all notifications as read
   */
  @SubscribeMessage('mark_all_read')
  async handleMarkAllAsRead(@ConnectedSocket() client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    try {
      await this.notificationService.markAllAsRead(userId);
      
      client.emit('unread_count', { count: 0 });
      client.emit('all_notifications_read');
    } catch (error) {
      this.logger.error(`Error marking all notifications as read: ${error.message}`);
      client.emit('error', { message: 'Failed to mark all notifications as read' });
    }
  }

  /**
   * Handle client requesting notification history
   */
  @SubscribeMessage('get_notifications')
  async handleGetNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { limit?: number; offset?: number; type?: string },
  ) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) return;

    try {
      const notifications = await this.notificationService.findAllForUser(userId, {
        limit: data.limit || 20,
        offset: data.offset || 0,
        type: data.type,
      });
      
      client.emit('notifications_history', notifications);
    } catch (error) {
      this.logger.error(`Error getting notifications: ${error.message}`);
      client.emit('error', { message: 'Failed to get notifications' });
    }
  }

  /**
   * Send real-time notification to a specific user
   */
  async sendNotificationToUser(userId: string, notification: any) {
    try {
      const socketId = this.connectedUsers.get(userId);
      
      if (socketId) {
        // User is connected, send real-time notification
        this.server.to(`user:${userId}`).emit('new_notification', {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          content: notification.content,
          priority: notification.priority,
          actionUrl: notification.actionUrl,
          data: notification.data,
          createdAt: notification.createdAt,
          requiresAction: notification.requiresAction,
        });
        
        // Send updated unread count
        const unreadCount = await this.notificationService.getUnreadCount(userId);
        this.server.to(`user:${userId}`).emit('unread_count', { count: unreadCount });
        
        this.logger.log(`Real-time notification sent to user ${userId}`);
        return true;
      } else {
        this.logger.log(`User ${userId} not connected, notification stored for later delivery`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending notification to user ${userId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Send notification update to a specific user (e.g., read status changes)
   */
  async sendNotificationUpdate(userId: string, update: any) {
    const userRoom = `user_${userId}`;
    this.server.to(userRoom).emit('notification_update', {
      ...update,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification to multiple users
   */
  async sendNotificationToUsers(userIds: string[], notification: any) {
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendNotificationToUser(userId, notification))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled' && result.value).length;
    this.logger.log(`Notification sent to ${successful}/${userIds.length} connected users`);
    
    return successful;
  }

  /**
   * Broadcast system notification to all connected users
   */
  async broadcastSystemNotification(notification: any) {
    try {
      this.server.emit('system_notification', {
        id: notification.id,
        title: notification.title,
        content: notification.content,
        priority: notification.priority,
        type: notification.type,
        createdAt: notification.createdAt,
      });
      
      this.logger.log('System notification broadcasted to all connected users');
    } catch (error) {
      this.logger.error(`Error broadcasting system notification: ${error.message}`);
    }
  }

  /**
   * Get user ID from socket (assuming JWT auth provides user info)
   */
  private getUserIdFromSocket(client: Socket): string | null {
    // This should extract user ID from the authenticated socket
    // The exact implementation depends on how JWT auth is set up
    return client.handshake?.auth?.userId || client.data?.userId || null;
  }

  /**
   * Get connected user count
   */
  getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}