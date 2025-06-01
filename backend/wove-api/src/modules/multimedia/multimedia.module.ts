import { Module, forwardRef } from '@nestjs/common';
import { MultimediaOrchestrationService } from './services/multimedia-orchestration.service';
import { AiModule } from '../ai/ai.module';
import { StoriesModule } from '../stories/stories.module'; // For StoryService context
import { ConfigModule } from '@nestjs/config'; // For ConfigService

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AiModule.register()),
    forwardRef(() => StoriesModule), // Use forwardRef if StoriesModule might depend on MultimediaModule
  ],
  providers: [MultimediaOrchestrationService],
  exports: [MultimediaOrchestrationService],
})
export class MultimediaModule {}
