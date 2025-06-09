import { Controller, Post, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModerationService } from '../services/moderation.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReviewReportDto } from '../dto/review-report.dto';
import { ContentType } from '../types/content-type.enum';
import { ReportStatus } from '../types/report-status.enum';
import { User } from '../../../database/entities';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ModeratorGuard } from '../guards/moderator.guard';

@Controller('moderation')
@UseGuards(JwtAuthGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('reports')
  async createReport(@GetUser() user: User, @Body() createReportDto: CreateReportDto) {
    return this.moderationService.createReport(user.id, createReportDto);
  }

  @Put('reports/:id/review')
  @UseGuards(ModeratorGuard)
  async reviewReport(
    @GetUser() user: User,
    @Param('id') reportId: string,
    @Body() reviewReportDto: ReviewReportDto,
  ) {
    reviewReportDto.reportId = reportId;
    return this.moderationService.reviewReport(user.id, reviewReportDto);
  }

  @Get('reports/content/:id')
  async getContentReports(@Param('id') contentId: string, @Query('type') contentType: ContentType) {
    return this.moderationService.getReportsByContent(contentId, contentType);
  }

  @Get('reports/status/:status')
  @UseGuards(ModeratorGuard)
  async getReportsByStatus(
    @Param('status') status: ReportStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.moderationService.getReportsByStatus(status, page, limit);
  }

  @Get('reports/moderator')
  @UseGuards(ModeratorGuard)
  async getModeratorReports(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.moderationService.getModeratorReports(user.id, page, limit);
  }

  @Put('reports/:id/assign/:moderatorId')
  @UseGuards(ModeratorGuard)
  async assignReport(@Param('id') reportId: string, @Param('moderatorId') moderatorId: string) {
    return this.moderationService.assignReport(reportId, moderatorId);
  }

  @Put('reports/:id/escalate')
  @UseGuards(ModeratorGuard)
  async escalateReport(@Param('id') reportId: string, @Body('notes') notes: string) {
    return this.moderationService.escalateReport(reportId, notes);
  }

  @Get('reports/statistics')
  @UseGuards(ModeratorGuard)
  async getReportStatistics() {
    return this.moderationService.getReportStatistics();
  }
}
