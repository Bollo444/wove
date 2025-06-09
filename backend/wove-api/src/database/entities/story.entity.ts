import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { StoryStatus, AgeTier } from '@shared/types';
import { StoryCharacter } from './story-character.entity';
import { StoryPlotPoint } from './story-plot-point.entity';
import { StoryBranchPoint } from './story-branch-point.entity';
import { StorySegment } from './story-segment.entity';
import { StoryCollaborator } from './story-collaborator.entity'; // Added StoryCollaborator for relation

/**
 * Story entity representing the main story container
 */
@Entity('stories')
export class Story extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  @Index()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({
    type: 'enum',
    enum: StoryStatus,
    default: StoryStatus.DRAFT,
  })
  status: StoryStatus;

  @Column({
    type: 'enum',
    enum: AgeTier,
    default: AgeTier.UNVERIFIED,
  })
  ageTier: AgeTier;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: false })
  isPremiseBased: boolean;

  @Column({ type: 'uuid', nullable: true })
  premiseId?: string;

  @Column({ default: false })
  allowCollaboration: boolean;

  @Column({ type: 'jsonb', default: {} })
  settings: {
    multimediaGenerationFrequency?: 'low' | 'medium' | 'high' | 'on_demand';
    allowedMediaTypes?: ('image' | 'audio_effect' | 'soundtrack' | 'video')[];
    preferredImageStyle?: string;
    preferredMusicGenre?: string;
    aiContributionMode?: 'none' | 'suggest' | 'co_write'; // For text generation
    defaultAIMode?: 'none' | 'suggest' | 'co_write'; // General AI mode for the story
    // Add other story-specific settings here
  };

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'ai_model' }) // For specific text generation model
  aiModel?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'ai_settings' }) // For model-specific parameters like temperature, top_p for this story
  aiSettings?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'uuid', array: true, default: '{}' })
  genreIds: string[];

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  // For collaborative stories, who's turn is it?
  @Column({ type: 'uuid', nullable: true })
  @Index()
  currentTurnUserId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_turn_user_id' })
  currentTurnUser?: User;

  // To track AI state or last processed segment for consistency
  @Column({ type: 'uuid', nullable: true })
  lastSegmentIdProcessedByAI?: string;

  // Could store a summary of the story state for quick AI context, generated periodically
  @Column({ type: 'text', nullable: true })
  aiContextSummary?: string;

  @OneToMany(() => StoryCharacter, character => character.story, { cascade: true })
  characters: StoryCharacter[];

  @OneToMany(() => StoryPlotPoint, plotPoint => plotPoint.story, { cascade: true })
  plotPoints: StoryPlotPoint[];

  @OneToMany(() => StoryBranchPoint, branchPoint => branchPoint.story, { cascade: true })
  branchPoints: StoryBranchPoint[];

  @OneToMany(() => StorySegment, segment => segment.story, { cascade: true })
  segments: StorySegment[];

  @OneToMany(() => StoryCollaborator, collaborator => collaborator.story, { cascade: true }) // Added relation to StoryCollaborator
  collaborators: StoryCollaborator[];

  @Column({ type: 'varchar', array: true, default: '{}', name: 'content_warnings' })
  contentWarnings: string[]; // e.g., ['violence', 'strong_language']
}
