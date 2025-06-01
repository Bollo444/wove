import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity';

/**
 * Media asset entity for tracking media files associated with stories
 */
@Entity('media_assets')
export class MediaAsset extends BaseEntity {
  @Column({ length: 50 })
  type: string; // 'image', 'video', 'audio'

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'text', nullable: true })
  prompt?: string;

  @Column({ type: 'text', nullable: true }) // Added altText
  altText?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Column({ type: 'uuid' })
  @Index()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ type: 'uuid' })
  @Index()
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  segmentId?: string;

  @ManyToOne(() => StorySegment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'segment_id' })
  segment?: StorySegment;

  @Column({ type: 'integer', default: 0 })
  width: number;

  @Column({ type: 'integer', default: 0 })
  height: number;

  @Column({ type: 'integer', default: 0 })
  duration: number; // in seconds for video/audio

  @Column({ type: 'integer', default: 0 })
  size: number; // in bytes

  @Column({ type: 'varchar', length: 255, nullable: true })
  originalFilename?: string;

  @Column({ type: 'boolean', default: true })
  isAiGenerated: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
