import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Story } from './story.entity';
// import { User } from './user.entity'; // If characters can be linked to user accounts (e.g., player characters)

@Entity('story_characters')
@Index(['storyId', 'name'], { unique: true }) // Ensure character names are unique within a story
export class StoryCharacter extends BaseEntity {
  @Column({ type: 'uuid' })
  storyId: string;

  @ManyToOne(() => Story, story => story.characters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Physical appearance, personality traits

  @Column({ type: 'text', nullable: true })
  backstory?: string;

  @Column({ type: 'jsonb', nullable: true })
  relationships?: Record<string, string>; // e.g., { "characterId1": "ally", "characterId2": "rival" }

  @Column({ type: 'jsonb', nullable: true })
  knowledge?: string[]; // List of key facts or secrets the character knows

  @Column({ type: 'boolean', default: true })
  isActiveInStory: boolean; // If the character is currently active or has been written out

  // If a character can be controlled by a user in a collaborative story
  // @Column({ type: 'uuid', nullable: true })
  // controllingUserId?: string;

  // @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'controlling_user_id' })
  // controllingUser?: User;

  // Add other fields like motivations, goals, current state, inventory, etc.
}
