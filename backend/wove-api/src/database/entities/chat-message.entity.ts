import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Story } from './story.entity';

/**
 * Chat message entity for tracking messages in collaborative storytelling
 */
@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  storyId: string;

  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'story_id' })
  story: Story;

  @Column({ type: 'uuid' })
  @Index()
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  recipientId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient?: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isSystemMessage: boolean;

  @Column({ type: 'varchar', length: 50, default: 'chat' })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  readAt?: Date;
}
