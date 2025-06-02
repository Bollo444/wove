/**
 * Story-related types shared between frontend and backend
 */

import { AgeTier } from './age-tier';
import { User } from './user';

export interface Story {
  id: string;
  title: string;
  description: string;
  ageTier: AgeTier;
  genre: string[];
  isPublic: boolean;
  authorId: string;
  author?: User;
  coverImageUrl?: string;
  segments: StorySegment[];
  collaborators?: User[];
  viewCount: number;
  likeCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface StorySegment {
  id: string;
  storyId: string;
  title: string;
  content: string;
  order: number;
  mediaAssets?: MediaAsset[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  altText?: string;
  caption?: string;
  order: number;
}

export interface CreateStoryData {
  title: string;
  description: string;
  ageTier: AgeTier;
  genre: string[];
  isPublic: boolean;
  coverImageUrl?: string;
}

export interface CreateStorySegmentData {
  title: string;
  content: string;
  order: number;
  mediaAssets?: Omit<MediaAsset, 'id'>[];
}

export interface UpdateStoryData extends Partial<CreateStoryData> {
  id: string;
}

export interface StoryFilters {
  ageTier?: AgeTier;
  genre?: string[];
  isPublic?: boolean;
  authorId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}