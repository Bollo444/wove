import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsObject } from 'class-validator';
import { VerificationMethod } from '@shared/types';

/**
 * DTO for age verification requests
 */
export class AgeVerificationRequestDto {
  @IsNotEmpty({ message: 'Verification method is required' })
  @IsEnum(VerificationMethod, { message: 'Invalid verification method' })
  method: VerificationMethod;

  @IsOptional()
  @IsUUID(4, { message: 'Invalid user ID format' })
  userId?: string;

  @IsOptional()
  @IsObject()
  verificationData?: Record<string, any>;

  @IsOptional()
  dateOfBirth?: string;
}
