import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * Story premise entity for predefined story ideas users can start from
 */
@Entity('story_premises')
export class StoryPremise extends BaseEntity {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  prompt: string;

  @Column({ type: 'text', nullable: true })
  coverImageUrl?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: 'general',
  })
  @Index()
  category?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @Index()
  genre?: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'jsonb', default: {} })
  suggestedCharacters: object;

  @Column({ type: 'jsonb', default: {} })
  suggestedSettings: object;

  @Column({ type: 'jsonb', default: {} })
  suggestedPlotPoints: object;

  @Column({ type: 'integer', default: 0 })
  usageCount: number;

  @Column({ type: 'integer', default: 0 })
  ratingSum: number;

  @Column({ type: 'integer', default: 0 })
  ratingCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy?: string;

  @Column({ type: 'jsonb', default: {} })
  ageAppropriateSettings: object;
}
