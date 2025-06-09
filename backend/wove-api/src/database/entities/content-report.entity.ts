import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/**
 * Content report entity for tracking reported content
 */
@Entity('content_reports')
export class ContentReport extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  reporterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ type: 'uuid' })
  @Index()
  reportedContentId: string;

  @Column({ length: 50 })
  reportedContentType: string; // 'story', 'story_segment', 'media_asset', 'chat_message'

  @Column({ length: 50 })
  reasonCategory: string; // 'inappropriate', 'offensive', 'violent', 'spam', 'copyright', etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  evidenceData?: object;

  @Column({ length: 50, default: 'pending' })
  status: string; // 'pending', 'resolved', 'rejected'

  @Column({ type: 'uuid', nullable: true })
  @Index()
  reviewerId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: User;

  @Column({ type: 'text', nullable: true })
  reviewerNotes?: string;

  @Column({ nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  resolutionAction?: string;

  @Column({ nullable: true })
  resolutionDate?: Date;
}
