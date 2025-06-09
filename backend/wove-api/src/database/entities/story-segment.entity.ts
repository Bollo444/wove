import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
import { User } from './user.entity';
import { MediaAsset } from './media-asset.entity';
// Removed direct import to avoid circular dependency - using string references instead

/**
 * Story segment entity representing individual parts of a story
 */
@Entity('story_segments')
export class StorySegment extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'uuid' })
  @Index()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  aiPrompt?: object;

  @Column({ type: 'boolean', default: false })
  isAiGenerated: boolean;

  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mood?: string;

  @Column({ type: 'jsonb', default: {} })
  mediaSettings: object;

  @OneToMany(() => MediaAsset, mediaAsset => mediaAsset.segment)
  mediaAssets: MediaAsset[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  videoUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  audioUrl?: string;

  @Column({ type: 'jsonb', default: {} })
  visualEffects: object;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  // If this segment is the *source* of a branch point (i.e., choices appear AFTER this segment)
  @OneToMany('StoryBranchPoint', 'sourceSegment')
  leadsToBranchPoints?: any[];

  // If this segment is the *result* of a choice (i.e., it's the start of a new branch)
  @OneToMany('StoryChoiceOption', 'targetSegment')
  originatesFromChoiceOptions?: any[];

  // Optional: to directly link a segment to its parent if it's part of a linear continuation from a choice
  // This helps trace a specific path taken.
  @Column({ type: 'uuid', nullable: true })
  parentChoiceOptionId?: string;

  @ManyToOne('StoryChoiceOption', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_choice_option_id' })
  parentChoiceOption?: any;
}
