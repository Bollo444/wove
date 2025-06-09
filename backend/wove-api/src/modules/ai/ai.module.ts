import { Module, DynamicModule, Provider, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiService } from './services/ai.service';
import { AI_PROVIDER_TOKEN } from './interfaces/ai-provider.interface';
import { MockAiProvider } from './providers/mock-ai.provider';
// Import other AI providers like OpenAiProvider, StabilityAiProvider etc. if you create them
import { StorageModule } from '../storage/storage.module'; // Import StorageModule
import { StoriesModule } from '../stories/stories.module'; // Import StoriesModule

@Module({})
export class AiModule {
  static register(): DynamicModule {
    const aiProvider: Provider = {
      provide: AI_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const providerType = configService.get<string>('AI_PROVIDER', 'mock');
        // In a real application, you would fetch API keys from configService
        // const apiKey = configService.get<string>(`AI_${providerType.toUpperCase()}_API_KEY`);

        switch (providerType) {
          // case 'openai':
          //   return new OpenAiProvider(apiKey);
          // case 'stabilityai':
          //   return new StabilityAiProvider(apiKey);
          case 'mock':
          default:
            return new MockAiProvider(); // Mock provider doesn't need API key
        }
      },
      inject: [ConfigService],
    };

    return {
      module: AiModule,
      imports: [
        ConfigModule,
        StorageModule.register(), // Register StorageModule dynamically
        forwardRef(() => StoriesModule), // Import StoriesModule to access StoryMemoryService
      ],
      providers: [aiProvider, AiService],
      exports: [AiService, aiProvider], // Export AiService and the provider token
    };
  }
}
