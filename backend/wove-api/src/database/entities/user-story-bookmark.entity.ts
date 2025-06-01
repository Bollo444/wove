import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Story } from './story.entity';

/**
 * User story bookmark entity for tracking bookmarked stories
 */
@Entity('user_story_bookmarks')
@Unique(['userId', 'storyId'])
export class UserStoryBookmark extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  @Index()
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', nullable: true })
  category?: string;

  @Column({ nullable: true })
  lastVisitedAt?: Date;

  @Column({ default: 0 })
  visitCount: number;

  @Column({ nullable: true })
  lastPosition?: number; // Progress saved for reading
}
