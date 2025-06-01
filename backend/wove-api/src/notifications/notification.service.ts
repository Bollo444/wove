import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';
import { AgeTier } from '@shared/types';

@Injectable()
export class NotificationService {
  private notificationGateway: any; // Will be injected after module initialization

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Set the notification gateway for real-time delivery
   * This is called after module initialization to avoid circular dependency
   */
  setNotificationGateway(gateway: any) {
    this.notificationGateway = gateway;
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    notification.isRead = false;
    notification.isActive = true;
    
    const savedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time notification if gateway is available
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(
        savedNotification.userId,
        savedNotification
      );
    }
    
    return savedNotification;
  }

  async findAllForUser(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: string;
    }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where: FindOptionsWhere<Notification> = {
      userId,
      deleted: false,
    };

    if (options?.unreadOnly) {
      where.isRead = false;
    }

    if (options?.type) {
      where.type = options.type;
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    });

    return { notifications, total };
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId, deleted: false },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne(id, userId);
    
    notification.isRead = true;
    notification.readAt = new Date();
    
    const updatedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time update for read status
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationUpdate(userId, {
        type: 'notification_read',
        notificationId: id,
        unreadCount: await this.getUnreadCount(userId)
      });
    }
    
    return updatedNotification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false, deleted: false },
      { isRead: true, readAt: new Date() }
    );
      
    // Send real-time update for all read
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationUpdate(userId, {
        type: 'all_notifications_read',
        unreadCount: 0
      });
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.findOne(id, userId);
    
    notification.deleted = true;
    notification.deletedAt = new Date();
    
    await this.notificationRepository.save(notification);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepository.count({
      where: {
        userId,
        isRead: false,
        deleted: false,
      },
    });
  }

  async createStoryNotification(
    userId: string,
    storyId: string,
    storyTitle: string,
    type: 'new_chapter' | 'collaboration_invite' | 'story_published'
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notificationData = this.getStoryNotificationData(type, storyTitle, storyId, user.currentAgeTier);
    
    const notification = this.notificationRepository.create({
      userId,
      type: 'story',
      title: notificationData.title,
      content: notificationData.content,
      actionUrl: notificationData.actionUrl,
      actionText: notificationData.actionText,
      ageTierRelevant: notificationData.ageTierRelevant,
      priority: notificationData.priority,
      data: { storyId, storyTitle, notificationType: type },
      isRead: false,
      isActive: true,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time notification
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, savedNotification);
    }
    
    return savedNotification;
  }

  async createCollaborationNotification(
    userId: string,
    inviterName: string,
    storyTitle: string,
    collaborationId: string
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const content = this.getAgeAppropriateContent(
      user.currentAgeTier,
      {
        kids: `${inviterName} wants to write a story with you! The story is called "${storyTitle}".`,
        teens: `${inviterName} invited you to collaborate on "${storyTitle}".`,
        adults: `${inviterName} has invited you to collaborate on the story "${storyTitle}".`,
      }
    );

    const notification = this.notificationRepository.create({
      userId,
      type: 'collaboration',
      title: 'Collaboration Invite',
      content,
      actionUrl: `/collaborate/${collaborationId}`,
      actionText: 'View Invite',
      priority: 'high',
      data: { collaborationId, inviterName, storyTitle },
      isRead: false,
      isActive: true,
    });
    
    const savedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time notification
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, savedNotification);
    }
    
    return savedNotification;
  }

  async createParentalNotification(
    userId: string,
    type: 'approval_required' | 'content_flagged' | 'time_limit_warning',
    details: Record<string, any>
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notificationData = this.getParentalNotificationData(type, details, user.currentAgeTier);
    
    const notification = this.notificationRepository.create({
      userId,
      type: 'parental',
      title: notificationData.title,
      content: notificationData.content,
      actionUrl: notificationData.actionUrl,
      actionText: notificationData.actionText,
      ageTierRelevant: ['kids', 'teens'],
      priority: 'high',
      data: { parentalNotificationType: type, ...details },
      isRead: false,
      isActive: true,
    });
    
    const savedNotification = await this.notificationRepository.save(notification);
    
    // Send real-time notification
    if (this.notificationGateway) {
      await this.notificationGateway.sendNotificationToUser(userId, savedNotification);
    }
    
    return savedNotification;
  }

  private getStoryNotificationData(
    type: string,
    storyTitle: string,
    storyId: string,
    ageTier: AgeTier
  ) {
    switch (type) {
      case 'new_chapter':
        return {
          title: 'New Chapter Available!',
          content: this.getAgeAppropriateContent(ageTier, {
            kids: `There's a new chapter in your story "${storyTitle}"! 📖`,
            teens: `A new chapter has been added to "${storyTitle}".`,
            adults: `New chapter available in "${storyTitle}".`,
          }),
          actionUrl: `/story/${storyId}`,
          actionText: 'Read Chapter',
          ageTierRelevant: ['kids', 'teens', 'adults'],
          priority: 'medium' as const,
        };
      case 'story_published':
        return {
          title: 'Story Published!',
          content: this.getAgeAppropriateContent(ageTier, {
            kids: `Your story "${storyTitle}" is now published! 🎉`,
            teens: `"${storyTitle}" has been successfully published.`,
            adults: `Your story "${storyTitle}" has been published and is now live.`,
          }),
          actionUrl: `/story/${storyId}`,
          actionText: 'View Story',
          ageTierRelevant: ['kids', 'teens', 'adults'],
          priority: 'low' as const,
        };
      default:
        return {
          title: 'Story Update',
          content: `Update for "${storyTitle}".`,
          actionUrl: `/story/${storyId}`,
          actionText: 'View',
          ageTierRelevant: ['kids', 'teens', 'adults'],
          priority: 'medium' as const,
        };
    }
  }

  private getParentalNotificationData(
    type: string,
    details: Record<string, any>,
    ageTier: AgeTier
  ) {
    switch (type) {
      case 'approval_required':
        return {
          title: 'Parent Approval Needed',
          content: this.getAgeAppropriateContent(ageTier, {
            kids: 'Your parent needs to approve something before you can continue.',
            teens: 'Parental approval is required for this action.',
            adults: 'Parental approval required.',
          }),
          actionUrl: '/parental-controls',
          actionText: 'View Details',
        };
      case 'content_flagged':
        return {
          title: 'Content Review',
          content: this.getAgeAppropriateContent(ageTier, {
            kids: 'A grown-up needs to check something you wrote.',
            teens: 'Your content is being reviewed for safety.',
            adults: 'Content flagged for review.',
          }),
          actionUrl: '/safety/review',
          actionText: 'Learn More',
        };
      case 'time_limit_warning':
        return {
          title: 'Time Limit Reminder',
          content: this.getAgeAppropriateContent(ageTier, {
            kids: 'You have 10 more minutes before it\'s time to take a break!',
            teens: 'Approaching your daily time limit.',
            adults: 'Time limit notification.',
          }),
          actionUrl: '/settings/time-limits',
          actionText: 'Manage Time',
        };
      default:
        return {
          title: 'Parental Notification',
          content: 'A parental notification has been triggered.',
          actionUrl: '/parental-controls',
          actionText: 'View',
        };
    }
  }

  private getAgeAppropriateContent(
    ageTier: AgeTier,
    content: { kids?: string; teens?: string; adults?: string }
  ): string {
    switch (ageTier) {
      case AgeTier.KIDS:
        return content.kids || content.teens || content.adults || 'Notification';
      case AgeTier.TEENS:
        return content.teens || content.adults || content.kids || 'Notification';
      case AgeTier.ADULTS:
        return content.adults || content.teens || content.kids || 'Notification';
      default:
        return content.adults || content.teens || content.kids || 'Notification';
    }
  }

  // Notification preferences (stored in user metadata for now)
  async getNotificationPreferences(userId: string): Promise<NotificationPreferencesDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const preferences = user.metadata?.notificationPreferences || {};
    
    return {
      emailNotifications: preferences.emailNotifications ?? true,
      pushNotifications: preferences.pushNotifications ?? true,
      storyUpdates: preferences.storyUpdates ?? true,
      collaborationInvites: preferences.collaborationInvites ?? true,
      parentalAlerts: preferences.parentalAlerts ?? true,
      systemAnnouncements: preferences.systemAnnouncements ?? true,
    };
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferencesDto>
  ): Promise<NotificationPreferencesDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPreferences = user.metadata?.notificationPreferences || {};
    const updatedPreferences = { ...currentPreferences, ...preferences };
    
    user.metadata = {
      ...user.metadata,
      notificationPreferences: updatedPreferences,
    };
    
    await this.userRepository.save(user);
    
    return updatedPreferences;
  }

  async cleanupExpiredNotifications(): Promise<void> {
    const expiredDate = new Date();
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({
        deleted: true,
        deletedAt: new Date(),
      })
      .where('expiresAt < :expiredDate', { expiredDate })
      .andWhere('deleted = :deleted', { deleted: false })
      .execute();
  }
}