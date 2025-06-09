export interface TextGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  model?: string; // Specific model to use, if applicable
  context?: string; // Previous conversation or story context
  // Add other provider-specific options as needed
}

export interface TextGenerationResponse {
  text: string;
  finishReason?: string; // e.g., 'stop', 'length', 'content_filter'
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  size?: { width: number; height: number };
  numImages?: number;
  style?: string; // e.g., 'photorealistic', 'cartoon', 'impressionistic'
  model?: string;
  // Add other provider-specific options
}

export interface GeneratedImage {
  url?: string; // URL if hosted by provider
  base64?: string; // Base64 encoded image data
  seed?: number;
}
export interface ImageGenerationResponse {
  images: GeneratedImage[];
  usage?: {
    // Usage metrics if provided
  };
}

export interface AudioGenerationOptions {
  text?: string; // For text-to-speech
  prompt?: string; // For music/sound generation from prompt
  voice?: string; // Specific voice for TTS
  durationSeconds?: number;
  model?: string;
  // Add other provider-specific options
}

export interface AudioGenerationResponse {
  audioUrl?: string;
  audioBase64?: string;
  durationSeconds?: number;
  format?: string; // e.g., 'mp3', 'wav'
  usage?: {
    // Usage metrics
  };
}

export interface AiProvider {
  generateText(options: TextGenerationOptions): Promise<TextGenerationResponse>;
  generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse>;
  generateAudio(options: AudioGenerationOptions): Promise<AudioGenerationResponse>;
  // Potentially add methods for content moderation, embeddings, etc.
}

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER_TOKEN';
