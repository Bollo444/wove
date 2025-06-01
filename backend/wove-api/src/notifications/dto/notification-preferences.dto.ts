import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class NotificationPreferencesDto {
  @IsBoolean()
  emailNotifications: boolean;

  @IsBoolean()
  pushNotifications: boolean;

  @IsBoolean()
  storyUpdates: boolean;

  @IsBoolean()
  collaborationInvites: boolean;

  @IsBoolean()
  parentalAlerts: boolean;

  @IsBoolean()
  systemAnnouncements: boolean;
}

export class CreateNotificationPreferencesDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  storyUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  collaborationInvites?: boolean;

  @IsOptional()
  @IsBoolean()
  parentalAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  systemAnnouncements?: boolean;
}

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  storyUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  collaborationInvites?: boolean;

  @IsOptional()
  @IsBoolean()
  parentalAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  systemAnnouncements?: boolean;
}