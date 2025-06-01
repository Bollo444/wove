import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';
import { AgeTier } from '@shared/types';
import { CreateNotificationDto, NotificationType, NotificationPriority } from './dto/create-notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;
  let userRepository: Repository<User>;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(getRepositoryToken(Notification));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification successfully', async () => {
      const createNotificationDto: CreateNotificationDto = {
        userId: 'user-123',
        type: NotificationType.STORY,
        title: 'New Story Available',
        content: 'A new story has been published!',
        priority: NotificationPriority.MEDIUM,
      };

      const mockNotification = {
        id: 'notification-123',
        ...createNotificationDto,
        isRead: false,
        isActive: true,
        createdAt: new Date(),
      };

      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await service.create(createNotificationDto);

      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        isRead: false,
        isActive: true,
      });
      expect(mockNotificationRepository.save).toHaveBeenCalledWith(mockNotification);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('createStoryNotification', () => {
    it('should create a story notification with age-appropriate content', async () => {
      const mockUser = {
        id: 'user-123',
        ageTier: AgeTier.KIDS,
      };

      const mockNotification = {
        id: 'notification-123',
        userId: 'user-123',
        type: NotificationType.STORY,
        title: 'New Story!',
        content: 'A fun new story is ready for you!',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await service.createStoryNotification(
        'user-123',
        'story-123',
        'Adventure Story',
        'story_published'
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const mockNotification = {
        id: 'notification-123',
        userId: 'user-123',
        isRead: false,
      };

      mockNotificationRepository.findOne.mockResolvedValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue({
        ...mockNotification,
        isRead: true,
        readAt: new Date(),
      });

      const result = await service.markAsRead('notification-123', 'user-123');

      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'notification-123', userId: 'user-123' },
      });
      expect(result.isRead).toBe(true);
      expect(result.readAt).toBeDefined();
    });
  });

  describe('getUnreadCount', () => {
    it('should return the count of unread notifications', async () => {
      const mockNotifications = [
        { id: '1', isRead: false },
        { id: '2', isRead: false },
        { id: '3', isRead: false },
      ];

      mockNotificationRepository.find.mockResolvedValue(mockNotifications);

      const result = await service.getUnreadCount('user-123');

      expect(mockNotificationRepository.find).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          isRead: false,
          isActive: true,
          deleted: false,
        },
      });
      expect(result).toBe(3);
    });
  });

  describe('cleanupExpiredNotifications', () => {
    it('should mark expired notifications as deleted', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 5 }),
      };

      mockNotificationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.cleanupExpiredNotifications();

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(Notification);
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        deleted: true,
        deletedAt: expect.any(Date),
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('expiresAt < :expiredDate', {
        expiredDate: expect.any(Date),
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('deleted = :deleted', {
        deleted: false,
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});