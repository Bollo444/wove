import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
import { StorySegment } from './story-segment.entity';

/**
 * Represents a point in the story where a choice is made, leading to different branches.
 * The 'sourceSegment' is the segment immediately PRECEDING the choices.
 * Each 'choice' will then lead to a new 'targetSegmentId' which starts a new branch.
 */
@Entity('story_branch_points')
@Index(['storyId', 'sourceSegmentId'])
export class StoryBranchPoint extends BaseEntity {
  @Column({ type: 'uuid' })
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  // The segment after which the choice/branch occurs.
  @Column({ type: 'uuid' })
  sourceSegmentId: string;

  @ManyToOne(() => StorySegment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_segment_id' })
  sourceSegment: StorySegment;

  @Column({ type: 'text', nullable: true })
  promptText?: string; // e.g., "What does Elara do next?" displayed to the user/AI

  // Choices offered at this branch point
  @OneToMany(() => StoryChoiceOption, choiceOption => choiceOption.branchPoint, {
    cascade: true,
    eager: true,
  })
  options: StoryChoiceOption[];

  // If a choice has been made, this links to the option that was selected.
  @Column({ type: 'uuid', nullable: true })
  selectedOptionId?: string;

  // @ManyToOne(() => StoryChoiceOption, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'selected_option_id' })
  // selectedOption?: StoryChoiceOption; // This creates a circular dep if eager loaded, handle carefully

  @Column({ type: 'timestamp with time zone', nullable: true })
  resolvedAt?: Date; // When a choice was made
}

/**
 * Represents one specific choice/option at a branch point.
 */
@Entity('story_choice_options')
export class StoryChoiceOption extends BaseEntity {
  @Column({ type: 'uuid' })
  branchPointId: string;

  @ManyToOne(() => StoryBranchPoint, branchPoint => branchPoint.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'branch_point_id' })
  branchPoint: StoryBranchPoint;

  @Column({ type: 'text' })
  optionText: string; // e.g., "Enter the dark cave", "Turn back"

  // The segment that starts the narrative path if this option is chosen.
  // This segment would be created when the choice is defined or selected.
  @Column({ type: 'uuid', nullable: true })
  targetSegmentId?: string;

  @ManyToOne(() => StorySegment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_segment_id' })
  targetSegment?: StorySegment;

  @Column({ type: 'int', default: 0 }) // For ordering options if needed
  displayOrder: number;

  // Could add fields like 'aiHintForContinuation' if this choice is selected
}
