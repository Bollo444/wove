'use client';

import { io, Socket } from 'socket.io-client';
import { apiService } from './api.service';

interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'segment_added' | 'segment_updated' | 'story_updated';
  data: any;
  userId: string;
  timestamp: Date;
}

interface CollaboratorPresence {
  userId: string;
  username: string;
  isActive: boolean;
  lastSeen: Date;
}

class CollaborationService {
  private socket: Socket | null = null;
  private currentStoryId: string | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    const token = apiService.getToken();
    if (!token) {
      console.warn('No auth token available for collaboration');
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentStoryId = null;
  }

  joinStory(storyId: string): void {
    if (!this.socket?.connected) {
      this.connect();
    }

    if (this.currentStoryId === storyId) return;

    if (this.currentStoryId) {
      this.leaveStory(this.currentStoryId);
    }

    this.currentStoryId = storyId;
    this.socket?.emit('join_story', { storyId });
  }

  leaveStory(storyId: string): void {
    if (this.socket?.connected && this.currentStoryId === storyId) {
      this.socket.emit('leave_story', { storyId });
      this.currentStoryId = null;
    }
  }

  sendSegmentUpdate(storyId: string, segmentData: any): void {
    if (this.socket?.connected && this.currentStoryId === storyId) {
      this.socket.emit('segment_update', {
        storyId,
        segmentData,
      });
    }
  }

  sendStoryUpdate(storyId: string, updates: any): void {
    if (this.socket?.connected && this.currentStoryId === storyId) {
      this.socket.emit('story_update', {
        storyId,
        updates,
      });
    }
  }

  sendChatMessage(storyId: string, message: string): void {
    if (this.socket?.connected && this.currentStoryId === storyId) {
      this.socket.emit('chat_message', {
        storyId,
        message,
      });
    }
  }

  sendTypingIndicator(storyId: string, isTyping: boolean): void {
    if (this.socket?.connected && this.currentStoryId === storyId) {
      this.socket.emit('typing_indicator', {
        storyId,
        isTyping,
      });
    }
  }

  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  off(event: string, handler?: Function): void {
    if (!handler) {
      this.eventHandlers.delete(event);
      return;
    }

    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to collaboration server');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      this.emit('disconnected');
    });

    this.socket.on('user_joined', (data) => {
      console.log('User joined story:', data);
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data) => {
      console.log('User left story:', data);
      this.emit('user_left', data);
    });

    this.socket.on('segment_added', (data) => {
      console.log('Segment added:', data);
      this.emit('segment_added', data);
    });

    this.socket.on('segment_updated', (data) => {
      console.log('Segment updated:', data);
      this.emit('segment_updated', data);
    });

    this.socket.on('story_updated', (data) => {
      console.log('Story updated:', data);
      this.emit('story_updated', data);
    });

    this.socket.on('chat_message', (data) => {
      console.log('Chat message received:', data);
      this.emit('chat_message', data);
    });

    this.socket.on('typing_indicator', (data) => {
      this.emit('typing_indicator', data);
    });

    this.socket.on('collaborators_update', (data) => {
      console.log('Collaborators updated:', data);
      this.emit('collaborators_update', data);
    });

    this.socket.on('error', (error) => {
      console.error('Collaboration error:', error);
      this.emit('error', error);
    });
  }

  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // API methods for collaboration management
  async getStoryCollaborators(storyId: string): Promise<any[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/collaborators`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collaborators');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw error;
    }
  }

  async inviteCollaborator(storyId: string, email: string, role: string = 'editor'): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/collaborators/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error('Failed to invite collaborator');
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      throw error;
    }
  }

  async updateCollaboratorRole(storyId: string, userId: string, role: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/collaborators/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update collaborator role');
      }
    } catch (error) {
      console.error('Error updating collaborator role:', error);
      throw error;
    }
  }

  async removeCollaborator(storyId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${storyId}/collaborators/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove collaborator');
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getCurrentStoryId(): string | null {
    return this.currentStoryId;
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;