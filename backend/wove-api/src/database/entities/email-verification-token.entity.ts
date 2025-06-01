import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum VerificationTokenType {
  PARENTAL_CONSENT = 'parental_consent',
  EMAIL_VERIFICATION = 'email_verification', // For general user email verification
  PASSWORD_RESET = 'password_reset',
}

@Entity('email_verification_tokens')
@Index(['token', 'type'], { unique: true })
export class EmailVerificationToken extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  userId: string; // The user whose email/action is being verified, or the child user for parental consent

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  @Index()
  emailToVerify: string; // The email address to which the verification was sent (e.g., parent's email)

  @Column({ length: 255, unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: VerificationTokenType,
    default: VerificationTokenType.EMAIL_VERIFICATION,
  })
  type: VerificationTokenType;

  @Column({ type: 'timestamp with time zone' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  usedAt?: Date;
}
