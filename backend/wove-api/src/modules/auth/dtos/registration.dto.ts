import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsISO8601, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { AgeTier } from '@shared/types';

/**
 * DTO for user registration requests
 */
export class RegistrationDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username?: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsISO8601({}, { message: 'Please provide a valid date of birth in ISO format (YYYY-MM-DD)' })
  dateOfBirth?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  parentalMonitoringEnabled?: boolean;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid parent email address' })
  parentEmail?: string;

  @IsOptional()
  claimedAgeTier?: AgeTier;
}
