import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
import { User } from './user.entity';
import { CollaborationRole } from '@shared/types';

/**
 * Story collaborator entity for managing users collaborating on stories
 */
@Entity('story_collaborators')
@Unique(['storyId', 'userId'])
export class StoryCollaborator extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CollaborationRole,
    default: CollaborationRole.READER,
  })
  role: CollaborationRole;

  @Column({ default: false })
  invitationAccepted: boolean;

  @Column({ nullable: true })
  invitationAcceptedAt?: Date;

  @Column({ nullable: true })
  lastContributedAt?: Date;

  @Column({ type: 'integer', default: 0 })
  contributionCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  needsParentalApproval: boolean;

  @Column({ default: false })
  parentalApproved: boolean;

  @Column({ nullable: true })
  parentalApprovedAt?: Date;
}
