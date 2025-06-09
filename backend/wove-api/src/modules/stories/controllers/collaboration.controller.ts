import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { IsEnum, IsUUID } from 'class-validator'; // Import missing decorators
import { CollaborationService } from '../services/collaboration.service'; // Assuming this service will be created
import { StoryService } from '../services/story.service'; // StoryService for permission checks
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../../database/entities';
import { CollaborationRole } from '@shared/types'; // Assuming this type exists

// DTOs would be defined in a separate file e.g., dtos/collaboration.dto.ts
class AddCollaboratorDto {
  @IsUUID()
  userId: string;

  @IsEnum(CollaborationRole)
  role: CollaborationRole;
}

class UpdateCollaboratorRoleDto {
  @IsEnum(CollaborationRole)
  role: CollaborationRole;
}

@Controller('stories/:storyId/collaborators')
@UseGuards(JwtAuthGuard)
export class CollaborationController {
  constructor(
    private readonly collaborationService: CollaborationService,
    private readonly storyService: StoryService, // For using verifyUserPermission
  ) {}

  @Post()
  async addCollaborator(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @Body(ValidationPipe) addCollaboratorDto: AddCollaboratorDto,
    @GetUser() user: User,
  ) {
    // storyService.addCollaborator already handles permission check by owner
    return this.storyService.addCollaborator(user.id, storyId, addCollaboratorDto);
  }

  @Get()
  async getStoryCollaborators(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @GetUser() user: User, // To potentially check if user can view collaborators
  ) {
    // Add permission check if needed (e.g., only collaborators can see other collaborators)
    // await this.storyService.verifyUserPermission(user.id, storyId, Object.values(CollaborationRole));
    return this.storyService.getStoryCollaborators(storyId);
  }

  @Patch(':collaboratorUserId') // Using userId of collaborator to identify them in the story context
  async updateCollaboratorRole(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @Param('collaboratorUserId', ParseUUIDPipe) collaboratorUserId: string, // This is the User ID of the collaborator
    @Body(ValidationPipe) updateCollaboratorRoleDto: UpdateCollaboratorRoleDto,
    @GetUser() user: User,
  ) {
    // Need to fetch the StoryCollaborator ID first based on storyId and collaboratorUserId
    // This logic might be better suited inside StoryService or CollaborationService
    // For now, assuming StoryService has a method that can handle this by user ID.
    // This is a placeholder as updateCollaboratorRole in StoryService expects StoryCollaborator.id
    // await this.storyService.updateCollaboratorRole(user.id, storyId, collaboratorEntity.id, updateCollaboratorRoleDto.role);
    return {
      message: `Placeholder: Update role for user ${collaboratorUserId} in story ${storyId} to ${updateCollaboratorRoleDto.role}`,
    };
  }

  @Delete(':collaboratorUserId')
  async removeCollaborator(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @Param('collaboratorUserId', ParseUUIDPipe) collaboratorUserId: string, // User ID of the collaborator to remove
    @GetUser() user: User,
  ) {
    // Similar to update, StoryService.removeCollaborator expects StoryCollaborator.id
    // This logic needs refinement in the service or here.
    // await this.storyService.removeCollaborator(user.id, storyId, collaboratorEntity.id);
    return { message: `Placeholder: Remove user ${collaboratorUserId} from story ${storyId}` };
  }
}
