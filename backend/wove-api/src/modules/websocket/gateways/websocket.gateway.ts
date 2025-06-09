import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common'; // Added Logger
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WebSocketService } from '../services/websocket.service';
import {
  SocketMessageType,
  RoomMessage,
  CollaborationMessage,
  ChatMessage,
} from '../interfaces/socket-message.interface';

@WSGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/story',
})
@UseGuards(JwtAuthGuard)
export class StoryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(StoryGateway.name); // Added logger instance

  constructor(private readonly webSocketService: WebSocketService) {}

  afterInit(server: Server) {
    this.webSocketService.initializeServer(server);
  }

  async handleConnection(client: Socket) {
    try {
      await this.webSocketService.handleConnection(client);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.webSocketService.handleDisconnect(client);
  }

  @SubscribeMessage(SocketMessageType.JOIN_ROOM)
  async handleJoinRoom(client: Socket, message: RoomMessage) {
    try {
      await this.webSocketService.joinRoom(client, message);
    } catch (error) {
      throw new WsException('Failed to join room');
    }
  }

  @SubscribeMessage(SocketMessageType.LEAVE_ROOM)
  async handleLeaveRoom(client: Socket, message: RoomMessage) {
    try {
      await this.webSocketService.leaveRoom(client, message);
    } catch (error) {
      throw new WsException('Failed to leave room');
    }
  }

  @SubscribeMessage(SocketMessageType.START_COLLABORATION)
  async handleStartCollaboration(client: Socket, message: CollaborationMessage) {
    try {
      await this.webSocketService.handleCollaboration(message);
    } catch (error) {
      throw new WsException('Failed to start collaboration');
    }
  }

  @SubscribeMessage(SocketMessageType.CONTENT_UPDATE)
  async handleContentUpdate(client: Socket, message: CollaborationMessage) {
    try {
      await this.webSocketService.handleCollaboration(message);
    } catch (error) {
      throw new WsException('Failed to update content');
    }
  }

  @SubscribeMessage(SocketMessageType.TYPING_START)
  async handleTypingStart(client: Socket, message: CollaborationMessage) {
    try {
      await this.webSocketService.handleCollaboration(message);
    } catch (error) {
      throw new WsException('Failed to send typing indicator');
    }
  }

  @SubscribeMessage(SocketMessageType.TYPING_END)
  async handleTypingEnd(client: Socket, message: CollaborationMessage) {
    try {
      await this.webSocketService.handleCollaboration(message);
    } catch (error) {
      throw new WsException('Failed to send typing indicator');
    }
  }

  @SubscribeMessage(SocketMessageType.CHAT_MESSAGE)
  async handleChatMessage(client: Socket, message: ChatMessage) {
    try {
      await this.webSocketService.sendChatMessage(message);
    } catch (error) {
      throw new WsException('Failed to send chat message');
    }
  }

  @SubscribeMessage(SocketMessageType.REQUEST_TURN)
  async handleRequestTurn(client: Socket, message: RoomMessage) {
    // Assuming RoomMessage is sufficient
    try {
      // TODO: Validate user is part of the story room
      // TODO: Potentially call StoryService.requestTurn(client.id, message.roomId)
      const roomKey = this.webSocketService.getRoomKey(message.roomId);
      this.server
        .to(roomKey)
        .emit(SocketMessageType.NOTIFICATION, { message: `User ${client.id} requests the turn.` }); // Placeholder, use actual user display name
      this.logger.log(`User ${client.id} requested turn for room ${message.roomId}`);
    } catch (error) {
      this.logger.error(`Failed to handle request turn: ${error.message}`, error.stack);
      throw new WsException('Failed to request turn');
    }
  }

  @SubscribeMessage(SocketMessageType.GRANT_TURN)
  async handleGrantTurn(client: Socket, message: RoomMessage & { targetUserId: string }) {
    try {
      // TODO: Validate client is current turn holder or story owner
      // TODO: StoryService.grantTurn(message.roomId, message.targetUserId)
      const roomKey = this.webSocketService.getRoomKey(message.roomId);
      this.server
        .to(roomKey)
        .emit(SocketMessageType.GRANT_TURN, {
          userId: message.targetUserId,
          storyId: message.roomId,
        });
      this.logger.log(
        `Turn granted to ${message.targetUserId} in room ${message.roomId} by ${client.id}`,
      );
    } catch (error) {
      this.logger.error(`Failed to handle grant turn: ${error.message}`, error.stack);
      throw new WsException('Failed to grant turn');
    }
  }

  @SubscribeMessage(SocketMessageType.RELEASE_TURN)
  async handleReleaseTurn(client: Socket, message: RoomMessage) {
    try {
      // TODO: Validate client is current turn holder
      // TODO: StoryService.releaseTurn(message.roomId, client.id)
      const roomKey = this.webSocketService.getRoomKey(message.roomId);
      this.server
        .to(roomKey)
        .emit(SocketMessageType.RELEASE_TURN, { userId: client.id, storyId: message.roomId });
      this.logger.log(`User ${client.id} released turn for room ${message.roomId}`);
    } catch (error) {
      throw new WsException('Failed to release turn');
    }
  }
}
