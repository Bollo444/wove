import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { redisOptionsFactory } from '../../../config/redis.config';
import {
  SocketMessage,
  SocketMessageType,
  RoomMessage,
  CollaborationMessage,
  ChatMessage,
  NotificationMessage,
  UserPresenceMessage,
} from '../interfaces/socket-message.interface';

@Injectable()
export class WebSocketService {
  private server: Server;
  private readonly redis: Redis;
  private readonly roomPrefix = 'room:';
  private readonly userPrefix = 'user:';

  constructor(private readonly configService: ConfigService) {
    // Initialize Redis client
    const redisConfig = redisOptionsFactory(this.configService);
    this.redis = new Redis(redisConfig);
  }

  /**
   * Initialize Socket.IO server
   */
  public initializeServer(server: Server) {
    this.server = server;
  }

  /**
   * Handle client connection
   */
  public async handleConnection(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    await this.addUserToSocketMapping(userId, client.id);
    client.emit(SocketMessageType.CONNECT, { userId });
  }

  /**
   * Handle client disconnection
   */
  public async handleDisconnect(client: Socket) {
    const userId = this.getUserIdFromSocket(client);
    if (userId) {
      await this.removeUserFromSocketMapping(userId, client.id);
      await this.leaveAllRooms(client);
    }
  }

  /**
   * Join a room
   */
  public async joinRoom(client: Socket, message: RoomMessage) {
    const { roomId, userId } = message;
    const roomKey = this.getRoomKey(roomId);

    await client.join(roomKey);
    await this.redis.sadd(roomKey, userId);

    const userPresence: UserPresenceMessage = {
      type: SocketMessageType.USER_JOINED,
      roomId,
      userId,
      username: await this.getUsernameFromId(userId),
      timestamp: Date.now(),
      action: 'joined',
    };

    this.server.to(roomKey).emit(SocketMessageType.USER_JOINED, userPresence);
  }

  /**
   * Leave a room
   */
  public async leaveRoom(client: Socket, message: RoomMessage) {
    const { roomId, userId } = message;
    const roomKey = this.getRoomKey(roomId);

    await client.leave(roomKey);
    await this.redis.srem(roomKey, userId);

    const userPresence: UserPresenceMessage = {
      type: SocketMessageType.USER_LEFT,
      roomId,
      userId,
      username: await this.getUsernameFromId(userId),
      timestamp: Date.now(),
      action: 'left',
    };

    this.server.to(roomKey).emit(SocketMessageType.USER_LEFT, userPresence);
  }

  /**
   * Handle collaboration messages
   */
  public async handleCollaboration(message: CollaborationMessage) {
    const roomKey = this.getRoomKey(message.roomId);
    this.server.to(roomKey).emit(message.type, message);
  }

  /**
   * Send chat message to room
   */
  public async sendChatMessage(message: ChatMessage) {
    const roomKey = this.getRoomKey(message.roomId);
    this.server.to(roomKey).emit(SocketMessageType.CHAT_MESSAGE, message);
  }

  /**
   * Send notification to specific users
   */
  public async sendNotification(userIds: string[], notification: NotificationMessage) {
    const socketIds = await this.getSocketIdsForUsers(userIds);
    socketIds.forEach(socketId => {
      this.server.to(socketId).emit(SocketMessageType.NOTIFICATION, notification);
    });
  }

  /**
   * Get active users in a room
   */
  public async getRoomUsers(roomId: string): Promise<string[]> {
    const roomKey = this.getRoomKey(roomId);
    return this.redis.smembers(roomKey);
  }

  private getUserIdFromSocket(client: Socket): string | null {
    return client.handshake.auth.userId || null;
  }

  private async getUsernameFromId(userId: string): Promise<string> {
    // Implement user lookup logic here
    return `User ${userId}`;
  }

  public getRoomKey(roomId: string): string {
    // Made public
    return `${this.roomPrefix}${roomId}`;
  }

  private async addUserToSocketMapping(userId: string, socketId: string) {
    const userKey = `${this.userPrefix}${userId}`;
    await this.redis.sadd(userKey, socketId);
  }

  private async removeUserFromSocketMapping(userId: string, socketId: string) {
    const userKey = `${this.userPrefix}${userId}`;
    await this.redis.srem(userKey, socketId);
  }

  private async getSocketIdsForUsers(userIds: string[]): Promise<string[]> {
    const socketIds: string[] = [];
    for (const userId of userIds) {
      const userKey = `${this.userPrefix}${userId}`;
      const ids = await this.redis.smembers(userKey);
      socketIds.push(...ids);
    }
    return socketIds;
  }

  private async leaveAllRooms(client: Socket) {
    const rooms = client.rooms;
    for (const room of rooms) {
      if (room !== client.id) {
        await client.leave(room);
      }
    }
  }

  /**
   * Broadcasts a message to all clients in a specific room.
   * @param roomId The ID of the room.
   * @param event The event name (message type).
   * @param data The data payload for the event.
   */
  public broadcastToRoom(roomId: string, event: string, data: any): void {
    const roomKey = this.getRoomKey(roomId);
    if (this.server) {
      this.server.to(roomKey).emit(event, data);
    } else {
      // console.error('WebSocket server not initialized in WebSocketService for broadcastToRoom');
      // Or handle this case more gracefully, perhaps queueing if server not ready
    }
  }
}
