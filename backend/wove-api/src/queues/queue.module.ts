import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MediaProcessorService } from './tasks/media-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'media-generation',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    }),
  ],
  providers: [MediaProcessorService],
  exports: [BullModule],
})
export class QueueModule {}
