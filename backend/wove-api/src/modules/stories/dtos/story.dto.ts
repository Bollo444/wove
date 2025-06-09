import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { AgeTier } from '@shared/types';
import { StoryStatus, CollaborationRole } from '@shared/types';

export class CreateStoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  // @IsUrl() // Consider adding if you want to validate URL format
  coverImageUrl?: string;

  @IsEnum(AgeTier)
  ageTier: AgeTier;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];

  @IsOptional()
  @IsUUID()
  premiseId?: string;
}

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  // @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(AgeTier)
  ageTier?: AgeTier;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];
}

export class StoryQueryDto {
  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;

  @IsOptional()
  @IsEnum(AgeTier)
  ageTier?: AgeTier;

  @IsOptional()
  @IsBoolean()
  // @Type(() => Boolean) // If using enableImplicitConversion
  isPrivate?: boolean;

  @IsOptional()
  @IsEnum(CollaborationRole)
  role?: CollaborationRole;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  // @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  // @Type(() => Number)
  page: number = 1;
}
