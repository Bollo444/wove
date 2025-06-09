import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorySegment, Story, StoryCollaborator, MediaAsset } from '../../../database/entities';
import { CollaborationRole } from '@shared/types';
import { StoryService } from './story.service';

@Injectable()
export class StorySegmentService {
  constructor(
    @InjectRepository(StorySegment)
    private segmentsRepository: Repository<StorySegment>,
    @InjectRepository(MediaAsset)
    private mediaRepository: Repository<MediaAsset>,
    @InjectRepository(StoryCollaborator)
    private collaboratorsRepository: Repository<StoryCollaborator>,
    private storyService: StoryService,
  ) {}

  /**
   * Create a new story segment
   * @param userId - User ID of the creator
   * @param storyId - Parent story ID
   * @param data - Segment data
   * @returns Created segment
   */
  async createSegment(
    userId: string,
    storyId: string,
    data: {
      content: string;
      position: number;
      mediaAssetIds?: string[];
    },
  ): Promise<StorySegment> {
    // Verify user has permission to add segments to the story
    await this.storyService.verifyUserPermission(userId, storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
      CollaborationRole.CONTRIBUTOR,
    ]);

    // Verify the position is valid
    const existingSegments = await this.segmentsRepository.count({ where: { storyId } });
    if (data.position > existingSegments) {
      data.position = existingSegments;
    }

    // Create the segment
    const segment = new StorySegment();
    segment.storyId = storyId;
    segment.content = data.content;
    segment.position = data.position;
    segment.creatorId = userId;

    // Create new segment
    const savedSegment = await this.segmentsRepository.save(segment);

    // Associate media assets if provided
    if (data.mediaAssetIds && data.mediaAssetIds.length > 0) {
      await this.addMediaToSegment(savedSegment.id, data.mediaAssetIds);
    }

    // Reorder other segments if necessary
    if (data.position < existingSegments) {
      await this.reorderSegmentsAfterInsertion(storyId, data.position);
    }

