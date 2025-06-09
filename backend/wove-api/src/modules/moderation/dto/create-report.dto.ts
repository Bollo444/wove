import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentType } from '../types/content-type.enum';
import { ReportReason } from '../types/report-reason.enum';

export class CreateReportDto {
  @IsNotEmpty()
  @IsUUID()
  reportedContentId: string;

  @IsNotEmpty()
  @IsEnum(ContentType)
  reportedContentType: ContentType;

  @IsNotEmpty()
  @IsEnum(ReportReason)
  reasonCategory: ReportReason;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  evidenceData?: Record<string, any>;
}
