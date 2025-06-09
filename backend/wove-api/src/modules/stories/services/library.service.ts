import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In, Like } from 'typeorm';
import { Story, StoryPremise, UserStoryBookmark } from '../../../database/entities';
import { StoryStatus, AgeTier } from '@shared/types';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(StoryPremise)
    private premisesRepository: Repository<StoryPremise>,
    @InjectRepository(UserStoryBookmark)
    private bookmarksRepository: Repository<UserStoryBookmark>,
  ) {}

  /**
   * Get featured stories for library homepage
   * @param limit - Maximum number of stories to return
   * @returns List of featured stories
   */
  async getFeaturedStories(limit: number = 10): Promise<Story[]> {
    return this.storiesRepository.find({
      where: {
        isPrivate: false,
        status: StoryStatus.PUBLISHED,
      },
      relations: ['creator'],
      order: {
        viewCount: 'DESC',
        publishedAt: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get trending stories based on recent activity
   * @param limit - Maximum number of stories to return
   * @returns List of trending stories
   */
  async getTrendingStories(limit: number = 10): Promise<Story[]> {
    return this.storiesRepository.find({
      where: {
        isPrivate: false,
        status: StoryStatus.PUBLISHED,
        publishedAt: this.getRecentDateFilter(),
      },
      relations: ['creator'],
      order: {
        viewCount: 'DESC',
        likeCount: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get story premises for various categories
   * @param category - Optional category to filter by
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of story premises
   */
  async getStoryPremises(
    category?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ premises: StoryPremise[]; total: number }> {
    const where: FindOptionsWhere<StoryPremise> = {};

    if (category) {
      where.category = category;
    }

    const [premises, total] = await this.premisesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { premises, total };
  }

  /**
   * Get stories by genre
   * @param genreId - Genre ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of stories
   */
  async getStoriesByGenre(
    genreId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ stories: Story[]; total: number }> {
    // We're using the array filter on genreIds here
    const [stories, total] = await this.storiesRepository.findAndCount({
      where: {
        genreIds: In([[genreId]]), // Using In operator with array for the genreIds array
        isPrivate: false,
        status: StoryStatus.PUBLISHED,
      },
      relations: ['creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return { stories, total };
  }

  /**
   * Get stories by age tier
   * @param ageTier - Age tier
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of stories
   */
  async getStoriesByAgeTier(
    ageTier: AgeTier,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ stories: Story[]; total: number }> {
    const [stories, total] = await this.storiesRepository.findAndCount({
      where: {
        ageTier,
        isPrivate: false,
        status: StoryStatus.PUBLISHED,
      },
      relations: ['creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return { stories, total };
  }

  /**
   * Search for stories in the library
   * @param query - Search query
   * @param filter - Optional filters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated search results
   */
  async searchLibrary(
    query: string,
    filter: {
      ageTier?: AgeTier;
      genreIds?: string[];
      status?: StoryStatus;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ stories: Story[]; total: number }> {
    const where: any = {
      isPrivate: false,
      title: Like(`%${query}%`),
    };

    if (filter.ageTier) {
      where.ageTier = filter.ageTier;
    }

    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = StoryStatus.PUBLISHED;
    }

    if (filter.genreIds && filter.genreIds.length > 0) {
      where.genreIds = filter.genreIds;
    }

    const [stories, total] = await this.storiesRepository.findAndCount({
      where,
      relations: ['creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return { stories, total };
  }

  /**
   * Bookmark a story for a user
   * @param userId - User ID
   * @param storyId - Story ID
   * @returns Bookmark object
   */
  async bookmarkStory(userId: string, storyId: string): Promise<UserStoryBookmark> {
    // Check if the story exists
    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    // Check if bookmark already exists
    const existingBookmark = await this.bookmarksRepository.findOne({
      where: { userId, storyId },
    });

    if (existingBookmark) {
      return existingBookmark;
    }

    // Create new bookmark
    const bookmark = new UserStoryBookmark();
    bookmark.userId = userId;
    bookmark.storyId = storyId;

    return this.bookmarksRepository.save(bookmark);
  }

  /**
   * Remove a bookmark
   * @param userId - User ID
   * @param storyId - Story ID
   */
  async removeBookmark(userId: string, storyId: string): Promise<void> {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { userId, storyId },
    });

    if (bookmark) {
      await this.bookmarksRepository.remove(bookmark);
    }
  }

  /**
   * Get a user's bookmarked stories
   * @param userId - User ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of bookmarked stories
   */
  async getUserBookmarks(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ bookmarks: UserStoryBookmark[]; total: number }> {
    const [bookmarks, total] = await this.bookmarksRepository.findAndCount({
      where: { userId },
      relations: ['story', 'story.creator'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { bookmarks, total };
  }

  /**
   * Helper to get a date range for recent items
   * @private
   * @returns Date object for recent items
   */
  private getRecentDateFilter(): Date {
    const date = new Date();
    // Last 30 days
    date.setDate(date.getDate() - 30);
    return date;
  }
}
