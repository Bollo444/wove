'use client';

import { apiService } from './api.service';
import { collaborationService } from './collaboration.service';

interface ChatMessage {
  id: string;
  storyId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isSystemMessage?: boolean;
  messageType?: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
}

interface TypingUser {
  userId: string;
  username: string;
  timestamp: Date;
}

class ChatService {
  private messageHandlers: Function[] = [];
  private typingHandlers: Function[] = [];
  private typingUsers: Map<string, TypingUser> = new Map();
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.setupCollaborationListeners();
  }

  private setupCollaborationListeners(): void {
    collaborationService.on('chat_message', (data: ChatMessage) => {
      this.handleIncomingMessage(data);
    });

    collaborationService.on('typing_indicator', (data: { userId: string; username: string; isTyping: boolean; storyId: string }) => {
      this.handleTypingIndicator(data);
    });
  }

  private handleIncomingMessage(message: ChatMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  private handleTypingIndicator(data: { userId: string; username: string; isTyping: boolean; storyId: string }): void {
    const { userId, username, isTyping } = data;

    if (isTyping) {
      this.typingUsers.set(userId, {
        userId,
        username,
        timestamp: new Date(),
      });
    } else {
      this.typingUsers.delete(userId);
    }

    this.notifyTypingHandlers();
  }

  private notifyTypingHandlers(): void {
    const typingUsersList = Array.from(this.typingUsers.values());
    this.typingHandlers.forEach(handler => {
      try {
        handler(typingUsersList);
      } catch (error) {
        console.error('Error in typing handler:', error);
      }
    });
  }

  async getChatHistory(storyId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/chat?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const messages = await response.json();
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  sendMessage(storyId: string, message: string): void {
    if (!message.trim()) return;

    collaborationService.sendChatMessage(storyId, message.trim());
  }

  sendTypingIndicator(storyId: string, isTyping: boolean): void {
    collaborationService.sendTypingIndicator(storyId, isTyping);
  }

  startTyping(storyId: string): void {
    this.sendTypingIndicator(storyId, true);

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    this.typingTimeout = setTimeout(() => {
      this.stopTyping(storyId);
    }, 3000);
  }

  stopTyping(storyId: string): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    this.sendTypingIndicator(storyId, false);
  }

  onMessage(handler: (message: ChatMessage) => void): () => void {
    this.messageHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onTyping(handler: (typingUsers: TypingUser[]) => void): () => void {
    this.typingHandlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = this.typingHandlers.indexOf(handler);
      if (index > -1) {
        this.typingHandlers.splice(index, 1);
      }
    };
  }

  // File upload for chat
  async uploadChatFile(storyId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('storyId', storyId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      return result.fileUrl;
    } catch (error) {
      console.error('Error uploading chat file:', error);
      throw error;
    }
  }

  // Send file message
  async sendFileMessage(storyId: string, file: File, caption?: string): Promise<void> {
    try {
      const fileUrl = await this.uploadChatFile(storyId, file);
      
      const message = {
        type: 'file',
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        caption: caption || '',
      };

      collaborationService.sendChatMessage(storyId, JSON.stringify(message));
    } catch (error) {
      console.error('Error sending file message:', error);
      throw error;
    }
  }

  // Send image message
  async sendImageMessage(storyId: string, imageFile: File, caption?: string): Promise<void> {
    try {
      const imageUrl = await this.uploadChatFile(storyId, imageFile);
      
      const message = {
        type: 'image',
        imageUrl,
        caption: caption || '',
      };

      collaborationService.sendChatMessage(storyId, JSON.stringify(message));
    } catch (error) {
      console.error('Error sending image message:', error);
      throw error;
    }
  }

  // Delete message (if user has permission)
  async deleteMessage(storyId: string, messageId: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/chat/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Edit message (if user has permission)
  async editMessage(storyId: string, messageId: string, newMessage: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/chat/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Clear typing users when leaving a story
  clearTypingUsers(): void {
    this.typingUsers.clear();
    this.notifyTypingHandlers();
  }

  // Get current typing users
  getTypingUsers(): TypingUser[] {
    return Array.from(this.typingUsers.values());
  }

  // Clean up
  destroy(): void {
    this.messageHandlers = [];
    this.typingHandlers = [];
    this.typingUsers.clear();
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }
}

export const chatService = new ChatService();
export default chatService;