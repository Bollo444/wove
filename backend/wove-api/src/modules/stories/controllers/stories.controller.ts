import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
  BadRequestException, // Added for explicit error
} from '@nestjs/common';
import { StoryService } from '../services/story.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../../database/entities';
import { CreateStoryDto, UpdateStoryDto, StoryQueryDto } from '../dtos/story.dto';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  async createStory(@GetUser() user: User, @Body(ValidationPipe) createStoryDto: CreateStoryDto) {
    const storyData = {
      title: createStoryDto.title,
      description: createStoryDto.description,
      coverImageUrl: createStoryDto.coverImageUrl,
      ageTier: createStoryDto.ageTier,
      isPrivate: createStoryDto.isPrivate,
      genreIds: createStoryDto.genreIds,
      premiseId: createStoryDto.premiseId,
    };
    return this.storyService.createStory(user.id, storyData);
  }

  @Get()
  async findUserStories(@GetUser() user: User, @Query(ValidationPipe) queryDto: StoryQueryDto) {
    const filters = {
      status: queryDto.status,
      ageTier: queryDto.ageTier,
      isPrivate: queryDto.isPrivate,
      role: queryDto.role,
      query: queryDto.query,
    };
    return this.storyService.getUserStories(user.id, filters, queryDto.page, queryDto.limit);
  }

  @Get('public')
  async findPublicStories(@Query(ValidationPipe) queryDto: StoryQueryDto) {
    const filters = {
      status: queryDto.status,
      ageTier: queryDto.ageTier,
      genreIds: queryDto.genreIds,
      query: queryDto.query,
    };
    return this.storyService.getPublicStories(filters, queryDto.page, queryDto.limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    const story = await this.storyService.findStoryById(id);
    if (story.isPrivate) {
      // Ensure user is a collaborator to view private stories
      await this.storyService.verifyUserPermission(user.id, id, Object.values(CollaborationRole)); // Allow any collaborator role
    }
    return story;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateStoryDto: UpdateStoryDto,
    @GetUser() user: User,
  ) {
    const storyData = {
      title: updateStoryDto.title,
      description: updateStoryDto.description,
      coverImageUrl: updateStoryDto.coverImageUrl,
      ageTier: updateStoryDto.ageTier,
      isPrivate: updateStoryDto.isPrivate,
      status: updateStoryDto.status,
      genreIds: updateStoryDto.genreIds,
    };
    return this.storyService.updateStory(user.id, id, storyData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.storyService.deleteStory(user.id, id);
  }

  @Post(':storyId/segments')
  async addSegment(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @GetUser() user: User,
    @Body() body: { content: string; mediaAssets?: any[] }, // Define a DTO for this
  ) {
    if (!body.content || body.content.trim() === '') {
      throw new BadRequestException('Segment content cannot be empty.');
    }
    return this.storyService.addSegmentToStory(user.id, storyId, body.content, body.mediaAssets);
  }
}

// Need to import CollaborationRole if not already imported (it's used in findOne)
import { CollaborationRole } from '@shared/types';
