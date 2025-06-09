'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Story, StorySegment, MediaAsset, CreateStoryData, CreateStorySegmentData } from 'shared';
import { storyService } from '../services/story.service';

interface StoryContextType {
  currentStory: Story | null;
  stories: Story[];
  isLoading: boolean;
  createStory: (storyData: CreateStoryData) => Promise<Story>;
  loadStory: (storyId: string) => Promise<void>;
  loadUserStories: () => Promise<void>;
  loadPublicStories: (filters?: any) => Promise<void>;
  searchStories: (query: string, filters?: any) => Promise<void>;
  addSegment: (storyId: string, segmentData: CreateStorySegmentData) => Promise<void>;
  updateStory: (storyId: string, updates: Partial<Story>) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = (): StoryContextType => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createStory = async (storyData: CreateStoryData): Promise<Story> => {
    setIsLoading(true);
    try {
      const newStory = await storyService.createStory(storyData);
      setStories(prev => [newStory, ...prev]);
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadStory = async (storyId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const story = await storyService.getStory(storyId);
      setCurrentStory(story);
    } catch (error) {
      console.error('Error loading story:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStories = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const userStories = await storyService.getUserStories();
      setStories(userStories);
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
      const publicStories = await storyService.getPublicStories();
      setStories(publicStories);
    } catch (error) {
      console.error('Error loading public stories:', error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchStories = async (query: string, filters?: any): Promise<void> => {
    setIsLoading(true);
    try {
      const searchResults = await storyService.searchStories(query, filters);
      setStories(searchResults);
    } catch (error) {
      console.error('Error searching stories:', error);
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSegment = async (
    storyId: string,
    segmentData: CreateStorySegmentData,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await storyService.createStorySegment(storyId, segmentData);
      // Reload the current story to get updated segments
      if (currentStory?.id === storyId) {
        await loadStory(storyId);
      }
    } catch (error) {
      console.error('Error adding segment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStory = async (storyId: string, updates: Partial<Story>): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedStory = await storyService.updateStory(storyId, updates);
      // Update local state
      if (currentStory?.id === storyId) {
        setCurrentStory(updatedStory);
      }
      setStories(prev => prev.map(story => (story.id === storyId ? updatedStory : story)));
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStory = async (storyId: string): Promise<void> => {
    setIsLoading(true);
    try {
      await storyService.deleteStory(storyId);
      // Remove from local state
      setStories(prev => prev.filter(story => story.id !== storyId));
      if (currentStory?.id === storyId) {
        setCurrentStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: StoryContextType = {
    currentStory,
    stories,
    isLoading,
    createStory,
    loadStory,
    loadUserStories,
    loadPublicStories,
    searchStories,
    addSegment,
    updateStory,
    deleteStory,
  };

  return (
    <StoryContext.Provider value={value} data-oid="p3bfbxr">
      {children}
    </StoryContext.Provider>
  );
};
