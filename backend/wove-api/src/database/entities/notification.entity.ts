import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/**
 * Notification entity for tracking user notifications
 */
@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  type: string; // 'collaboration_invite', 'comment', 'like', 'story', 'parental', etc.

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, length: 500 })
  actionUrl?: string;

  @Column({ nullable: true, length: 100 })
  actionText?: string;

  @Column('simple-array', { nullable: true })
  ageTierRelevant?: string[];

  @Column({ type: 'jsonb', default: {} })
  data: object; // Additional structured data related to notification

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;

  @Column({ length: 50, nullable: true })
  relatedEntityType?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'medium' })
  priority: string; // 'high', 'medium', 'low'

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt?: Date;

  @Column({ default: false })
  requiresAction: boolean;

  @Column({ default: false })
  deleted: boolean;
}
