/**
 * Types of WebSocket messages supported by the system
 */
export enum SocketMessageType {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',

  // Story collaboration events
  START_COLLABORATION = 'start_collaboration',
  END_COLLABORATION = 'end_collaboration',
  REQUEST_TURN = 'request_turn',
  GRANT_TURN = 'grant_turn',
  RELEASE_TURN = 'release_turn',
  TYPING_START = 'typing_start',
  TYPING_END = 'typing_end',
  CONTENT_UPDATE = 'content_update',
  CONTENT_SYNC = 'content_sync',

  // Chat messages
  CHAT_MESSAGE = 'chat_message',
  CHAT_TYPING = 'chat_typing',

  // Notifications
  NOTIFICATION = 'notification',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
}

/**
 * Base interface for all WebSocket messages
 */
export interface SocketMessage {
  type: SocketMessageType;
  roomId?: string;
  userId: string;
  timestamp: number;
}

/**
 * Interface for room-related messages
 */
export interface RoomMessage extends SocketMessage {
  roomId: string;
}

/**
 * Interface for collaboration messages
 */
export interface CollaborationMessage extends RoomMessage {
  storyId: string;
  segmentId?: string;
  content?: string;
  position?: number;
}

/**
 * Interface for chat messages
 */
export interface ChatMessage extends RoomMessage {
  content: string;
  username: string;
  avatarUrl?: string;
}

/**
 * Interface for typing indicator messages
 */
export interface TypingMessage extends RoomMessage {
  username: string;
  isTyping: boolean;
}

/**
 * Interface for notification messages
 */
export interface NotificationMessage extends SocketMessage {
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

/**
 * Interface for user presence messages
 */
export interface UserPresenceMessage extends RoomMessage {
  username: string;
  avatarUrl?: string;
  action: 'joined' | 'left';
}
