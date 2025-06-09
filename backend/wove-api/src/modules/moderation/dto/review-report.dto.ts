import { IsNotEmpty, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportStatus } from '../types/report-status.enum';

export class ReviewReportDto {
  @IsNotEmpty()
  @IsUUID()
  reportId: string;

  @IsNotEmpty()
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @IsOptional()
  @IsString()
  resolutionAction?: string;

  @IsOptional()
  reviewData?: Record<string, any>;
}