    return this.findSegmentById(savedSegment.id);
  }

  /**
   * Get a segment by ID
   * @param segmentId - Segment ID
   * @returns Segment object
   */
  async findSegmentById(segmentId: string): Promise<StorySegment> {
    const segment = await this.segmentsRepository.findOne({
      where: { id: segmentId },
      relations: ['creator', 'mediaAssets'],
    });

    if (!segment) {
      throw new NotFoundException('Segment not found');
    }

    return segment;
  }

  /**
   * Update a story segment
   * @param userId - User ID making the request
   * @param segmentId - Segment ID to update
   * @param data - Segment data to update
   * @returns Updated segment
   */
  async updateSegment(
    userId: string,
    segmentId: string,
    data: {
      content?: string;
      position?: number;
    },
  ): Promise<StorySegment> {
    const segment = await this.findSegmentById(segmentId);

    // Verify user has permission to update the segment
    await this.storyService.verifyUserPermission(userId, segment.storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
    ]);

    // Check if creator can edit their own contribution
    const isCreator = segment.creatorId === userId;
    if (!isCreator) {
      const collaborator = await this.collaboratorsRepository.findOne({
        where: { userId, storyId: segment.storyId },
      });

      if (collaborator && collaborator.role === CollaborationRole.CONTRIBUTOR) {
        throw new ForbiddenException('Contributors can only edit their own segments');
      }
    }

    const oldPosition = segment.position;

    // Apply updates
    if (data.content !== undefined) {
      segment.content = data.content;
    }

    if (data.position !== undefined && data.position !== oldPosition) {
      // Verify the new position is valid
      const segmentCount = await this.segmentsRepository.count({
        where: { storyId: segment.storyId },
      });

      if (data.position >= 0 && data.position < segmentCount) {
        segment.position = data.position;

        // Save the segment first
        await this.segmentsRepository.save(segment);

        // Reorder other segments
        await this.reorderSegmentsAfterPositionChange(segment.storyId, oldPosition, data.position);

        // Return the updated segment
        return this.findSegmentById(segmentId);
      } else {
        throw new BadRequestException(`Position must be between 0 and ${segmentCount - 1}`);
      }
    }

    return this.segmentsRepository.save(segment);
  }

  /**
   * Delete a story segment
   * @param userId - User ID making the request
   * @param segmentId - Segment ID to delete
   */
  async deleteSegment(userId: string, segmentId: string): Promise<void> {
    const segment = await this.findSegmentById(segmentId);

    // Verify user has permission to delete the segment
    await this.storyService.verifyUserPermission(userId, segment.storyId, [
      CollaborationRole.OWNER,
      CollaborationRole.EDITOR,
    ]);

    // Check if creator can delete their own contribution
    const isCreator = segment.creatorId === userId;
    if (!isCreator) {
      const collaborator = await this.collaboratorsRepository.findOne({
        where: { userId, storyId: segment.storyId },
      });

      if (collaborator && collaborator.role === CollaborationRole.CONTRIBUTOR) {
        throw new ForbiddenException('Contributors can only delete their own segments');
      }
    }

    const position = segment.position;

    // Delete the segment
    await this.segmentsRepository.remove(segment);

    // Reorder other segments
    await this.reorderSegmentsAfterDeletion(segment.storyId, position);
  }

  /**
   * Get all segments for a story
   * @param storyId - Story ID
   * @returns List of segments
   */
  async getStorySegments(storyId: string): Promise<StorySegment[]> {
    return this.segmentsRepository.find({
      where: { storyId },
      relations: ['creator', 'mediaAssets'],
      order: { position: 'ASC' },
    });
  }

  /**
   * Add media assets to a segment
   * @param segmentId - Segment ID
   * @param mediaAssetIds - Array of media asset IDs
   * @returns Updated segment
   */
  async addMediaToSegment(segmentId: string, mediaAssetIds: string[]): Promise<StorySegment> {
    const segment = await this.findSegmentById(segmentId);

    // Update media assets in the database
    for (const mediaId of mediaAssetIds) {
      await this.mediaRepository.update({ id: mediaId }, { segmentId: segment.id });
    }

    return this.findSegmentById(segmentId);
  }

  /**
   * Remove a media asset from a segment
   * @param segmentId - Segment ID
   * @param mediaAssetId - Media asset ID to remove
   */
  async removeMediaFromSegment(segmentId: string, mediaAssetId: string): Promise<void> {
    // Verify the media asset exists and belongs to the segment
    const mediaAsset = await this.mediaRepository.findOne({
      where: { id: mediaAssetId, segmentId },
    });

    if (!mediaAsset) {
      throw new NotFoundException('Media asset not found in this segment');
    }

    // Unlink the media asset from the segment
    await this.mediaRepository.update({ id: mediaAssetId }, { segmentId: undefined });
  }

  /**
   * Reorder segments after inserting a new one
   * @param storyId - Story ID
   * @param insertPosition - Position where a new segment was inserted
   */
  private async reorderSegmentsAfterInsertion(
    storyId: string,
    insertPosition: number,
  ): Promise<void> {
    await this.segmentsRepository
      .createQueryBuilder()
      .update(StorySegment)
      .set({
        position: () => 'position + 1',
      })
      .where('story_id = :storyId AND position >= :position', {
        storyId,
        position: insertPosition,
      })
      .andWhere(
        'id != (SELECT id FROM story_segments WHERE story_id = :storyId AND position = :position LIMIT 1)',
        {
          storyId,
          position: insertPosition,
        },
      )
      .execute();
  }

  /**
   * Reorder segments after deleting one
   * @param storyId - Story ID
   * @param deletedPosition - Position of the deleted segment
   */
  private async reorderSegmentsAfterDeletion(
    storyId: string,
    deletedPosition: number,
  ): Promise<void> {
    await this.segmentsRepository
      .createQueryBuilder()
      .update(StorySegment)
      .set({
        position: () => 'position - 1',
      })
      .where('story_id = :storyId AND position > :position', {
        storyId,
        position: deletedPosition,
      })
      .execute();
  }

  /**
   * Reorder segments after changing the position of one
   * @param storyId - Story ID
   * @param oldPosition - Original position
   * @param newPosition - New position
   */
  private async reorderSegmentsAfterPositionChange(
    storyId: string,
    oldPosition: number,
    newPosition: number,
  ): Promise<void> {
    if (oldPosition < newPosition) {
      // Moving a segment forward (e.g., 2 -> 5)
      // Decrement positions of segments between old+1 and new
      await this.segmentsRepository
        .createQueryBuilder()
        .update(StorySegment)
        .set({
          position: () => 'position - 1',
        })
        .where('story_id = :storyId AND position > :oldPos AND position <= :newPos', {
          storyId,
          oldPos: oldPosition,
          newPos: newPosition,
        })
        .execute();
    } else if (oldPosition > newPosition) {
      // Moving a segment backward (e.g., 5 -> 2)
      // Increment positions of segments between new and old-1
      await this.segmentsRepository
        .createQueryBuilder()
        .update(StorySegment)
        .set({
          position: () => 'position + 1',
        })
        .where('story_id = :storyId AND position >= :newPos AND position < :oldPos', {
          storyId,
          newPos: newPosition,
          oldPos: oldPosition,
        })
        .execute();
    }
  }
}
