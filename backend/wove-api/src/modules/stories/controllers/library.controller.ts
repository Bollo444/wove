import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { LibraryService } from '../services/library.service'; // Assuming this service will be created
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../../database/entities';
import { StoryQueryDto } from '../dtos/story.dto'; // Re-use StoryQueryDto or create a specific LibraryQueryDto

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('my-stories')
  async getMyStories(@GetUser() user: User, @Query(ValidationPipe) queryDto: StoryQueryDto) {
    // This would typically call a method in LibraryService or StoryService
    // that filters stories where the user is the creator or a collaborator.
    // For now, let's assume StoryService.getUserStories covers this.
    // return this.libraryService.getUserAuthoredOrCollaboratedStories(user.id, queryDto);
    return { message: `Placeholder: Get stories for user ${user.id} with filters`, queryDto };
  }

  @Get('bookmarks')
  async getBookmarkedStories(
    @GetUser() user: User,
    @Query(ValidationPipe) queryDto: StoryQueryDto,
  ) {
    // return this.libraryService.getBookmarkedStories(user.id, queryDto);
    return { message: `Placeholder: Get bookmarked stories for user ${user.id}`, queryDto };
  }

  // Public library/explore endpoint might be here or in StoriesController
  // For consistency with StoriesController.findPublicStories, it might be better there.
  // If it's here, it might not need JwtAuthGuard for the specific route.
  // @Get('public')
  // @UseGuards() // Potentially no guard or a more permissive one
  // async getPublicLibrary(@Query(ValidationPipe) queryDto: StoryQueryDto) {
  //   return this.libraryService.getPublicStories(queryDto);
  // }
}
