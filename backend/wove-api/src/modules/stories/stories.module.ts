import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Story,
  StorySegment,
  StoryCollaborator,
  MediaAsset,
  StoryPremise,
  DigitalBook,
  UserStoryBookmark,
  StoryCharacter,
  StoryPlotPoint,
  StoryBranchPoint, // Added
  StoryChoiceOption, // Added
  User, // Added for CollaborationService
} from '../../database/entities';
import { StoryService } from './services/story.service';
import { StorySegmentService } from './services/story-segment.service';
import { CollaborationService } from './services/collaboration.service';
import { LibraryService } from './services/library.service';
import { DigitalBookService } from './services/digital-book.service';
import { StoryMemoryService } from './services/story-memory.service'; // Added
import { StoriesController } from './controllers/stories.controller';
import { StorySegmentController } from './controllers/story-segment.controller';
import { CollaborationController } from './controllers/collaboration.controller';
import { LibraryController } from './controllers/library.controller';
import { DigitalBookController } from './controllers/digital-book.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AiModule } from '../ai/ai.module'; // Import AiModule
import { WebSocketModule } from '../websocket/websocket.module'; // Import WebSocketModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      StorySegment,
      StoryCollaborator,
      MediaAsset,
      StoryPremise,
      DigitalBook,
      UserStoryBookmark,
      StoryCharacter,
      StoryPlotPoint,
      StoryBranchPoint, // Added
      StoryChoiceOption, // Added
      User, // Added for CollaborationService
    ]),
    AuthModule,
    UsersModule,
    AiModule, // Add AiModule
    WebSocketModule, // Add WebSocketModule
  ],
  controllers: [
    StoriesController,
    StorySegmentController,
    CollaborationController,
    LibraryController,
    DigitalBookController,
  ],
  providers: [
    StoryService,
    StorySegmentService,
    CollaborationService,
    LibraryService,
    DigitalBookService,
    StoryMemoryService, // Added
  ],
  exports: [
    StoryService,
    StorySegmentService,
    CollaborationService,
    LibraryService,
    DigitalBookService,
    StoryMemoryService, // Added
  ],
})
export class StoriesModule {}
