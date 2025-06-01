import { Injectable } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { Logger } from '@nestjs/common';

interface MediaGenerationJob {
  type: 'image' | 'video' | 'audio';
  prompt: string;
  userId: string;
  storyId: string;
  requestId: string;
}

@Injectable()
@Processor('media-generation')
export class MediaProcessorService {
  private readonly logger = new Logger(MediaProcessorService.name);

  constructor(@InjectQueue('media-generation') private readonly mediaQueue: Queue) {}

  /**
   * Adds a new media generation job to the queue
   */
  async addMediaGenerationJob(data: MediaGenerationJob): Promise<Job<MediaGenerationJob>> {
    return this.mediaQueue.add('generate', data);
  }

  /**
   * Processes media generation jobs
   */
  @Process('generate')
  async processMediaGeneration(job: Job<MediaGenerationJob>): Promise<any> {
    this.logger.debug(`Processing media generation job ${job.id}`);
    this.logger.debug(`Job data: ${JSON.stringify(job.data)}`);

    try {
      // In a real implementation, this would call the appropriate AI service
      // based on the media type (image, video, audio)
      const result = await this.mockGenerateMedia(job.data);

      this.logger.debug(`Media generation completed for job ${job.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error in media generation job ${job.id}`, error.stack);
      throw error;
    }
  }

  /**
   * Mock implementation for media generation
   * In production, this would be replaced with actual API calls
   */
  private async mockGenerateMedia(data: MediaGenerationJob): Promise<any> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      mediaUrl: `https://storage.wove.io/media/${data.type}/${data.requestId}.${this.getExtensionForType(data.type)}`,
      generatedAt: new Date().toISOString(),
      prompt: data.prompt,
      metadata: {
        type: data.type,
        userId: data.userId,
        storyId: data.storyId,
      },
    };
  }

  private getExtensionForType(type: string): string {
    switch (type) {
      case 'image':
        return 'png';
      case 'video':
        return 'mp4';
      case 'audio':
        return 'mp3';
      default:
        return 'bin';
    }
  }
}
