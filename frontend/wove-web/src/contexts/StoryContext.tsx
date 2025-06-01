'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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
  isPrivate: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  segments: StorySegment[];
  collaborators: StoryCollaborator[];
}

interface StoryCollaborator {
  id: string;
  userId: string;
  username: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

interface CreateStoryData {
  title: string;
  description: string;
  ageTier: string;
  isPrivate: boolean;
  genreIds?: string[];
}

interface StoryContextType {
  currentStory: Story | null;
  stories: Story[];
  isLoading: boolean;
  createStory: (storyData: CreateStoryData) => Promise<Story>;
  loadStory: (storyId: string) => Promise<void>;
  loadUserStories: () => Promise<void>;
  loadPublicStories: (filters?: any) => Promise<void>;
  addSegment: (storyId: string, content: string, mediaAssets?: MediaAsset[]) => Promise<void>;
  updateStory: (storyId: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
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
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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
        setStories(prev => [newStory, ...prev]);
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
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStory(data);
      } else {
        throw new Error(data.message || 'Failed to load story');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
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
        setStories(data.stories || data);
      } else {
        throw new Error(data.message || 'Failed to load stories');
      }
    } catch (error) {
      console.error('Error loading user stories:', error);
      setStories([]);
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

      const response = await fetch(`/api/stories/public?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setStories(data.stories || data);
      } else {
        throw new Error(data.message || 'Failed to load public stories');
      }
    } catch (error) {
      console.error('Error loading public stories:', error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSegment = async (storyId: string, content: string, mediaAssets?: MediaAsset[]): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stories/${storyId}/segments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, mediaAssets }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reload the current story to get updated segments
        if (currentStory?.id === storyId) {
          await loadStory(storyId);
        }
      } else {
        throw new Error(data.message || 'Failed to add segment');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
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
          setCurrentStory(data);
        }
        setStories(prev => prev.map(story => story.id === storyId ? data : story));
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
        // Remove from local state
        setStories(prev => prev.filter(story => story.id !== storyId));
        if (currentStory?.id === storyId) {
          setCurrentStory(null);
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

  const value = {
    currentStory,
    stories,
    isLoading,
    createStory,
    loadStory,
    loadUserStories,
    loadPublicStories,
    addSegment,
    updateStory,
    deleteStory,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};