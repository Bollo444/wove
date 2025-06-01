import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentReport, User } from '../../../database/entities';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReviewReportDto } from '../dto/review-report.dto';
import { ReportStatus } from '../types/report-status.enum';
import { ContentType } from '../types/content-type.enum';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(ContentReport)
    private reportsRepository: Repository<ContentReport>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new content report
   * @param reporterId - ID of the user creating the report
   * @param data - Report data
   * @returns Created report
   */
  async createReport(reporterId: string, data: CreateReportDto): Promise<ContentReport> {
    // Verify reporter exists
    const reporter = await this.usersRepository.findOne({ where: { id: reporterId } });
    if (!reporter) {
      throw new NotFoundException('Reporter not found');
    }

    // Create new report
    const report = new ContentReport();
    report.reporterId = reporterId;
    report.reportedContentId = data.reportedContentId;
    report.reportedContentType = data.reportedContentType;
    report.reasonCategory = data.reasonCategory;
    report.description = data.description;
    report.evidenceData = data.evidenceData;
    report.status = ReportStatus.PENDING;

    return this.reportsRepository.save(report);
  }

  /**
   * Review a content report
   * @param reviewerId - ID of the moderator reviewing the report
   * @param data - Review data
   * @returns Updated report
   */
  async reviewReport(reviewerId: string, data: ReviewReportDto): Promise<ContentReport> {
    // Verify reviewer exists
    const reviewer = await this.usersRepository.findOne({ where: { id: reviewerId } });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    // Find report
    const report = await this.reportsRepository.findOne({ where: { id: data.reportId } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Update report
    report.reviewerId = reviewerId;
    report.status = data.status;
    report.reviewerNotes = data.reviewerNotes;
    report.resolutionAction = data.resolutionAction;
    report.reviewedAt = new Date();

    return this.reportsRepository.save(report);
  }

  /**
   * Get reports by content ID and type
   * @param contentId - ID of the reported content
   * @param contentType - Type of the reported content
   * @returns List of reports
   */
  async getReportsByContent(contentId: string, contentType: ContentType): Promise<ContentReport[]> {
    return this.reportsRepository.find({
      where: {
        reportedContentId: contentId,
        reportedContentType: contentType,
      },
      relations: ['reporter', 'reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get reports by status
   * @param status - Report status
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of reports
   */
  async getReportsByStatus(
    status: ReportStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reports: ContentReport[]; total: number }> {
    const [reports, total] = await this.reportsRepository.findAndCount({
      where: { status },
      relations: ['reporter', 'reviewer'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { reports, total };
  }

  /**
   * Get reports assigned to a moderator
   * @param reviewerId - Moderator's user ID
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of reports
   */
  async getModeratorReports(
    reviewerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reports: ContentReport[]; total: number }> {
    const [reports, total] = await this.reportsRepository.findAndCount({
      where: { reviewerId },
      relations: ['reporter'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { reports, total };
  }

  /**
   * Assign a report to a moderator
   * @param reportId - Report ID
   * @param moderatorId - Moderator's user ID
   * @returns Updated report
   */
  async assignReport(reportId: string, moderatorId: string): Promise<ContentReport> {
    // Verify moderator exists
    const moderator = await this.usersRepository.findOne({ where: { id: moderatorId } });
    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    // Find report
    const report = await this.reportsRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== ReportStatus.PENDING) {
      throw new BadRequestException('Can only assign pending reports');
    }

    // Assign report
    report.reviewerId = moderatorId;
    report.status = ReportStatus.UNDER_REVIEW;

    return this.reportsRepository.save(report);
  }

  /**
   * Escalate a report to higher-level moderation
   * @param reportId - Report ID
   * @param notes - Escalation notes
   * @returns Updated report
   */
  async escalateReport(reportId: string, notes: string): Promise<ContentReport> {
    const report = await this.reportsRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = ReportStatus.ESCALATED;
    report.reviewerNotes = notes;

    return this.reportsRepository.save(report);
  }

  /**
   * Get reports statistics
   * @returns Report statistics by status and type
   */
  async getReportStatistics(): Promise<{
    byStatus: Record<ReportStatus, number>;
    byType: Record<ContentType, number>;
  }> {
    const reports = await this.reportsRepository.find();

    const byStatus = Object.values(ReportStatus).reduce(
      (acc, status) => {
        acc[status] = reports.filter(r => r.status === status).length;
        return acc;
      },
      {} as Record<ReportStatus, number>,
    );

    const byType = Object.values(ContentType).reduce(
      (acc, type) => {
        acc[type] = reports.filter(r => r.reportedContentType === type).length;
        return acc;
      },
      {} as Record<ContentType, number>,
    );

    return { byStatus, byType };
  }
}
