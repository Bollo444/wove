import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  NotFoundException,
  ForbiddenException,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AgeTier } from '@shared/types';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  /**
   * Get the currently logged in user's profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }

  /**
   * Get a specific user by ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  /**
   * Update the current user's profile
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body(ValidationPipe) updateData: any) {
    return this.userService.updateUser(req.user.id, updateData);
  }

  /**
   * Deactivate the current user's account
   */
  @Post('deactivate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deactivateAccount(@Req() req) {
    return this.userService.deactivateUser(req.user.id);
  }

  /**
   * Reactivate the current user's account
   */
  @Post('reactivate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reactivateAccount(@Req() req) {
    return this.userService.reactivateUser(req.user.id);
  }

  /**
   * Search users by username or email
   */
  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!query || query.length < 3) {
      throw new BadRequestException('Search query must be at least 3 characters long');
    }
    return this.userService.searchUsers(query, page, limit);
  }

  /**
   * Get a list of users by age tier
   */
  @Get('age-tier/:tier')
  @UseGuards(JwtAuthGuard)
  async getUsersByAgeTier(
    @Param('tier') tier: AgeTier,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findByAgeTier(tier, page, limit);
  }
}
