import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  NotificationPreferencesDto,
  UpdateNotificationPreferencesDto,
} from './dto/notification-preferences.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { AgeVerificationGuard } from '../modules/auth/guards/age-verification.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
    @Query('type') type?: string,
  ) {
    return await this.notificationService.findAllForUser(req.user.id, {
      limit,
      offset,
      unreadOnly,
      type,
    });
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(@Request() req) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Get('preferences/me')
  @UseGuards(JwtAuthGuard)
  async getMyPreferences(@Request() req) {
    return await this.notificationService.getNotificationPreferences(req.user.id);
  }

  @Patch('preferences/me')
  @UseGuards(JwtAuthGuard)
  async updateMyPreferences(@Request() req, @Body() updatePreferencesDto: UpdateNotificationPreferencesDto) {
    return await this.notificationService.updateNotificationPreferences(
      req.user.id,
      updatePreferencesDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.notificationService.findOne(id, req.user.id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string, @Request() req) {
    return await this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch('mark-all-read')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req) {
    await this.notificationService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    await this.notificationService.delete(id, req.user.id);
    return { message: 'Notification deleted successfully' };
  }

  // Admin endpoints for creating specific types of notifications
  @Post('story/:storyId')
  @UseGuards(JwtAuthGuard, AgeVerificationGuard)
  async sendStoryNotification(@Param('storyId') storyId: string, @Body() notificationData: any) {
    return await this.notificationService.createStoryNotification(
      notificationData.userId,
      storyId,
      notificationData.storyTitle,
      notificationData.type,
    );
  }

  @Post('collaboration/:userId')
  @UseGuards(JwtAuthGuard, AgeVerificationGuard)
  async sendCollaborationNotification(@Param('userId') userId: string, @Body() notificationData: any) {
    return await this.notificationService.createCollaborationNotification(
      userId,
      notificationData.inviterName,
      notificationData.storyTitle,
      notificationData.collaborationId,
    );
  }

  @Post('parental/:childId')
  @UseGuards(JwtAuthGuard)
  async sendParentalNotification(@Param('childId') childId: string, @Body() notificationData: any) {
    return await this.notificationService.createParentalNotification(
      childId,
      notificationData.type,
      notificationData.details,
    );
  }
}