import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity'; // A plot point might be linked to a specific segment

@Entity('story_plot_points')
@Index(['storyId', 'summary']) // Index for quick lookups
export class StoryPlotPoint extends BaseEntity {
  @Column({ type: 'uuid' })
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  // Optional: Link to the segment where this plot point occurs or is established
  @Column({ type: 'uuid', nullable: true })
  triggeringSegmentId?: string;

  @ManyToOne(() => StorySegment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'triggering_segment_id' })
  triggeringSegment?: StorySegment;

  @Column({ length: 255 })
  summary: string; // A brief summary of the plot point, e.g., "Character X finds the magic sword"

  @Column({ type: 'text', nullable: true })
  details?: string; // More detailed description or implications of the plot point

  @Column({ type: 'int' }) // To order plot points chronologically if needed, or segment position can be used
  sequence: number;

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[]; // e.g., ["turning_point", "character_development_X", "new_goal"]

  @Column({ type: 'jsonb', nullable: true })
  impactedCharacters?: string[]; // Array of StoryCharacter IDs impacted by this plot point

  @Column({ type: 'varchar', length: 50, nullable: true }) // e.g., 'active', 'resolved', 'foreshadowed', 'missed'
  status?: string;

  // Add other fields like 'decisionMade', 'consequences', 'foreshadowingFor', etc.
}
