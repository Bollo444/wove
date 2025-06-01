import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/**
 * Parental link entity for managing parent-child relationships
 */
@Entity('parental_links')
export class ParentalLink extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  parentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: User;

  @Column({ type: 'uuid' })
  @Index()
  childId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'child_id' })
  child: User;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  monitoringEnabled: boolean;

  @Column({ default: false })
  contentApprovalRequired: boolean;

  @Column({ default: false })
  collaborationApprovalRequired: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'jsonb', default: {} })
  timeControls: object;

  @Column({ type: 'jsonb', default: {} })
  contentRestrictions: object;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  lastReviewAt?: Date;
}
