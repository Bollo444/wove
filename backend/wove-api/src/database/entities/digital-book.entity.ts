import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
import { User } from './user.entity';

/**
 * Digital book entity representing compiled stories that can be viewed as books
 */
@Entity('digital_books')
export class DigitalBook extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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

  @Column({ type: 'text', nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'jsonb', default: {} })
  bookSettings: object;

  @Column({ type: 'jsonb', default: {} })
  layoutSettings: object;

  @Column({ type: 'jsonb', default: {} })
  chapterConfiguration: object;

  @Column({ type: 'varchar', array: true, default: '{}' })
  contributors: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  genre?: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'boolean', default: false })
  allowDownload: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  downloadUrl?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  downloadFormat?: string;

  @Column({ nullable: true })
  lastExportedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  compiledAt?: Date;

  @Column({ type: 'jsonb', nullable: true }) // Store structured book content (pages, chapters, etc.)
  compiledContent?: any; // Define a more specific interface for this later

  @Column({ type: 'int', nullable: true })
  pageCount?: number;
}
