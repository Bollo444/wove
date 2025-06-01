import { IsOptional, IsBoolean, IsString, IsEnum, IsArray, IsObject, IsDateString } from 'class-validator';
import { NotificationType, NotificationPriority } from './create-notification.dto';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

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

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}