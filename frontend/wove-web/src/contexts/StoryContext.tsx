'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, User } from './AuthContext'; // Import User from AuthContext
import { Premise } from '../types/story.d';
import { ChatMessage, TypingUser } from '../types/collaboration.d'; // Import collaboration types

// Placeholder for WebSocket URL - should be configurable
const WEBSOCKET_URL_BASE = 'wss://your-backend-ws-url/story/'; // Example

interface StorySegment {
  id: string;
  content: string;
  position: number;
  authorName?: string;
  authorId: string;
  mediaAssets?: MediaAsset[];
  createdAt: string;
}

interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  altText?: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  ageTier: string;
  isPrivate: boolean; // This might be a post-creation setting, not part of initial POST /stories
  status: 'draft' | 'active' | 'completed' | 'archived';
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  segments: StorySegment[];
  collaborators: StoryCollaborator[];
  bookId?: string; // Added to link to a generated book
}

interface StoryCollaborator {
  id: string;
  userId: string;
  username: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

// Aligned with StoryCreateForm.tsx and API spec POST /stories
interface CreateStoryData {
  premiseId?: string;
  customTitle?: string;
  customPremise?: string;
  collaborationMode: string;
  endingPreference: string;
  initialStyle: string;
  ageTierSetting: string; 
  genres: string[]; // Changed from genreIds, and API doc doesn't explicitly list genres for POST /stories. Assuming it's needed or handled by backend based on premise/custom input.
  // isPrivate is removed as it's not in POST /stories API spec.
}


interface StoryContextType {
  currentStory: Story | null;
  userStories: Story[]; // Renamed from 'stories'
  premises: Premise[]; // Added for story premises
  isLoading: boolean;
  isSocketConnected: boolean;
  activeTurnUserId: string | null;
  chatMessages: ChatMessage[];
  typingUsers: TypingUser[];
  currentBookDetails: any | null; // Added for book viewer
  createStory: (storyData: CreateStoryData) => Promise<Story>;
  loadStory: (storyId: string) => Promise<void>;
  loadUserStories: () => Promise<void>;
  loadPublicStories: (filters?: any) => Promise<void>;
  addSegment: (storyId: string, content: string, applyAutoFix: boolean) => Promise<void>; // Signature changed
  updateStory: (storyId: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
  connectWebSocket: (storyId: string) => void;
  disconnectWebSocket: () => void;
  requestStoryConclusion: (storyId: string) => Promise<void>;
  // Collaboration functions
  sendChatMessage: (storyId: string, messageText: string) => Promise<void>;
  sendTypingActivity: (storyId: string, isTyping: boolean) => Promise<void>;
  inviteCollaborator: (storyId: string, emailOrUsername: string) => Promise<void>;
  // Book related functions
  generateBook: (storyId: string) => Promise<{ bookId: string; status: string; message?: string }>;
  getBookDetails: (bookId: string) => Promise<any>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

interface StoryProviderProps {
  children: ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [premises, setPremises] = useState<Premise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [activeTurnUserId, setActiveTurnUserId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [currentBookDetails, setCurrentBookDetails] = useState<any | null>(null); // Added
  const { user } = useAuth();

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const createStory = async (storyData: CreateStoryData): Promise<Story> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(storyData),
      });

      const data = await response.json();

      if (response.ok) {
        const newStory = data;
        // This story is a created one, might add to userStories if desired after creation
        // For now, just returning it. Or if createStory should also list it under user's stories:
        setUserStories(prev => [newStory, ...prev]); 
        return newStory;
      } else {
        throw new Error(data.message || 'Failed to create story');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStory = async (storyId: string): Promise<void> => {
    setIsLoading(true);
    if (socket) { // Disconnect existing socket if loading a new story
      disconnectWebSocket();
    }
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentStory(data);
        connectWebSocket(storyId); // Connect WebSocket after loading story data
      } else {
        throw new Error(data.message || 'Failed to load story');
      }
    } catch (error) {
      console.error('Error loading story:', error);
      setCurrentStory(null); // Clear story on error
      throw error; // Re-throw for page to handle
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (storyId: string) => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      console.log('WebSocket already open or connecting.');
      return;
    }

    // Construct WebSocket URL with storyId and potentially auth token if needed by backend for WS connection
    // For simplicity, not adding token to URL directly here, but backend might require it via query param or initial message
    const wsUrl = `${WEBSOCKET_URL_BASE}${storyId}`; 
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connection established for story:', storyId);
      setIsSocketConnected(true);
      // Optionally send an auth message if required by backend
      // newSocket.send(JSON.stringify({ type: 'AUTH', token: localStorage.getItem('accessToken') }));
    };

    newSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      try {
        const message = JSON.parse(event.data as string);
        // TODO: Handle different message types (e.g., NEW_SEGMENT, STORY_UPDATED, MEDIA_READY, ERROR)
        // For example:
        // if (message.type === 'STORY_UPDATED' && message.payload?.storyId === currentStory?.id) {
        //   setCurrentStory(prev => prev ? ({ ...prev, ...message.payload.data }) : null);
        // }
        // if (message.type === 'NEW_SEGMENT' && message.payload?.storyId === currentStory?.id) {
        //   setCurrentStory(prev => prev ? ({ ...prev, segments: [...prev.segments, message.payload.segment] }) : null);
        // }
        // Example for turn changed:
        // if (message.type === 'TURN_CHANGED' && message.payload?.storyId === currentStory?.id) {
        //   setActiveTurnUserId(message.payload.currentTurnUserId);
        // }
        // Handle USER_JOINED, USER_LEFT, CHAT_MESSAGE_RECEIVED, USER_TYPING_UPDATE
        switch (message.type) {
          case 'USER_JOINED':
            // Add to currentStory.collaborators if not present
            // Ensure this doesn't duplicate if list is also from REST
            console.log('WS: User joined (TODO: implement state update)', message.payload);
            // Example: setCurrentStory(prev => prev ? ({...prev, collaborators: [...prev.collaborators, message.payload.user]}))
            break;
          case 'USER_LEFT':
            // Remove from currentStory.collaborators and typingUsers
            console.log('WS: User left (TODO: implement state update)', message.payload);
            // Example: setCurrentStory(prev => prev ? ({...prev, collaborators: prev.collaborators.filter(c => c.userId !== message.payload.userId)}))
            // setTypingUsers(prev => prev.filter(u => u.userId !== message.payload.userId));
            break;
          case 'CHAT_MESSAGE_RECEIVED':
            const newMessage = message.payload as ChatMessage;
            // Ensure timestamp is a Date object if needed, or handle string display
            setChatMessages(prev => [...prev, { ...newMessage, timestamp: new Date(newMessage.timestamp) }]);
            break;
          case 'USER_TYPING_UPDATE':
            const { userId, username, isTyping } = message.payload;
            setTypingUsers(prev => {
              if (isTyping) {
                return prev.find(u => u.userId === userId) ? prev : [...prev, { userId, username }];
              } else {
                return prev.filter(u => u.userId !== userId);
              }
            });
            break;
          default:
            console.log('WS: Received unhandled message type', message.type);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // setIsSocketConnected(false); // Handled by onclose
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason, `Code: ${event.code}`);
      setIsSocketConnected(false);
      setSocket(null);
      // Optionally implement reconnection logic here
    };

    setSocket(newSocket);
  };

  const disconnectWebSocket = () => {
    if (socket) {
      console.log('Disconnecting WebSocket...');
      socket.close();
      // State updates (isSocketConnected, socket) are handled by onclose handler
    }
  };

