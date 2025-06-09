import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import {
  VerificationMethod,
  VerificationStatus,
} from '@shared/types';

/**
 * Age verification request entity for tracking verification attempts
 */
@Entity('age_verification_requests')
export class AgeVerificationRequest extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: VerificationMethod,
  })
  method: VerificationMethod;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  verificationData?: object;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
