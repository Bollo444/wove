import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from '../../../notifications/notification.service';
import { WebSocketService } from '../services/websocket.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let notificationService: jest.Mocked<NotificationService>;
  let webSocketService: jest.Mocked<WebSocketService>;
  let jwtService: jest.Mocked<JwtService>;
  let mockSocket: jest.Mocked<Socket>;
  let mockServer: any;

  beforeEach(async () => {
    const mockNotificationService = {
      findAll: jest.fn(),
      getUnreadCount: jest.fn(),
      getMyPreferences: jest.fn(),
      updateMyPreferences: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const mockWebSocketService = {
      handleConnection: jest.fn(),
      handleDisconnection: jest.fn(),
    };

    const mockJwtService = {
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationGateway,
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: WebSocketService,
          useValue: mockWebSocketService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);
    notificationService = module.get(NotificationService);
    webSocketService = module.get(WebSocketService);
    jwtService = module.get(JwtService);

    // Mock socket
    mockSocket = {
      id: 'socket-123',
      handshake: {
        auth: {
          token: 'valid-jwt-token',
        },
      },
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    // Mock server
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should handle successful connection with valid token', async () => {
      const mockUser = { id: 'user-123', username: 'testuser' };
      jwtService.verify.mockReturnValue(mockUser);
      notificationService.getUnreadCount.mockResolvedValue(5);
      notificationService.findAll.mockResolvedValue([
        { id: 'notif-1', title: 'Test Notification', isRead: false },
      ]);

      await gateway.handleConnection(mockSocket);

      expect(jwtService.verify).toHaveBeenCalledWith('valid-jwt-token');
      expect(mockSocket.join).toHaveBeenCalledWith('user_user-123');
      expect(webSocketService.handleConnection).toHaveBeenCalledWith(mockSocket, mockUser);
      expect(notificationService.getUnreadCount).toHaveBeenCalledWith('user-123');
      expect(mockSocket.emit).toHaveBeenCalledWith('unread_count', { count: 5 });
    });

    it('should disconnect socket with invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(webSocketService.handleConnection).not.toHaveBeenCalled();
    });

    it('should handle missing token', async () => {
      mockSocket.handshake.auth.token = undefined;

      await gateway.handleConnection(mockSocket);

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(jwtService.verify).not.toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should handle disconnection properly', async () => {
      const userId = 'user-123';
      gateway['connectedUsers'].set(mockSocket.id, userId);

      await gateway.handleDisconnect(mockSocket);

      expect(webSocketService.handleDisconnection).toHaveBeenCalledWith(mockSocket);
      expect(gateway['connectedUsers'].has(mockSocket.id)).toBe(false);
    });
  });

  describe('handleGetNotifications', () => {
    it('should return user notifications', async () => {
      const userId = 'user-123';
      const mockNotifications = [
        { id: 'notif-1', title: 'Test 1' },
        { id: 'notif-2', title: 'Test 2' },
      ];
      
      gateway['connectedUsers'].set(mockSocket.id, userId);
      notificationService.findAll.mockResolvedValue(mockNotifications);

      const result = await gateway.handleGetNotifications(mockSocket, { page: 1, limit: 10 });

      expect(notificationService.findAll).toHaveBeenCalledWith(userId, { page: 1, limit: 10 });
      expect(result).toEqual({ notifications: mockNotifications });
    });

    it('should throw WsException for unauthenticated user', async () => {
      await expect(
        gateway.handleGetNotifications(mockSocket, { page: 1, limit: 10 })
      ).rejects.toThrow(WsException);
    });
  });

  describe('handleMarkAsRead', () => {
    it('should mark notification as read', async () => {
      const userId = 'user-123';
      const notificationId = 'notif-123';
      const updatedNotification = { id: notificationId, isRead: true };
      
      gateway['connectedUsers'].set(mockSocket.id, userId);
      notificationService.markAsRead.mockResolvedValue(updatedNotification);

      const result = await gateway.handleMarkAsRead(mockSocket, { notificationId });

      expect(notificationService.markAsRead).toHaveBeenCalledWith(notificationId, userId);
      expect(result).toEqual({ success: true, notification: updatedNotification });
    });
  });

  describe('handleMarkAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const userId = 'user-123';
      
      gateway['connectedUsers'].set(mockSocket.id, userId);
      notificationService.markAllAsRead.mockResolvedValue(undefined);

      const result = await gateway.handleMarkAllAsRead(mockSocket);

      expect(notificationService.markAllAsRead).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendNotificationToUser', () => {
    it('should send notification to specific user', async () => {
      const userId = 'user-123';
      const notification = { id: 'notif-1', title: 'Test Notification' };

      await gateway.sendNotificationToUser(userId, notification);

      expect(mockServer.to).toHaveBeenCalledWith('user_user-123');
      expect(mockServer.emit).toHaveBeenCalledWith('notification', {
        type: 'new_notification',
        data: notification,
        timestamp: expect.any(String),
      });
    });
  });

  describe('sendNotificationUpdate', () => {
    it('should send notification update to specific user', async () => {
      const userId = 'user-123';
      const update = { type: 'notification_read', notificationId: 'notif-1' };

      await gateway.sendNotificationUpdate(userId, update);

      expect(mockServer.to).toHaveBeenCalledWith('user_user-123');
      expect(mockServer.emit).toHaveBeenCalledWith('notification_update', {
        type: 'notification_read',
        notificationId: 'notif-1',
        timestamp: expect.any(String),
      });
    });
  });

  describe('sendNotificationToUsers', () => {
    it('should send notification to multiple users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const notification = { id: 'notif-1', title: 'Broadcast Notification' };

      await gateway.sendNotificationToUsers(userIds, notification);

      expect(mockServer.to).toHaveBeenCalledTimes(3);
      expect(mockServer.to).toHaveBeenCalledWith('user_user-1');
      expect(mockServer.to).toHaveBeenCalledWith('user_user-2');
      expect(mockServer.to).toHaveBeenCalledWith('user_user-3');
      expect(mockServer.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('broadcastSystemNotification', () => {
    it('should broadcast system notification to all connected users', async () => {
      const notification = { id: 'system-1', title: 'System Maintenance' };

      await gateway.broadcastSystemNotification(notification);

      expect(mockServer.emit).toHaveBeenCalledWith('system_notification', {
        type: 'system_announcement',
        data: notification,
        timestamp: expect.any(String),
      });
    });
  });

  describe('utility methods', () => {
    it('should get connected users count', () => {
      gateway['connectedUsers'].set('socket-1', 'user-1');
      gateway['connectedUsers'].set('socket-2', 'user-2');

      const count = gateway.getConnectedUsersCount();
      expect(count).toBe(2);
    });

    it('should check if user is connected', () => {
      gateway['connectedUsers'].set('socket-1', 'user-123');

      const isConnected = gateway.isUserConnected('user-123');
      expect(isConnected).toBe(true);

      const isNotConnected = gateway.isUserConnected('user-456');
      expect(isNotConnected).toBe(false);
    });

    it('should extract user ID from socket', () => {
      gateway['connectedUsers'].set(mockSocket.id, 'user-123');

      const userId = gateway['extractUserId'](mockSocket);
      expect(userId).toBe('user-123');
    });

    it('should return null for unauthenticated socket', () => {
      const userId = gateway['extractUserId'](mockSocket);
      expect(userId).toBeNull();
    });
  });
});