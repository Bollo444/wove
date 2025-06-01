import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole, AgeTier } from '@shared/types';
import { Notification } from './notification.entity';

/**
 * User entity representing registered users in the system
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  @Index()
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255, nullable: true })
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({
    type: 'enum',
    enum: AgeTier,
    default: AgeTier.UNVERIFIED,
    name: 'current_age_tier',
  })
  currentAgeTier: AgeTier;

  @Column({
    type: 'enum',
    enum: AgeTier,
    default: AgeTier.UNVERIFIED,
    name: 'verified_age_tier',
  })
  verifiedAgeTier: AgeTier;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  isAgeVerified: boolean;

  @Column({ default: false })
  isParentalApprovalRequired: boolean;

  @Column({ default: false })
  hasParentalApproval: boolean;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ length: 255, nullable: true })
  parentEmail?: string;

  @Column({ default: false })
  parentalMonitoringEnabled: boolean;

  @Column({ type: 'enum', enum: UserRole, array: true, default: '{user}' })
  roles: UserRole[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSuspended: boolean;

  @Column({ type: 'text', select: false, nullable: true })
  refreshToken?: string;

  @Column({ default: 0 })
  loginAttempts: number;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  lastActiveAt?: Date;

  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  contentRestrictions: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  usageControls: Record<string, any>;

  // Google OAuth fields
  @Column({ length: 255, nullable: true })
  @Index()
  googleId?: string;

  @Column({ default: false })
  isGoogleLinked: boolean;

  @Column({ type: 'text', nullable: true, select: false })
  googleAccessToken?: string;

  @Column({ type: 'text', nullable: true, select: false })
  googleRefreshToken?: string;

  // Relationships
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
