import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { User } from '../../../database/entities';
import { AgeTier } from '@shared/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Get a user by ID
   * @param id - User ID
   * @returns User object
   */
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Get a user by email
   * @param email - User email
   * @returns User object
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Get all users (with pagination)
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Paginated list of users
   */
  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  /**
   * Update a user's profile
   * @param id - User ID
   * @param updateData - User data to update
   * @returns Updated user object
   */
  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    // Ensure we don't update sensitive fields
    const {
      password,
      email,
      refreshToken,
      isActive,
      isSuspended,
      roles,
      ...safeUpdateData
    } = // Corrected passwordHash to password, added roles
      updateData;

    const userToUpdate = await this.findById(id);

    // Apply updates
    const updatedUser = this.usersRepository.merge(userToUpdate, safeUpdateData);

    // Save the updated user
    return this.usersRepository.save(updatedUser);
  }

  /**
   * Update a user's age tier (admin or verification use only)
   * @param id - User ID
   * @param ageTier - New age tier
   * @returns Updated user
   */
  async updateUserAgeTier(id: string, ageTier: AgeTier): Promise<User> {
    const user = await this.findById(id);

    user.verifiedAgeTier = ageTier;
    user.currentAgeTier = ageTier;

    return this.usersRepository.save(user);
  }

  /**
   * Deactivate a user account
   * @param id - User ID
   * @returns Deactivated user
   */
  async deactivateUser(id: string): Promise<User> {
    const user = await this.findById(id);

    user.isActive = false;

    return this.usersRepository.save(user);
  }

  /**
   * Reactivate a user account
   * @param id - User ID
   * @returns Reactivated user
   */
  async reactivateUser(id: string): Promise<User> {
    const user = await this.findById(id);

    user.isActive = true;

    return this.usersRepository.save(user);
  }

  /**
   * Get users by verified age tier
   * @param ageTier - Age tier to filter by
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Paginated list of users
   */
  async findByAgeTier(
    ageTier: AgeTier,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      where: { verifiedAgeTier: ageTier },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  /**
   * Search users by username or email
   * @param query - Search query
   * @param page - Page number
   * @param limit - Number of items per page
   * @returns Paginated list of users
   */
  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      where: [
        { username: Raw(alias => `LOWER(${alias}) LIKE '%${query.toLowerCase()}%'`) },
        { email: Raw(alias => `LOWER(${alias}) LIKE '%${query.toLowerCase()}%'`) },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }

  /**
   * Placeholder for exporting user data for GDPR/CCPA compliance.
   * @param userId The ID of the user whose data is to be exported.
   * @returns A data structure or file containing the user's data.
   */
  async exportUserData(userId: string): Promise<any> {
    const user = await this.findById(userId); // findById already throws NotFoundException

    // In a real application, you would gather data from various services:
    // - User profile
    // - Stories created/collaborated on (metadata, not necessarily full content unless requested)
    // - Digital books
    // - Activity logs (logins, significant actions)
    // - Parental links, consents
    // - Etc.
    // This data would then be compiled into a machine-readable format (e.g., JSON).

    const userDataExport = {
      profile: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        roles: user.roles, // Corrected role to roles
        // ageTier: user.ageTier, // Removed, use currentAgeTier and verifiedAgeTier
        currentAgeTier: user.currentAgeTier,
        verifiedAgeTier: user.verifiedAgeTier,
        isAgeVerified: user.isAgeVerified, // Corrected isVerified to isAgeVerified
        isActive: user.isActive,
        isSuspended: user.isSuspended,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Be careful about exporting sensitive info like lastLoginAt, ipAddress, etc.
      },
      // Placeholder for other data sections
      // Example: Fetch stories this user created
      // storiesCreated: await this.storyRepository.find({ where: { creatorId: userId }, select: ['id', 'title', 'createdAt']}),
      // Example: Fetch collaborations
      // collaborations: await this.collaboratorRepository.find({ where: { userId }, relations: ['story'], select: [...] })
      // For now, just illustrative strings:
      stories: `Data for stories created/collaborated by user ${userId} would be compiled here.`,
      activity: `Activity log for user ${userId} would be compiled here.`,
    };

    // For now, just return the structured object.
    // In a real scenario, this might generate a JSON file for download.
    return userDataExport;
  }
}
