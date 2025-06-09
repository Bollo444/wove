import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { User, ParentalLink, Story, StoryCollaborator } from '../../../database/entities';
import { AgeTier } from '@shared/types';

@Injectable()
export class ParentalControlService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ParentalLink)
    private parentalLinkRepository: Repository<ParentalLink>,
  ) {}

  /**
   * Create a parental link between a parent and a child account
   * @param parentId - Parent user ID
   * @param childEmail - Child user email
   * @returns Created parental link
   */
  async createParentalLink(parentId: string, childEmail: string): Promise<ParentalLink> {
    // Find the parent user
    const parent = await this.usersRepository.findOne({ where: { id: parentId } });
    if (!parent) {
      throw new NotFoundException('Parent user not found');
    }

    // Verify parent is an adult
    if (parent.verifiedAgeTier !== AgeTier.ADULTS) {
      throw new BadRequestException('Only adult users can be parents');
    }

    // Find the child user
    const child = await this.usersRepository.findOne({ where: { email: childEmail } });
    if (!child) {
      throw new NotFoundException('Child user not found');
    }

    // Ensure child account is actually for a child or teen
    if (child.verifiedAgeTier === AgeTier.ADULTS) {
      throw new BadRequestException('Cannot link to an adult account');
    }

    // Check if link already exists
    const existingLink = await this.parentalLinkRepository.findOne({
      where: { parentId, childId: child.id },
    });

    if (existingLink) {
      throw new BadRequestException('Parental link already exists');
    }

    // Create the parental link
    const parentalLink = new ParentalLink();
    parentalLink.parentId = parentId;
    parentalLink.childId = child.id;
    parentalLink.isApproved = false; // Needs to be approved by the child/teen

    return this.parentalLinkRepository.save(parentalLink);
  }

  /**
   * Approve a pending parental link request
   * @param childId - Child user ID
   * @param linkId - Parental link ID
   * @returns Updated parental link
   */
  async approveParentalLink(childId: string, linkId: string): Promise<ParentalLink> {
    const link = await this.parentalLinkRepository.findOne({
      where: { id: linkId, childId },
      relations: ['parent', 'child'],
    });

    if (!link) {
      throw new NotFoundException('Parental link request not found');
    }

    if (link.isApproved) {
      throw new BadRequestException('Link is already approved');
    }

    link.isApproved = true;
    link.approvedAt = new Date();

    return this.parentalLinkRepository.save(link);
  }

  /**
   * Reject a pending parental link request
   * @param childId - Child user ID
   * @param linkId - Parental link ID
   */
  async rejectParentalLink(childId: string, linkId: string): Promise<void> {
    const link = await this.parentalLinkRepository.findOne({
      where: { id: linkId, childId, isApproved: false },
    });

    if (!link) {
      throw new NotFoundException('Parental link request not found');
    }

    await this.parentalLinkRepository.remove(link);
  }

  /**
   * Remove an existing parental link
   * @param userId - User ID (either parent or child)
   * @param linkId - Parental link ID
   */
  async removeParentalLink(userId: string, linkId: string): Promise<void> {
    const link = await this.parentalLinkRepository.findOne({
      where: [
        { id: linkId, parentId: userId },
        { id: linkId, childId: userId },
      ],
    });

    if (!link) {
      throw new NotFoundException('Parental link not found');
    }

    await this.parentalLinkRepository.remove(link);
  }

  /**
   * Get all children linked to a parent
   * @param parentId - Parent user ID
   * @returns List of children with link information
   */
  async getLinkedChildren(parentId: string): Promise<{ child: User; link: ParentalLink }[]> {
    const links = await this.parentalLinkRepository.find({
      where: { parentId, isApproved: true },
      relations: ['child'],
    });

    return links.map(link => ({
      child: link.child,
      link: link,
    }));
  }

  /**
   * Get all parents linked to a child
   * @param childId - Child user ID
   * @returns List of parents with link information
   */
  async getLinkedParents(childId: string): Promise<{ parent: User; link: ParentalLink }[]> {
    const links = await this.parentalLinkRepository.find({
      where: { childId, isApproved: true },
      relations: ['parent'],
    });

    return links.map(link => ({
      parent: link.parent,
      link: link,
    }));
  }

  /**
   * Get pending parental link requests for a user
   * @param userId - User ID
   * @returns List of pending links
   */
  async getPendingLinkRequests(userId: string): Promise<ParentalLink[]> {
    return this.parentalLinkRepository.find({
      where: [
        { childId: userId, isApproved: false },
        { parentId: userId, isApproved: false },
      ],
      relations: ['parent', 'child'],
    });
  }

  /**
   * Update content restrictions for a child
   * @param parentId - Parent user ID
   * @param childId - Child user ID
   * @param restrictions - Content restrictions to apply
   * @returns Updated child user
   */
  async updateContentRestrictions(
    parentId: string,
    childId: string,
    restrictions: {
      allowedContentCategories?: string[];
      restrictedTopics?: string[];
      maxContentRating?: string;
      requireApprovalForPublishing?: boolean;
      requireApprovalForCollaboration?: boolean;
    },
  ): Promise<User> {
    // Verify parental link exists and is approved
    const link = await this.parentalLinkRepository.findOne({
      where: { parentId, childId, isApproved: true },
    });

    if (!link) {
      throw new ForbiddenException("You do not have permission to modify this child's settings");
    }

    const child = await this.usersRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Child user not found');
    }

    // Update restrictions
    if (!child.contentRestrictions) {
      child.contentRestrictions = {};
    }

    child.contentRestrictions = {
      ...child.contentRestrictions,
      ...restrictions,
    };

    return this.usersRepository.save(child);
  }

  /**
   * Set daily usage time limits for a child account
   * @param parentId - Parent user ID
   * @param childId - Child user ID
   * @param timeLimit - Daily time limit in minutes
   * @returns Updated child user
   */
  async setUsageTimeLimit(parentId: string, childId: string, timeLimit: number): Promise<User> {
    // Verify parental link exists and is approved
    const link = await this.parentalLinkRepository.findOne({
      where: { parentId, childId, isApproved: true },
    });

    if (!link) {
      throw new ForbiddenException("You do not have permission to modify this child's settings");
    }

    const child = await this.usersRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Child user not found');
    }

    // Update time limit
    if (!child.usageControls) {
      child.usageControls = {};
    }

    child.usageControls = {
      ...child.usageControls,
      dailyTimeLimit: timeLimit,
    };

    return this.usersRepository.save(child);
  }

  /**
   * Set usage schedule for child account (allowed days/hours)
   * @param parentId - Parent user ID
   * @param childId - Child user ID
   * @param schedule - Usage schedule
   * @returns Updated child user
   */
  async setUsageSchedule(
    parentId: string,
    childId: string,
    schedule: {
      allowedDays?: number[]; // 0-6 (Sunday-Saturday)
      allowedHourRanges?: { start: number; end: number }[]; // 0-23
    },
  ): Promise<User> {
    // Verify parental link exists and is approved
    const link = await this.parentalLinkRepository.findOne({
      where: { parentId, childId, isApproved: true },
    });

    if (!link) {
      throw new ForbiddenException("You do not have permission to modify this child's settings");
    }

    const child = await this.usersRepository.findOne({ where: { id: childId } });
    if (!child) {
      throw new NotFoundException('Child user not found');
    }

    // Update schedule
    if (!child.usageControls) {
      child.usageControls = {};
    }

    child.usageControls = {
      ...child.usageControls,
      ...schedule,
    };

    return this.usersRepository.save(child);
  }
}