  const loadUserStories = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stories', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setUserStories(data.stories || data); // Populates userStories
      } else {
        throw new Error(data.message || 'Failed to load stories');
      }
    } catch (error) {
      console.error('Error loading user stories:', error);
      setUserStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublicStories = async (filters?: any): Promise<void> => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== '') {
            queryParams.append(key, filters[key]);
          }
        });
      }

      // API doc: GET /stories/premises
      // Assuming Next.js API route /api/stories/premises maps to this
      const response = await fetch(`/api/stories/premises?${queryParams.toString()}`, { 
        headers: getAuthHeaders(), // Auth might be required for age-tiering
      });

      const data = await response.json();

      if (response.ok) {
        setPremises(data.premises || []); // Store in 'premises' state
      } else {
        throw new Error(data.message || 'Failed to load public story premises');
      }
    } catch (error) {
      console.error('Error loading public story premises:', error);
      setPremises([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSegment = async (storyId: string, content: string, applyAutoFix: boolean): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected.');
      throw new Error('Cannot add segment: Not connected to story service.');
    }
    if (!content.trim()) {
        throw new Error('Segment content cannot be empty.');
    }

    // setIsLoading(true); // UI might want its own loading state for this optimistic action
    try {
      const message = {
        type: 'SUBMIT_TURN', // Or as defined by backend for submitting new segment/turn
        payload: {
          storyId: storyId,
          userInput: content,
          applyAutoFix: applyAutoFix,
        },
      };
      socket.send(JSON.stringify(message));
      console.log('Sent SUBMIT_TURN message via WebSocket:', message);
      // Optimistic update or wait for backend broadcast via onmessage handler for NEW_SEGMENT or STORY_UPDATED
      // For now, no direct state update here; expecting backend to send the new segment.
    } catch (error) {
      console.error('Error sending segment via WebSocket:', error);
      // setIsLoading(false);
      throw error; // Re-throw for the component to handle
    }
    // setIsLoading(false); // Usually, loading state for this action is brief or handled by UI feedback
  };
  
  const updateStory = async (storyId: string, updates: Partial<Story>): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        if (currentStory?.id === storyId) {
          setCurrentStory(data); // Update current story if it's the one being edited
        }
        // Update userStories list if the updated story is in it
        setUserStories(prev => prev.map(story => story.id === storyId ? data : story));
        // Premises list should not be affected by updating a user's story
      } else {
        throw new Error(data.message || 'Failed to update story');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStory = async (storyId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        // Remove from local userStories state
        setUserStories(prev => prev.filter(story => story.id !== storyId));
        if (currentStory?.id === storyId) {
          setCurrentStory(null); // Clear current story if it's the one deleted
        }
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete story');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestStoryConclusion = async (storyId: string): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected.');
      throw new Error('Cannot request story conclusion: Not connected to story service.');
    }
    try {
      const message = {
        type: 'REQUEST_STORY_CONCLUSION',
        payload: { storyId },
      };
      socket.send(JSON.stringify(message));
      console.log('Sent REQUEST_STORY_CONCLUSION message via WebSocket:', message);
      // UI should update based on STORY_UPDATED or STORY_CONCLUDED messages from backend
    } catch (error) {
      console.error('Error requesting story conclusion via WebSocket:', error);
      throw error;
    }
  };

  const sendChatMessage = async (storyId: string, messageText: string): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) {
      throw new Error('WebSocket not connected or user not authenticated.');
    }
    const message = {
      type: 'SEND_CHAT_MESSAGE', // API Doc: sendChatMessage (payload: {storyId, message})
      payload: {
        storyId,
        userId: user.id, // Assuming user object from AuthContext has id
        username: user.username, // Assuming user object has username
        text: messageText,
        // timestamp will be set by backend or upon receiving CHAT_MESSAGE_RECEIVED
      },
    };
    socket.send(JSON.stringify(message));
    console.log('Sent CHAT_MESSAGE via WebSocket:', message);
    // Optimistic update could be done here, but usually rely on CHAT_MESSAGE_RECEIVED
  };

  const sendTypingActivity = async (storyId: string, isTyping: boolean): Promise<void> => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) {
      // Silently fail or log, as typing indicators are less critical than messages
      console.warn('WebSocket not connected or user not authenticated for typing activity.');
      return;
    }
    const message = {
      type: 'TYPING_ACTIVITY', // API Doc: typingActivity (payload: {storyId, isTyping})
      payload: {
        storyId,
        userId: user.id,
        username: user.username,
        isTyping,
      },
    };
    socket.send(JSON.stringify(message));
    // No direct state update here, relies on USER_TYPING_UPDATE from backend for others
  };
  
  const inviteCollaborator = async (storyId: string, emailOrUsername: string): Promise<void> => {
    setIsLoading(true); // Or a specific loading state for this action
    try {
      const response = await fetch(`/api/stories/${storyId}/collaborators`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ emailOrUsername: emailOrUsername, role: 'editor' }), // Default role or make it selectable
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to invite collaborator');
      }
      console.log('Collaborator invited successfully:', data);
      // Optionally, reload story to update collaborator list, or rely on USER_JOINED if backend sends it
      // await loadStory(storyId); 
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateBook = async (storyId: string): Promise<{ bookId: string; status: string; message?: string }> => {
    setIsLoading(true); // Consider a more specific loading state if needed
    try {
      // This fetch should ideally go to a Next.js API route defined in pages/api/stories/[storyId]/book.ts
      const response = await fetch(`/api/stories/${storyId}/book`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate book');
      }
      // Example: data = { bookId: string, status: string, message?: string }
      console.log('Book generation initiated/status:', data);
      return data; 
    } catch (error) {
      console.error('Error generating book:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBookDetails = async (bookId: string): Promise<any> => {
    setIsLoading(true);
    try {
      // This fetch should go to a Next.js API route like /api/books/[bookId].ts
      const response = await fetch(`/api/books/${bookId}`, { 
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch book details');
      }
      setCurrentBookDetails(data);
      console.log('Book details fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      setCurrentBookDetails(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentStory,
    userStories, 
    premises,
    isLoading,
    isSocketConnected,
    activeTurnUserId,
    chatMessages,
    typingUsers,
    currentBookDetails, // Added
    createStory,
    loadStory,
    loadUserStories,
    loadPublicStories,
    addSegment,
    updateStory,
    deleteStory,
    connectWebSocket,
    disconnectWebSocket,
    requestStoryConclusion,
    // Collaboration functions
    sendChatMessage,
    sendTypingActivity,
    inviteCollaborator,
    // Book functions
    generateBook,
    getBookDetails,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};