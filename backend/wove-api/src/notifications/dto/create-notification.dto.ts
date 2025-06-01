import { IsString, IsOptional, IsEnum, IsArray, IsObject, IsDateString } from 'class-validator';

export enum NotificationType {
  STORY = 'story',
  COLLABORATION = 'collaboration',
  SOCIAL = 'social',
  PARENTAL = 'parental',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  type: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: string;

  @IsOptional()
  @IsString()
  actionUrl?: string;

  @IsOptional()
  @IsString()
  actionText?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ageTierRelevant?: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  requiresAction?: boolean;
}