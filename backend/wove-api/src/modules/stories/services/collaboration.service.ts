import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Story, StoryCollaborator, User } from '../../../database/entities';
import { CollaborationRole } from '@shared/types';
import { StoryService } from './story.service';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(StoryCollaborator)
    private collaboratorsRepository: Repository<StoryCollaborator>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private storyService: StoryService,
  ) {}

  /**
   * Get all collaborators for a story
   * @param storyId - Story ID
   * @returns List of collaborators with user details
   */
  async getCollaborators(storyId: string): Promise<StoryCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { storyId },
      relations: ['user'],
      order: { role: 'ASC' },
    });
  }

  /**
   * Invite a user to collaborate on a story
   * @param inviterUserId - ID of user sending the invitation
   * @param storyId - Story ID
   * @param userEmail - Email of user to invite
   * @param role - Collaboration role to assign
   * @returns Created collaborator record
   */
  async inviteCollaborator(
    inviterUserId: string,
    storyId: string,
    userEmail: string,
    role: CollaborationRole,
  ): Promise<StoryCollaborator> {
    // Check if inviter has permission to invite collaborators (must be owner)
    await this.storyService.verifyUserPermission(inviterUserId, storyId, [CollaborationRole.OWNER]);

    // Find the user by email
    const invitedUser = await this.usersRepository.findOne({ where: { email: userEmail } });
    if (!invitedUser) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    // Check if user is already a collaborator
    const existingCollaborator = await this.collaboratorsRepository.findOne({
      where: { storyId, userId: invitedUser.id },
    });

    if (existingCollaborator) {
      throw new BadRequestException('User is already a collaborator on this story');
    }

    // Create new collaborator with pending status
    const collaborator = new StoryCollaborator();
    collaborator.storyId = storyId;
    collaborator.userId = invitedUser.id;
    collaborator.role = role;
    collaborator.invitationAccepted = false;

    return this.collaboratorsRepository.save(collaborator);
  }

  /**
   * Accept a collaboration invitation
   * @param userId - User ID accepting the invitation
   * @param collaborationId - Collaboration record ID
   * @returns Updated collaborator record
   */
  async acceptInvitation(userId: string, collaborationId: string): Promise<StoryCollaborator> {
    const collaboration = await this.collaboratorsRepository.findOne({
      where: { id: collaborationId, userId, invitationAccepted: false },
    });

    if (!collaboration) {
      throw new NotFoundException('Collaboration invitation not found');
    }

    collaboration.invitationAccepted = true;
    collaboration.invitationAcceptedAt = new Date();

    return this.collaboratorsRepository.save(collaboration);
  }

  /**
   * Decline a collaboration invitation
   * @param userId - User ID declining the invitation
   * @param collaborationId - Collaboration record ID
   */
  async declineInvitation(userId: string, collaborationId: string): Promise<void> {
    const collaboration = await this.collaboratorsRepository.findOne({
      where: { id: collaborationId, userId, invitationAccepted: false },
    });

    if (!collaboration) {
      throw new NotFoundException('Collaboration invitation not found');
    }

    await this.collaboratorsRepository.remove(collaboration);
  }

  /**
   * Update a collaborator's role
   * @param updaterUserId - User ID making the update
   * @param collaborationId - Collaboration record ID
   * @param role - New role to assign
   * @returns Updated collaborator record
   */
  async updateCollaboratorRole(
    updaterUserId: string,
    collaborationId: string,
    role: CollaborationRole,
  ): Promise<StoryCollaborator> {
    const collaboration = await this.collaboratorsRepository.findOne({
      where: { id: collaborationId },
      relations: ['user'],
    });

    if (!collaboration) {
      throw new NotFoundException('Collaborator not found');
    }

    // Check if updater has permission (must be owner)
    await this.storyService.verifyUserPermission(updaterUserId, collaboration.storyId, [
      CollaborationRole.OWNER,
    ]);

    // Cannot change owner's role
    if (collaboration.role === CollaborationRole.OWNER) {
      throw new BadRequestException('Cannot change the role of the story owner');
    }

    collaboration.role = role;

    return this.collaboratorsRepository.save(collaboration);
  }

  /**
   * Remove a collaborator from a story
   * @param removerId - User ID initiating the removal
   * @param collaborationId - Collaboration record ID
   */
  async removeCollaborator(removerId: string, collaborationId: string): Promise<void> {
    const collaboration = await this.collaboratorsRepository.findOne({
      where: { id: collaborationId },
      relations: ['user'],
    });

    if (!collaboration) {
      throw new NotFoundException('Collaborator not found');
    }

    // Check if remover has permission (must be owner) OR is removing themselves
    const isOwner = await this.checkIsOwner(removerId, collaboration.storyId);
    const isSelf = removerId === collaboration.userId;

    if (!isOwner && !isSelf) {
      throw new ForbiddenException('You do not have permission to remove this collaborator');
    }

    // Cannot remove owner
    if (collaboration.role === CollaborationRole.OWNER && !isSelf) {
      throw new BadRequestException('Cannot remove the owner from the story');
    }

    await this.collaboratorsRepository.remove(collaboration);
  }

  /**
   * Transfer story ownership to another collaborator
   * @param currentOwnerId - Current owner's user ID
   * @param storyId - Story ID
   * @param newOwnerId - New owner's user ID
   * @returns Updated collaborator records
   */
  async transferOwnership(
    currentOwnerId: string,
    storyId: string,
    newOwnerId: string,
  ): Promise<StoryCollaborator[]> {
    // Verify current owner
    const currentOwnerCollaboration = await this.collaboratorsRepository.findOne({
      where: { userId: currentOwnerId, storyId, role: CollaborationRole.OWNER },
    });

    if (!currentOwnerCollaboration) {
      throw new ForbiddenException('You must be the owner to transfer ownership');
    }

    // Check if new owner exists as a collaborator
    const newOwnerCollaboration = await this.collaboratorsRepository.findOne({
      where: { userId: newOwnerId, storyId },
    });

    if (!newOwnerCollaboration) {
      throw new NotFoundException('New owner must be an existing collaborator');
    }

    // Update roles
    currentOwnerCollaboration.role = CollaborationRole.EDITOR;
    newOwnerCollaboration.role = CollaborationRole.OWNER;

    await this.collaboratorsRepository.save(currentOwnerCollaboration);
    await this.collaboratorsRepository.save(newOwnerCollaboration);

    return [currentOwnerCollaboration, newOwnerCollaboration];
  }

  /**
   * Get pending collaboration invitations for a user
   * @param userId - User ID
   * @returns List of pending invitations
   */
  async getPendingInvitations(userId: string): Promise<StoryCollaborator[]> {
    return this.collaboratorsRepository.find({
      where: { userId, invitationAccepted: false },
      relations: ['story', 'story.creator'],
    });
  }

  /**
   * Get stories a user is collaborating on
   * @param userId - User ID
   * @returns List of stories
   */
  async getCollaborativeStories(userId: string): Promise<Story[]> {
    const collaborations = await this.collaboratorsRepository.find({
      where: { userId, invitationAccepted: true },
    });

    const storyIds = collaborations.map(collab => collab.storyId);

    if (storyIds.length === 0) {
      return [];
    }

    return this.storiesRepository.find({
      where: { id: In(storyIds) },
      relations: ['creator'],
    });
  }

  /**
   * Helper method to check if a user is the owner of a story
   * @param userId - User ID
   * @param storyId - Story ID
   * @returns True if user is the owner
   */
  private async checkIsOwner(userId: string, storyId: string): Promise<boolean> {
    const collaboration = await this.collaboratorsRepository.findOne({
      where: { userId, storyId, role: CollaborationRole.OWNER },
    });

    return !!collaboration;
  }
}
