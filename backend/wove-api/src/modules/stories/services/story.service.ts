import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger, // Added Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In, Like } from 'typeorm';
import {
  Story,
  StoryCollaborator,
  User,
  StorySegment,
  StoryBranchPoint,
  StoryChoiceOption,
} from '../../../database/entities'; // Added branching entities
import { StoryStatus, CollaborationRole, AgeTier } from '@shared/types';
import { AiService } from '../../ai/services/ai.service';
import { WebSocketService } from '../../websocket/services/websocket.service';
import {
  SocketMessageType,
  NotificationMessage,
} from '../../websocket/interfaces/socket-message.interface';
import { StoryMemoryService } from './story-memory.service'; // Added StoryMemoryService

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name); // Added logger instance

  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(StoryCollaborator)
    private collaboratorsRepository: Repository<StoryCollaborator>,
    @InjectRepository(StorySegment)
    private segmentsRepository: Repository<StorySegment>,
    @InjectRepository(StoryBranchPoint) // Added
    private branchPointRepository: Repository<StoryBranchPoint>,
    @InjectRepository(StoryChoiceOption) // Added
    private choiceOptionRepository: Repository<StoryChoiceOption>,
    // private readonly aiService: AiService, // Temporarily commented out due to circular dependency
    private readonly webSocketService: WebSocketService,
    private readonly storyMemoryService: StoryMemoryService, // Injected StoryMemoryService
  ) {}

  /**
   * Create a new story
   * @param userId - User ID of the creator
   * @param data - Story data
   * @returns Created story
   */
  async createStory(
    userId: string,
    data: {
      title: string;
      description?: string;
      coverImageUrl?: string;
      ageTier: AgeTier;
      isPrivate?: boolean;
      genreIds?: string[];
      premiseId?: string;
      collaborators?: { userId: string; role: CollaborationRole }[];
    },
  ): Promise<Story> {
    const story = new Story();
    story.title = data.title;
    story.description = data.description;
    story.coverImageUrl = data.coverImageUrl;
    story.creatorId = userId;
    story.ageTier = data.ageTier;
    story.status = StoryStatus.IN_PROGRESS;
    story.isPrivate = data.isPrivate ?? false;
    story.genreIds = data.genreIds || [];
    story.premiseId = data.premiseId;

    // Save the story first to get an ID
    const savedStory = await this.storiesRepository.save(story);

    // Add the creator as a collaborator with owner role
    const creatorCollaborator = new StoryCollaborator();
    creatorCollaborator.storyId = savedStory.id;
    creatorCollaborator.userId = userId;
    creatorCollaborator.role = CollaborationRole.OWNER;
    await this.collaboratorsRepository.save(creatorCollaborator);

    // Add additional collaborators if provided
    if (data.collaborators && data.collaborators.length > 0) {
      const collaborators = data.collaborators.map(collab => {
        const collaborator = new StoryCollaborator();
        collaborator.storyId = savedStory.id;
        collaborator.userId = collab.userId;
        collaborator.role = collab.role;
        return collaborator;
      });

      await this.collaboratorsRepository.save(collaborators);
    }

    return this.findStoryById(savedStory.id);
  }

  /**
   * Get a story by ID
   * @param storyId - Story ID
   * @returns Story object
   */
  async findStoryById(storyId: string): Promise<Story> {
    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
      relations: ['creator', 'collaborators', 'collaborators.user'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    return story;
  }

  /**
   * Update a story
   * @param userId - User ID making the request
   * @param storyId - Story ID to update
   * @param data - Story data to update
   * @returns Updated story
   */
  async updateStory(
    userId: string,
    storyId: string,
    data: {
      title?: string;
      description?: string;
      coverImageUrl?: string;
      ageTier?: AgeTier;
      isPrivate?: boolean;
      status?: StoryStatus;
      genreIds?: string[];
    },
  ): Promise<Story> {
    // Check if user has permission to update the story
    await this.verifyUserPermission(userId, storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
    ]);

    const story = await this.findStoryById(storyId);

    // Apply updates
    if (data.title !== undefined) {
      story.title = data.title;
    }

    if (data.description !== undefined) {
      story.description = data.description;
    }

    if (data.coverImageUrl !== undefined) {
      story.coverImageUrl = data.coverImageUrl;
    }

    if (data.ageTier !== undefined) {
      story.ageTier = data.ageTier;
    }

    if (data.isPrivate !== undefined) {
      story.isPrivate = data.isPrivate;
    }

    if (data.status !== undefined) {
      story.status = data.status;
    }

    if (data.genreIds !== undefined) {
      story.genreIds = data.genreIds;
    }

    return this.storiesRepository.save(story);
  }

  /**
   * Delete a story
   * @param userId - User ID making the request
   * @param storyId - Story ID to delete
   */
  async deleteStory(userId: string, storyId: string): Promise<void> {
    // Check if user is the owner
    await this.verifyUserPermission(userId, storyId, [CollaborationRole.OWNER]);

    // Delete the story
    await this.storiesRepository.delete(storyId);
  }

  /**
   * Get all stories by a user (created or collaborated)
   * @param userId - User ID
   * @param filter - Optional filters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of stories
   */
  async getUserStories(
    userId: string,
    filter: {
      status?: StoryStatus;
      ageTier?: AgeTier;
      isPrivate?: boolean;
      role?: CollaborationRole;
      query?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ stories: Story[]; total: number }> {
    // Get story IDs where user is a collaborator
    const collaborations = await this.collaboratorsRepository.find({
      where: {
        userId,
        ...(filter.role ? { role: filter.role } : {}),
      },
    });

    const storyIds = collaborations.map(collab => collab.storyId);

    if (storyIds.length === 0) {
      return { stories: [], total: 0 };
    }

    // Build query conditions
    const where: FindOptionsWhere<Story> = {
      id: In(storyIds),
    };

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.ageTier) {
      where.ageTier = filter.ageTier;
    }

    if (filter.isPrivate !== undefined) {
      where.isPrivate = filter.isPrivate;
    }

    if (filter.query) {
      where.title = Like(`%${filter.query}%`);
    }

    // Query stories
    const [stories, total] = await this.storiesRepository.findAndCount({
      where,
      relations: ['creator', 'collaborators', 'collaborators.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return { stories, total };
  }

  /**
   * Get public stories with filters
   * @param filter - Filters to apply
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of stories
   */
  async getPublicStories(
    filter: {
      status?: StoryStatus;
      ageTier?: AgeTier;
      genreIds?: string[];
      query?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ stories: Story[]; total: number }> {
    // Build query conditions
    const where: any = {
      isPrivate: false,
    };

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.ageTier) {
      where.ageTier = filter.ageTier;
    }

    if (filter.genreIds && filter.genreIds.length > 0) {
      where.genreIds = filter.genreIds;
    }

    if (filter.query) {
      where.title = Like(`%${filter.query}%`);
    }

    // Query stories
    const [stories, total] = await this.storiesRepository.findAndCount({
      where,
      relations: ['creator', 'collaborators', 'collaborators.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { updatedAt: 'DESC' },
    });

    return { stories, total };
  }

  /**
   * Add a collaborator to a story
   * @param userId - User ID making the request
   * @param storyId - Story ID
   * @param collaboratorData - Data for new collaborator
   * @returns Created collaborator
   */
  async addCollaborator(
    userId: string,
    storyId: string,
    collaboratorData: { userId: string; role: CollaborationRole },
  ): Promise<StoryCollaborator> {
    // Check if user has permission to add collaborators
    await this.verifyUserPermission(userId, storyId, [CollaborationRole.OWNER]);

    // Check if collaborator already exists
    const existingCollab = await this.collaboratorsRepository.findOne({
      where: {
        storyId,
        userId: collaboratorData.userId,
      },
    });

    if (existingCollab) {
      throw new BadRequestException('User is already a collaborator for this story');
    }

    // Create new collaborator
    const collaborator = new StoryCollaborator();
    collaborator.storyId = storyId;
    collaborator.userId = collaboratorData.userId;
    collaborator.role = collaboratorData.role;

    return this.collaboratorsRepository.save(collaborator);
  }

  /**
   * Update a collaborator's role
   * @param userId - User ID making the request
   * @param storyId - Story ID
   * @param collaboratorId - Collaborator ID to update
   * @param role - New role
   * @returns Updated collaborator
   */
  async updateCollaboratorRole(
    userId: string,
    storyId: string,
    collaboratorId: string,
    role: CollaborationRole,
  ): Promise<StoryCollaborator> {
    // Check if user has permission to update collaborators
    await this.verifyUserPermission(userId, storyId, [CollaborationRole.OWNER]);

    // Find collaborator
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id: collaboratorId, storyId },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    // Don't allow changing the owner's role
    if (collaborator.role === CollaborationRole.OWNER) {
      throw new BadRequestException("Cannot change the owner's role");
    }

    // Update role
    collaborator.role = role;

    return this.collaboratorsRepository.save(collaborator);
  }

  /**
   * Remove a collaborator from a story
   * @param userId - User ID making the request
   * @param storyId - Story ID
   * @param collaboratorId - Collaborator ID to remove
   */
  async removeCollaborator(userId: string, storyId: string, collaboratorId: string): Promise<void> {
    // Check if user has permission to remove collaborators
    await this.verifyUserPermission(userId, storyId, [CollaborationRole.OWNER]);

    // Find collaborator
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { id: collaboratorId, storyId },
    });

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    // Don't allow removing the owner
    if (collaborator.role === CollaborationRole.OWNER) {
      throw new BadRequestException('Cannot remove the owner from collaborators');
    }

    // Remove the collaborator
    await this.collaboratorsRepository.remove(collaborator);
  }

  /**
   * Get all collaborators for a story
   * @param storyId - Story ID
   * @returns List of collaborators
   */
  async getStoryCollaborators(storyId: string): Promise<StoryCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { storyId },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }

  /**
   * Check if a user has permission to perform operations on a story
   * @param userId - User ID
   * @param storyId - Story ID
   * @param allowedRoles - Array of roles that have permission
   * @returns void, throws ForbiddenException if not authorized
   */
  async verifyUserPermission(
    userId: string,
    storyId: string,
    allowedRoles: CollaborationRole[],
  ): Promise<void> {
    const collaborator = await this.collaboratorsRepository.findOne({
      where: { userId, storyId },
    });

    if (!collaborator) {
      throw new ForbiddenException('You do not have access to this story');
    }

    if (!allowedRoles.includes(collaborator.role)) {
      throw new ForbiddenException('You do not have permission to perform this operation');
    }
  }

  /**
   * Adds a new segment to a story (core of narrative progression)
   * @param userId User adding the segment
   * @param storyId Story ID
   * @param content Content of the segment
   * @param mediaAssets Optional media assets for the segment
   * @returns The newly created StorySegment
   */
  async addSegmentToStory(
    userId: string,
    storyId: string,
    content: string,
    mediaAssets?: { type: 'image' | 'video' | 'audio'; url: string; altText?: string }[], // Simplified for now
  ): Promise<StorySegment> {
    const story = await this.findStoryById(storyId); // Ensures story exists

    // 1. Verify Permission (e.g., is it user's turn? Are they a collaborator with writing rights?)
    // This is a simplified check; a real system would have turn management.
    await this.verifyUserPermission(userId, storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
      CollaborationRole.CONTRIBUTOR,
    ]);

    if (story.status === StoryStatus.COMPLETED || story.status === StoryStatus.ARCHIVED) {
      throw new BadRequestException('Cannot add segments to a completed or archived story.');
    }

    // 2. Determine position for the new segment
    const lastSegment = await this.segmentsRepository.findOne({
      where: { storyId },
      order: { position: 'DESC' },
    });
    const newPosition = lastSegment ? lastSegment.position + 1 : 0;

    // 3. Create and save the new segment
    const newSegment = this.segmentsRepository.create({
      storyId,
      creatorId: userId, // Corrected from authorId to creatorId
      content,
      position: newPosition,
      // mediaAssets: mediaAssets, // TODO: Handle media asset creation/linking properly
    });
    const savedSegment = await this.segmentsRepository.save(newSegment);

    // Update story's last updated timestamp
    story.updatedAt = new Date();
    await this.storiesRepository.save(story);

    // Process the new segment for memory updates
    try {
      await this.storyMemoryService.processNewSegmentForMemory(savedSegment);
    } catch (error) {
      // Log error but don't let it block segment addition
      this.logger.error(
        `Error processing segment ${savedSegment.id} for memory: ${error.message}`,
        error.stack,
      );
    }

    // 4. (Placeholder) Trigger AI for next part or update turn management
    const storySettings = story.settings as { aiContributionMode?: string; defaultAIMode?: string }; // Type assertion for settings
    const effectiveAIMode =
      storySettings?.aiContributionMode || storySettings?.defaultAIMode || 'none';

    if (story.allowCollaboration && effectiveAIMode !== 'none') {
      // More detailed logic for AI interaction or turn update
      if (effectiveAIMode === 'suggest') {
        // TODO: Trigger AI suggestion, but don't add it directly. Notify user.
        // this.aiService.generateStoryContinuation(story, [savedSegment], { suggestionMode: true });
      } else if (effectiveAIMode === 'co_write') {
        // TODO: Potentially trigger AI to write the *next* segment after this human one.
        // This would likely happen after turn update, if it's AI's "turn".
      }
      // Always update human turn after their contribution, even if AI is involved.
      await this.updateTurn(storyId, userId);
    } else if (story.allowCollaboration) {
      await this.updateTurn(storyId, userId); // Advance to next collaborator if no AI or AI is passive
    }

    // 5. Notify collaborators via WebSocket
    this.webSocketService.broadcastToRoom(storyId, SocketMessageType.CONTENT_UPDATE, savedSegment);

    // Example of sending a more specific notification to other collaborators
    const collaborators = await this.getStoryCollaborators(storyId);
    const recipientUserIds = collaborators.map(c => c.userId).filter(id => id !== userId); // Don't notify the user who made the change

    if (recipientUserIds.length > 0) {
      const notification: NotificationMessage = {
        type: SocketMessageType.NOTIFICATION,
        userId: 'system', // Or userId for specific attribution
        timestamp: Date.now(),
        title: 'Story Updated',
        message: `A new segment was added to "${story.title}".`, // Consider adding who added it
        severity: 'info',
        roomId: storyId,
      };
      // This assumes sendNotification can handle an array of user IDs and a single message.
      // If not, loop or adapt sendNotification.
      // For now, relying on the general CONTENT_UPDATE for broad notification.
      // this.webSocketService.sendNotification(recipientUserIds, notification);
    }

    return savedSegment;
  }

  // Placeholder for turn management logic
  // async updateTurn(storyId: string, lastUserId: string): Promise<void> {
  //   // Logic to determine next user's turn and update story.currentTurnUserId
  //   console.log(`Updating turn for story ${storyId} after user ${lastUserId}`);
  // }

  /**
   * Creates a branch point after a given segment.
   * @param userId User initiating the branch
   * @param storyId Story ID
   * @param sourceSegmentId The ID of the segment after which choices will be presented
   * @param options Array of choice texts for the branches
   * @param promptText Optional text to display before choices (e.g., "What happens next?")
   * @returns The created StoryBranchPoint with its options
   */
  async createBranchPoint(
    userId: string,
    storyId: string,
    sourceSegmentId: string,
    options: { optionText: string }[],
    promptText?: string,
  ): Promise<StoryBranchPoint> {
    await this.verifyUserPermission(userId, storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
      CollaborationRole.CONTRIBUTOR,
    ]);

    const sourceSegment = await this.segmentsRepository.findOne({
      where: { id: sourceSegmentId, storyId },
    });
    if (!sourceSegment) {
      throw new NotFoundException(
        `Source segment ${sourceSegmentId} not found in story ${storyId}.`,
      );
    }

    // Ensure no branch point already exists for this segment
    const existingBranch = await this.branchPointRepository.findOne({ where: { sourceSegmentId } });
    if (existingBranch) {
      throw new BadRequestException(
        `A branch point already exists for segment ${sourceSegmentId}.`,
      );
    }

    const branchPoint = this.branchPointRepository.create({
      storyId,
      sourceSegmentId,
      promptText,
    });
    const savedBranchPoint = await this.branchPointRepository.save(branchPoint);

    const choiceOptions = options.map((opt, index) =>
      this.choiceOptionRepository.create({
        branchPointId: savedBranchPoint.id,
        optionText: opt.optionText,
        displayOrder: index,
        // targetSegmentId will be set when a choice is made and a new segment is created for that branch
      }),
    );
    await this.choiceOptionRepository.save(choiceOptions);

    // Reload to get options eagerly
    const reloadedBranchPoint = await this.branchPointRepository.findOne({
      where: { id: savedBranchPoint.id },
      relations: ['options'],
    });
    if (!reloadedBranchPoint) {
      // This should ideally not happen if save was successful
      throw new NotFoundException(
        `Branch point with ID ${savedBranchPoint.id} not found after creation.`,
      );
    }
    return reloadedBranchPoint;
  }

  /**
   * Resolves a branch point by selecting an option and creating the first segment of the new branch.
   * @param userId User making the choice
   * @param storyId Story ID
   * @param branchPointId The ID of the branch point being resolved
   * @param selectedOptionId The ID of the chosen StoryChoiceOption
   * @param firstSegmentContent The content for the first segment of the chosen branch
   * @returns The newly created StorySegment that starts the chosen branch
   */
  async resolveBranchChoice(
    userId: string,
    storyId: string,
    branchPointId: string,
    selectedOptionId: string,
    firstSegmentContent: string,
  ): Promise<StorySegment> {
    await this.verifyUserPermission(userId, storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
      CollaborationRole.CONTRIBUTOR,
    ]);

    const branchPoint = await this.branchPointRepository.findOne({
      where: { id: branchPointId, storyId },
      relations: ['options', 'sourceSegment'],
    });
    if (!branchPoint) throw new NotFoundException(`Branch point ${branchPointId} not found.`);
    if (branchPoint.resolvedAt)
      throw new BadRequestException(`Branch point ${branchPointId} has already been resolved.`);

    const selectedOption = branchPoint.options.find(opt => opt.id === selectedOptionId);
    if (!selectedOption)
      throw new NotFoundException(
        `Selected option ${selectedOptionId} not found for branch point ${branchPointId}.`,
      );

    // Create the first segment for this new branch
    // Its position might need careful calculation if parallel branches can exist and merge later.
    // For now, assume it follows the source segment's "branch" conceptually.
    // A more complex system might use a graph structure for segments.
    const newBranchSegment = await this.addSegmentToStory(userId, storyId, firstSegmentContent);

    // Link the choice to the new segment and mark branch as resolved
    selectedOption.targetSegmentId = newBranchSegment.id;
    await this.choiceOptionRepository.save(selectedOption);

    branchPoint.selectedOptionId = selectedOptionId;
    branchPoint.resolvedAt = new Date();
    await this.branchPointRepository.save(branchPoint);

    // Update story's last updated timestamp
    const storyToUpdate = await this.storiesRepository.findOne({ where: { id: storyId } }); // Renamed to avoid conflict with story var in updateTurn
    if (storyToUpdate) {
      storyToUpdate.updatedAt = new Date();
      await this.storiesRepository.save(storyToUpdate);
    }

    // Notify about the branch resolution
    this.webSocketService.broadcastToRoom(storyId, SocketMessageType.CONTENT_UPDATE, {
      event: 'branch_resolved',
      branchPointId,
      selectedOptionId,
      newSegmentId: newBranchSegment.id,
      newSegmentContent: newBranchSegment.content,
    });

    return newBranchSegment;
  }
  /**
   * Placeholder for turn management logic.
   * Determines the next user's turn and updates story.currentTurnUserId.
   * @param storyId The ID of the story.
   * @param lastUserId The ID of the user who just finished their turn.
   */
  async updateTurn(storyId: string, lastUserId: string): Promise<void> {
    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
      relations: ['collaborators'],
    });

    if (
      !story ||
      !story.allowCollaboration ||
      !story.collaborators ||
      story.collaborators.length === 0
    ) {
      // console.log(`Turn management not applicable for story ${storyId}`);
      return;
    }

    const collaborators = story.collaborators.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    ); // Simple order by join time
    // Ensure currentTurnUserId is considered if lastUserId is the same (e.g. user undoes their own last action)
    const effectiveLastTurnUser =
      story.currentTurnUserId === lastUserId ? lastUserId : story.currentTurnUserId || lastUserId;
    const currentIndex = collaborators.findIndex(c => c.userId === effectiveLastTurnUser);

    let nextTurnUserId: string | null = null;
    if (collaborators.length > 0) {
      const nextIndex = (currentIndex + 1) % collaborators.length;
      nextTurnUserId = collaborators[nextIndex].userId;
    }

    if (story.currentTurnUserId !== nextTurnUserId) {
      story.currentTurnUserId = nextTurnUserId ?? undefined; // Assign undefined if nextTurnUserId is null
      await this.storiesRepository.save(story);
      this.webSocketService.broadcastToRoom(storyId, SocketMessageType.GRANT_TURN, {
        userId: nextTurnUserId,
        storyId,
      });
      // console.log(`Turn updated for story ${storyId}. New turn for user: ${nextTurnUserId}`);
    }
  }
}
