import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  ParseUUIDPipe,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ParentalControlService } from '../services/parental-control.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('parental-control')
export class ParentalControlController {
  constructor(private parentalControlService: ParentalControlService) {}

  /**
   * Create a parental link between a parent and child account
   */
  @Post('link')
  @UseGuards(JwtAuthGuard)
  async createParentalLink(@Req() req, @Body(ValidationPipe) linkData: { childEmail: string }) {
    return this.parentalControlService.createParentalLink(req.user.id, linkData.childEmail);
  }

  /**
   * Approve a pending parental link request
   */
  @Post('link/:linkId/approve')
  @UseGuards(JwtAuthGuard)
  async approveParentalLink(@Req() req, @Param('linkId', ParseUUIDPipe) linkId: string) {
    return this.parentalControlService.approveParentalLink(req.user.id, linkId);
  }

  /**
   * Reject a pending parental link request
   */
  @Post('link/:linkId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectParentalLink(@Req() req, @Param('linkId', ParseUUIDPipe) linkId: string) {
    await this.parentalControlService.rejectParentalLink(req.user.id, linkId);
    return { success: true };
  }

  /**
   * Remove an existing parental link
   */
  @Delete('link/:linkId')
  @UseGuards(JwtAuthGuard)
  async removeParentalLink(@Req() req, @Param('linkId', ParseUUIDPipe) linkId: string) {
    await this.parentalControlService.removeParentalLink(req.user.id, linkId);
    return { success: true };
  }

  /**
   * Get all children linked to the authenticated parent
   */
  @Get('children')
  @UseGuards(JwtAuthGuard)
  async getLinkedChildren(@Req() req) {
    return this.parentalControlService.getLinkedChildren(req.user.id);
  }

  /**
   * Get all parents linked to the authenticated child
   */
  @Get('parents')
  @UseGuards(JwtAuthGuard)
  async getLinkedParents(@Req() req) {
    return this.parentalControlService.getLinkedParents(req.user.id);
  }

  /**
   * Get pending parental link requests
   */
  @Get('pending-requests')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@Req() req) {
    return this.parentalControlService.getPendingLinkRequests(req.user.id);
  }

  /**
   * Update content restrictions for a child
   */
  @Put('child/:childId/content-restrictions')
  @UseGuards(JwtAuthGuard)
  async updateContentRestrictions(
    @Req() req,
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body(ValidationPipe)
    restrictions: {
      allowedContentCategories?: string[];
      restrictedTopics?: string[];
      maxContentRating?: string;
      requireApprovalForPublishing?: boolean;
      requireApprovalForCollaboration?: boolean;
    },
  ) {
    return this.parentalControlService.updateContentRestrictions(
      req.user.id,
      childId,
      restrictions,
    );
  }

  /**
   * Set daily usage time limit for a child
   */
  @Put('child/:childId/time-limit')
  @UseGuards(JwtAuthGuard)
  async setTimeLimit(
    @Req() req,
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body(ValidationPipe) timeData: { timeLimit: number },
  ) {
    if (timeData.timeLimit < 0) {
      throw new BadRequestException('Time limit cannot be negative');
    }
    return this.parentalControlService.setUsageTimeLimit(req.user.id, childId, timeData.timeLimit);
  }

  /**
   * Set usage schedule for a child
   */
  @Put('child/:childId/schedule')
  @UseGuards(JwtAuthGuard)
  async setUsageSchedule(
    @Req() req,
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body(ValidationPipe)
    scheduleData: {
      allowedDays?: number[]; // 0-6 (Sunday-Saturday)
      allowedHourRanges?: { start: number; end: number }[]; // 0-23
    },
  ) {
    // Validate schedule data
    if (scheduleData.allowedDays) {
      const validDays = scheduleData.allowedDays.every(day => day >= 0 && day <= 6);
      if (!validDays) {
        throw new BadRequestException('Days must be between 0 (Sunday) and 6 (Saturday)');
      }
    }

    if (scheduleData.allowedHourRanges) {
      const validHours = scheduleData.allowedHourRanges.every(
        range =>
          range.start >= 0 &&
          range.start <= 23 &&
          range.end >= 0 &&
          range.end <= 23 &&
          range.start <= range.end,
      );

      if (!validHours) {
        throw new BadRequestException(
          'Hours must be between 0 and 23, and start time must be before end time',
        );
      }
    }

    return this.parentalControlService.setUsageSchedule(req.user.id, childId, scheduleData);
  }
}
