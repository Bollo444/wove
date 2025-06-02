'use client';

import { apiService } from './api.service';
import { Story, StorySegment, CreateStoryData, CreateStorySegmentData } from 'shared';

class StoryService {
  async getStories(): Promise<Story[]> {
    return apiService.getStories();
  }

  async getStory(id: string): Promise<Story> {
    return apiService.getStory(id);
  }

  async createStory(data: CreateStoryData): Promise<Story> {
    return apiService.createStory(data);
  }

  async updateStory(id: string, data: Partial<Story>): Promise<Story> {
    return apiService.updateStory(id, data);
  }

  async deleteStory(id: string): Promise<void> {
    return apiService.deleteStory(id);
  }

  async getStorySegments(storyId: string): Promise<StorySegment[]> {
    return apiService.getStorySegments(storyId);
  }

  async createStorySegment(storyId: string, data: CreateStorySegmentData): Promise<StorySegment> {
    return apiService.createStorySegment(storyId, data);
  }

  async updateStorySegment(storyId: string, segmentId: string, data: Partial<StorySegment>): Promise<StorySegment> {
    return apiService.updateStorySegment(storyId, segmentId, data);
  }

  async deleteStorySegment(storyId: string, segmentId: string): Promise<void> {
    return apiService.deleteStorySegment(storyId, segmentId);
  }

  // Additional story-specific methods
  async getPublicStories(): Promise<Story[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch public stories');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching public stories:', error);
      throw error;
    }
  }

  async searchStories(query: string, filters?: {
    ageTier?: string;
    category?: string;
    status?: string;
  }): Promise<Story[]> {
    try {
      const searchParams = new URLSearchParams({ q: query });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(apiService.getToken() && { 'Authorization': `Bearer ${apiService.getToken()}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search stories');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching stories:', error);
      throw error;
    }
  }

  async getFeaturedStories(): Promise<Story[]> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch featured stories');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching featured stories:', error);
      throw error;
    }
  }

  async getUserStories(userId?: string): Promise<Story[]> {
    try {
      const endpoint = userId 
        ? `/api/stories/user/${userId}` 
        : '/api/stories/my-stories';
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stories');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user stories:', error);
      throw error;
    }
  }
}

export const storyService = new StoryService();
export default storyService;