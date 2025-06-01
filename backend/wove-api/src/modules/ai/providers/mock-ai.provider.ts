import { Injectable, Logger } from '@nestjs/common';
import {
  AiProvider,
  TextGenerationOptions,
  TextGenerationResponse,
  ImageGenerationOptions,
  ImageGenerationResponse,
  AudioGenerationOptions,
  AudioGenerationResponse,
  GeneratedImage, // Import the new interface
} from '../interfaces/ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
  private readonly logger = new Logger(MockAiProvider.name);

  constructor() {
    this.logger.log('Mock AI Provider initialized. All AI calls will be simulated.');
  }

  async generateText(options: TextGenerationOptions): Promise<TextGenerationResponse> {
    this.logger.log(
      `Simulating text generation for prompt: "${options.prompt.substring(0, 50)}..."`,
    );

    let text = `This is a mock AI response to the prompt: "${options.prompt}". `;
    if (options.context) {
      text += `It considers the context: "${options.context.substring(0, 30)}...". `;
    }
    text += `Mock model "${options.model || 'default-mock-text-model'}" was used.`;

    // Simulate some variation based on temperature if provided
    if (options.temperature && options.temperature > 0.7) {
      text += ' This response is quite creative!';
    } else {
      text += ' This response is rather straightforward.';
    }

    return {
      text,
      finishReason: 'stop',
      usage: {
        promptTokens: options.prompt.length / 4, // Rough estimate
        completionTokens: text.length / 4, // Rough estimate
        totalTokens: (options.prompt.length + text.length) / 4,
      },
    };
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
    this.logger.log(
      `Simulating image generation for prompt: "${options.prompt.substring(0, 50)}..."`,
    );
    const numImages = options.numImages || 1;
    const images: GeneratedImage[] = []; // Use the correct type here

    for (let i = 0; i < numImages; i++) {
      // Placeholder image URL (e.g., from a service like Pexels or a local placeholder)
      // Using a simple placeholder service for demonstration
      const width = options.size?.width || 512;
      const height = options.size?.height || 512;
      const style = options.style || 'abstract';
      images.push({
        url: `https://picsum.photos/seed/${Date.now() + i}/${width}/${height}?random&description=${encodeURIComponent(options.prompt)}&style=${style}`,
        seed: Date.now() + i,
      });
    }

    return {
      images,
      usage: {}, // Mock usage
    };
  }

  async generateAudio(options: AudioGenerationOptions): Promise<AudioGenerationResponse> {
    const logMessage = options.text
      ? `Simulating audio generation (TTS) for text: "${options.text.substring(0, 50)}..."`
      : `Simulating audio generation for prompt: "${options.prompt?.substring(0, 50)}..."`;
    this.logger.log(logMessage);

    // Placeholder audio URL or base64 data
    // For simplicity, returning a URL to a generic sound file
    return {
      audioUrl: 'https://www.soundjay.com/button/sounds/button-1.mp3', // Example placeholder
      durationSeconds: options.durationSeconds || 5, // Mock duration
      format: 'mp3',
      usage: {}, // Mock usage
    };
  }
}
