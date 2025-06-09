import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AiProvider,
  AI_PROVIDER_TOKEN,
  TextGenerationOptions,
  TextGenerationResponse,
  ImageGenerationOptions,
  ImageGenerationResponse,
  AudioGenerationOptions,
  AudioGenerationResponse,
} from '../interfaces/ai-provider.interface';
import { StorageService } from '../../storage/services/storage.service';
import { MediaAsset, Story, StorySegment } from '../../../database/entities';
import { Readable } from 'stream';
import { UploadOptions } from '../../storage/interfaces/storage-provider.interface';
// AgeTier is already imported via line 17 from previous changes, removing duplicate
import { AgeTier } from '@shared/types'; // Added AgeTier
import { StoryMemoryService } from '../../stories/services/story-memory.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AiProvider,
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    private readonly storyMemoryService: StoryMemoryService, // Added StoryMemoryService
  ) {
    const providerName = this.configService.get<string>('AI_PROVIDER', 'mock');
    this.logger.log(`AI Service initialized with provider: ${providerName}`);
  }

  async generateText(options: TextGenerationOptions): Promise<TextGenerationResponse> {
    this.logger.log(`Generating text with options: ${JSON.stringify(options)}`);
    const response = await this.aiProvider.generateText(options);
    return response;
  }

  async generateImage(
    options: ImageGenerationOptions,
    userId: string,
    storyId?: string,
    segmentId?: string,
  ): Promise<{ response: ImageGenerationResponse; assets: MediaAsset[] }> {
    this.logger.log(`Generating image(s) with options: ${JSON.stringify(options)}`);
    const response = await this.aiProvider.generateImage(options);
    const assets: MediaAsset[] = [];

    for (const image of response.images) {
      let content: Buffer | Readable;
      let fileName: string;
      let contentType: string;

      if (image.url) {
        this.logger.warn(
          `Image generated at external URL: ${image.url}. Consider downloading and re-hosting.`,
        );
        content = Buffer.from('mock image data from url');
        fileName = `ai-generated-image-${Date.now()}.jpg`;
        contentType = 'image/jpeg';
      } else if (image.base64) {
        content = Buffer.from(image.base64, 'base64');
        fileName = `ai-generated-image-${Date.now()}.png`;
        contentType = 'image/png';
      } else {
        this.logger.warn('Image generation response did not contain URL or base64 data.');
        continue;
      }

      const metadata: Record<string, string> = { aiGenerated: 'true', prompt: options.prompt };
      if (options.style) metadata.style = options.style;
      if (options.model) metadata.model = options.model;
      if (image.seed) metadata.seed = image.seed.toString();

      const uploadOptions: UploadOptions & { originalFilename?: string; size?: number } = {
        contentType,
        originalFilename: fileName,
        isPublic: true,
        metadata,
      };

      const asset = await this.storageService.uploadFile(
        fileName,
        content,
        uploadOptions,
        userId,
        storyId,
        segmentId,
      );

      // Placeholder for content filtering the generated image asset
      const isSafe = await this.isMultimediaContentSafe(asset, 'image', options.prompt);
      if (isSafe) {
        assets.push(asset);
      } else {
        this.logger.warn(`Generated image asset ${asset.id} flagged as unsafe and was discarded.`);
        // Optionally, delete the unsafe asset from storage if it was uploaded before check
        // await this.storageService.deleteFile(asset.storageKey, userId); // Requires deleteFile in StorageService
      }
    }

    return { response, assets };
  }

  async generateAudio(
    options: AudioGenerationOptions,
    userId: string,
    storyId?: string,
    segmentId?: string,
  ): Promise<{ response: AudioGenerationResponse; asset?: MediaAsset }> {
    this.logger.log(`Generating audio with options: ${JSON.stringify(options)}`);
    const response = await this.aiProvider.generateAudio(options);
    let asset: MediaAsset | undefined;

    let content: Buffer | Readable;
    let fileName: string;
    let contentType = `audio/${response.format || 'mpeg'}`;

    if (response.audioUrl) {
      this.logger.warn(
        `Audio generated at external URL: ${response.audioUrl}. Consider downloading and re-hosting.`,
      );
      content = Buffer.from('mock audio data from url');
      fileName = `ai-generated-audio-${Date.now()}.${response.format || 'mp3'}`;
    } else if (response.audioBase64) {
      content = Buffer.from(response.audioBase64, 'base64');
      fileName = `ai-generated-audio-${Date.now()}.${response.format || 'mp3'}`;
    } else {
      this.logger.warn('Audio generation response did not contain URL or base64 data.');
      return { response, asset: undefined };
    }

    const metadata: Record<string, string> = { aiGenerated: 'true' };
    if (options.prompt) metadata.prompt = options.prompt;
    if (options.text) metadata.text = options.text;
    if (options.voice) metadata.voice = options.voice;
    if (options.model) metadata.model = options.model;

    const uploadOptions: UploadOptions & { originalFilename?: string; size?: number } = {
      contentType,
      originalFilename: fileName,
      isPublic: true,
      metadata,
    };

    asset = await this.storageService.uploadFile(
      fileName,
      content,
      uploadOptions,
      userId,
      storyId,
      segmentId,
    );

    if (asset) {
      const isSafe = await this.isMultimediaContentSafe(
        asset,
        'audio',
        options.prompt || options.text,
      );
      if (!isSafe) {
        this.logger.warn(`Generated audio asset ${asset.id} flagged as unsafe and was discarded.`);
        // await this.storageService.deleteFile(asset.storageKey, userId);
        return { response, asset: undefined }; // Return undefined if unsafe
      }
    }

    return { response, asset };
  }

  /**
   * Generates a prompt for story continuation based on the current story context.
   * @param story The story entity.
   * @param recentSegments An array of recent story segments to provide context.
   * @param maxLength Desired max length for the continuation (e.g., in words or tokens).
   * @returns A string prompt for the AI.
   */
  async generateStoryContinuationPrompt(
    story: Story,
    recentSegments: StorySegment[],
    maxLength: number = 150, // Default to ~150 words
    narrativeControls?: {
      // New parameter for narrative controls
      includeThemes?: string[];
      avoidThemes?: string[];
      focusCharacterId?: string;
      desiredOutcome?: string; // e.g., "a character should find a clue"
      styleGuidance?: string; // e.g., "more humorous", "darker tone"
    },
  ): Promise<string> {
    this.logger.log(
      `Generating story continuation prompt for story ID: ${story.id} with controls: ${JSON.stringify(narrativeControls)}`,
    );

    let context = `The story so far is titled "${story.title}".\n`;
    if (story.description) {
      context += `Synopsis: ${story.description}\n`;
    }
    context += `Target age group: ${story.ageTier}.\n`;
    if (story.genreIds && story.genreIds.length > 0) {
      context += `Genres: ${story.genreIds.join(', ')}.\n`;
    }
    if (story.aiModel) {
      context += `Preferred AI Model for this story: ${story.aiModel}.\n`;
    }
    if (story.aiSettings && Object.keys(story.aiSettings).length > 0) {
      context += `Custom AI Settings for this story: ${JSON.stringify(story.aiSettings)}.\n`;
    }

    // Integrate character and plot point summaries from StoryMemoryService
    const memoryContext = await this.storyMemoryService.getStoryContextForAI(story.id); // Corrected: Removed invalid options object
    if (memoryContext.characters && memoryContext.characters.length > 0) {
      context += '\nKey Characters:\n';
      memoryContext.characters.forEach(character => {
        // Iterate over characters from memoryContext
        context += `- ${character.name}`;
        if (character.description) context += `: ${character.description}`; // Use character.description
        context += '\n';
      });
    }
    if (memoryContext.plotPoints && memoryContext.plotPoints.length > 0) {
      context += '\nKey Plot Points So Far:\n';
      memoryContext.plotPoints.forEach(plotPoint => {
        // Iterate over plotPoints from memoryContext
        context += `- ${plotPoint.summary}`;
        if (plotPoint.status) context += ` (Status: ${plotPoint.status})`;
        context += '\n';
      });
    }

    context += '\nRecent events:\n';
    recentSegments.forEach(segment => {
      // Basic stripping of HTML for prompt context
      const cleanContent = segment.content.replace(/<[^>]*>?/gm, '');
      context += `- ${cleanContent}\n`;
    });

    // TODO: Add more sophisticated context building:
    // - Character summaries/memories
    // - Plot points
    // - User-defined narrative controls or style guides
    // - Specific instructions based on story.aiMode or other settings
    // - Explicitly list allowed/disallowed themes/words based on ageTier

    let ageSpecificInstructions = '';
    switch (story.ageTier) {
      case AgeTier.KIDS:
        ageSpecificInstructions =
          'The content must be suitable for young children (under 13). Avoid complex vocabulary, scary themes, violence, or any mature topics. Focus on positive messages, simple plots, and clear language.';
        break;
      case AgeTier.TEENS:
        ageSpecificInstructions =
          'The content should be appropriate for teenagers (13-17). It can explore more complex themes and emotions but must avoid explicit content, excessive violence, or topics unsuitable for minors. Language can be more sophisticated but still accessible.';
        break;
      case AgeTier.ADULTS:
        ageSpecificInstructions =
          'The content is for adults (18+) and can explore mature themes, complex narratives, and sophisticated language. However, maintain a respectful tone and avoid gratuitous or harmful content unless specifically part of a defined, controlled narrative style agreed upon for this story.';
        break;
      case AgeTier.UNVERIFIED:
      default:
        ageSpecificInstructions =
          'The content should be generally appropriate for a wide audience, defaulting to a safer, more universal appeal. Avoid controversial or mature themes unless the story context clearly dictates it and it can be flagged appropriately.';
        break;
    }

    const instruction = `Continue this story naturally for about ${maxLength} words. ${ageSpecificInstructions} Keep the tone and style consistent with the recent events. Do not conclude the story unless explicitly asked. Focus on creating an engaging next part.`;

    const fullPrompt = `${context}\n${instruction}`;
    this.logger.debug(
      `Generated prompt for story ${story.id} (Age Tier: ${story.ageTier}): ${fullPrompt.substring(0, 300)}...`,
    ); // Log snippet
    return fullPrompt;
  }

  /**
   * Generates a story continuation using an AI model.
   * @param story The story entity.
   * @param recentSegments Recent story segments for context.
   * @returns The generated text content for the next segment.
   */
  async generateStoryContinuation(
    story: Story,
    recentSegments: StorySegment[],
    narrativeControls?: any, // Pass through controls
  ): Promise<TextGenerationResponse> {
    const prompt = await this.generateStoryContinuationPrompt(
      story,
      recentSegments,
      150,
      narrativeControls,
    ); // Pass controls

    // TODO: Define TextGenerationOptions more specifically for story continuation
    // e.g., temperature, top_p, presence_penalty, frequency_penalty
    const options: TextGenerationOptions = {
      prompt,
      maxTokens: 200, // Adjust based on desired length and model
      model: story.aiModel || this.configService.get<string>('DEFAULT_TEXT_AI_MODEL'), // Use story-specific model or default
      ...(story.aiSettings || {}), // Spread story-specific AI settings (temperature, top_p, etc.)
      // Default temperature if not in story.aiSettings
      temperature: story.aiSettings?.temperature ?? 0.7,
    };

    this.logger.log(
      `Requesting story continuation from AI provider for story ID: ${story.id}. Model: ${options.model}. Settings: ${JSON.stringify(story.aiSettings)}`,
    );
    // This will call the configured AI provider (e.g., MockAiProvider, OpenAiProvider)
    const response = await this.aiProvider.generateText(options);

    // TODO: Post-process the response if needed (e.g., content filtering, formatting)
    // For example, ensuring it's age-appropriate based on story.ageTier
    if (!this.isContentAgeAppropriate(response.text, story.ageTier, story.genreIds)) {
      // Pass genres for context
      this.logger.warn(
        `Generated content for story ${story.id} flagged as potentially not age-appropriate for ${story.ageTier}. Content: "${response.text.substring(0, 100)}..."`,
      );
      // Depending on policy, either throw error, modify content, or return with a warning/flag.
      // For now, let's assume it might be allowed but logged.
      // throw new Error('Generated content is not age-appropriate.');
    }

    return response;
  }

  /**
   * Placeholder for age-appropriateness check and content filtering.
   * This would involve more sophisticated NLP, keyword/phrase lists, and possibly an external moderation API.
   * @param text The text to check.
   * @param ageTier The target age tier.
   * @param genres Optional list of genres for context.
   * @returns boolean indicating if content is deemed appropriate.
   */
  private isContentAgeAppropriate(text: string, ageTier: AgeTier, genres?: string[]): boolean {
    this.logger.log(
      `Checking age appropriateness for ${ageTier} (Genres: ${genres?.join(', ') || 'N/A'}): "${text.substring(0, 50)}..." (Placeholder)`,
    );

    // Basic placeholder logic:
    if (ageTier === AgeTier.KIDS) {
      const forbiddenKidKeywords = ['kill', 'death', 'blood', 'scary', 'monster']; // Very basic example
      for (const keyword of forbiddenKidKeywords) {
        if (text.toLowerCase().includes(keyword)) {
          this.logger.warn(`Kid-inappropriate keyword '${keyword}' found.`);
          return false; // Simplistic check
        }
      }
    }
    // Add more rules for TEENS, ADULTS, UNVERIFIED
    // Consider using a more robust library or service for this.
    return true;
  }

  /**
   * Enhances user input using AI for grammar, spelling, clarity, or style.
   * @param userInput The raw text input from the user.
   * @param targetAgeTier The target age tier for the story, to guide enhancement style.
   * @param enhancementType Type of enhancement (e.g., 'grammar', 'style', 'clarity'). Placeholder.
   * @returns The enhanced text or an error/suggestion.
   */
  async enhanceUserInput(
    userInput: string,
    targetAgeTier: AgeTier,
    enhancementType: 'grammar' | 'style' | 'clarity' | 'full' = 'full', // Default to full enhancement
  ): Promise<TextGenerationResponse> {
    // Could return a more specific type like { originalText: string, enhancedText: string, changes: any[] }
    this.logger.log(
      `Enhancing user input for age tier ${targetAgeTier}, type: ${enhancementType}. Input: "${userInput.substring(0, 100)}..."`,
    );

    let promptInstruction = '';
    switch (enhancementType) {
      case 'grammar':
        promptInstruction =
          'Correct any grammar and spelling mistakes in the following text. Only output the corrected text.';
        break;
      case 'style':
        promptInstruction = `Rewrite the following text to better match a style suitable for the ${targetAgeTier} age group, improving flow and engagement. Only output the rewritten text.`;
        break;
      case 'clarity':
        promptInstruction =
          'Rewrite the following text to improve clarity and conciseness, while maintaining the original meaning. Only output the rewritten text.';
        break;
      case 'full':
      default:
        promptInstruction = `Review and enhance the following text for a story. Correct grammar and spelling, improve clarity, and adjust the style to be engaging and appropriate for the ${targetAgeTier} age group. Only output the enhanced text.`;
        break;
    }

    const prompt = `${promptInstruction}\n\nOriginal Text:\n"""\n${userInput}\n"""\n\nEnhanced Text:`;

    const options: TextGenerationOptions = {
      prompt,
      maxTokens: Math.floor(userInput.length * 1.5) + 50, // Allow some expansion
      model:
        this.configService.get<string>('DEFAULT_TEXT_AI_MODEL_FOR_EDITING') ||
        this.configService.get<string>('DEFAULT_TEXT_AI_MODEL'), // Potentially a different model for editing tasks
      temperature: 0.3, // Lower temperature for more deterministic corrections
      // Add other relevant parameters for editing/refinement tasks
    };

    this.logger.log(
      `Requesting user input enhancement from AI provider. Prompt snippet: "${prompt.substring(0, 200)}..."`,
    );
    const response = await this.aiProvider.generateText(options);

    // TODO: Add logic to compare original and enhanced text to identify changes if needed.
    // This could be complex and might involve diffing libraries.

    this.logger.log(
      `Input enhancement complete. Original: "${userInput.substring(0, 50)}...", Enhanced: "${response.text.substring(0, 50)}..."`,
    );
    return response; // The 'text' field in response contains the enhanced version.
  }

  /**
   * Generates a concluding segment for a story.
   * @param story The story entity.
   * @param recentSegments Recent story segments for context.
   * @param desiredConclusionType Optional: 'happy', 'sad', 'cliffhanger', 'open'.
   * @returns The generated text content for the concluding segment.
   */
  async generateStoryConclusion(
    story: Story,
    recentSegments: StorySegment[],
    desiredConclusionType?: 'happy' | 'sad' | 'cliffhanger' | 'open' | string, // Allow custom string
  ): Promise<TextGenerationResponse> {
    this.logger.log(
      `Generating story conclusion for story ID: ${story.id}, desired type: ${desiredConclusionType}`,
    );

    let context = `The story so far is titled "${story.title}".\n`;
    if (story.description) {
      context += `Synopsis: ${story.description}\n`;
    }
    context += `Target age group: ${story.ageTier}.\n`;
    if (story.genreIds && story.genreIds.length > 0) {
      context += `Genres: ${story.genreIds.join(', ')}.\n`;
    }

    context += '\nRecent events leading to the conclusion:\n';
    recentSegments.forEach(segment => {
      const cleanContent = segment.content.replace(/<[^>]*>?/gm, '');
      context += `- ${cleanContent}\n`;
    });

    let conclusionInstruction =
      'Conclude the story in a satisfying and fitting way based on the events so far.';
    if (desiredConclusionType) {
      conclusionInstruction = `Conclude the story with a ${desiredConclusionType} ending that is satisfying and fitting for the events so far.`;
    }

    // Age-specific guidance for conclusions
    let ageSpecificConclusionGuidance = '';
    switch (story.ageTier) {
      case AgeTier.KIDS:
        ageSpecificConclusionGuidance =
          'Ensure the conclusion is positive or gently resolved, suitable for young children.';
        break;
      case AgeTier.TEENS:
        ageSpecificConclusionGuidance =
          'The conclusion can be more nuanced, but should generally offer a sense of resolution or thoughtful reflection appropriate for teenagers.';
        break;
      // Adults and Unverified might not need as strict guidance, or it could be more open.
    }

    const prompt = `${context}\n${conclusionInstruction} ${ageSpecificConclusionGuidance} Make it about 100-200 words.`;

    const options: TextGenerationOptions = {
      prompt,
      maxTokens: 250, // Allow a bit more for a conclusion
      model: this.configService.get<string>('DEFAULT_TEXT_AI_MODEL'),
      temperature: 0.7, // Slightly higher temperature for more creative conclusions
    };

    this.logger.log(
      `Requesting story conclusion from AI provider for story ID: ${story.id}. Prompt snippet: "${prompt.substring(0, 200)}..."`,
    );
    const response = await this.aiProvider.generateText(options);

    // Post-process for age appropriateness
    if (!this.isContentAgeAppropriate(response.text, story.ageTier, story.genreIds)) {
      this.logger.warn(
        `Generated conclusion for story ${story.id} flagged as potentially not age-appropriate for ${story.ageTier}.`,
      );
      // Handle appropriately, e.g., try again or return a safe default.
      // For now, returning the potentially problematic one with a warning.
    }

    this.logger.log(
      `Conclusion generated for story ${story.id}: "${response.text.substring(0, 100)}..."`,
    );
    return response;
  }

  /**
   * Generates a piece of soundtrack or ambient audio based on mood, genre, etc.
   * @param options Options for soundtrack generation.
   * @param userId User ID for ownership, if applicable.
   * @param storyId Story ID for context.
   * @returns The AI provider's response and the created MediaAsset.
   */
  async generateSoundtrackPiece(
    options: {
      mood: string;
      durationSeconds?: number;
      genre?: string;
      intensity?: number; // e.g., 0-1
      prompt?: string; // More specific prompt if needed
    },
    userId: string,
    storyId: string,
  ): Promise<{ response: AudioGenerationResponse; asset?: MediaAsset }> {
    const audioGenOptions: AudioGenerationOptions = {
      prompt:
        options.prompt ||
        `Generate a piece of music with a ${options.mood} mood. Genre: ${options.genre || 'cinematic'}. Intensity: ${options.intensity || 0.5}.`,
      durationSeconds: options.durationSeconds || 60, // Default to 60 seconds
      model: this.configService.get<string>('DEFAULT_AUDIO_AI_MODEL') || 'mock-music-gen', // Specific model for music
    };
    this.logger.log(`Generating soundtrack piece for story ${storyId} with mood ${options.mood}`);

    // This reuses the generic generateAudio method, which handles provider call and storage.
    // The prompt engineering here is key.
    return this.generateAudio(audioGenOptions, userId, storyId);
  }

  /**
   * Placeholder for multimedia content safety check.
   * This would integrate with external moderation services or internal models.
   * @param asset The MediaAsset entity (after upload, containing URL or key).
   * @param mediaType 'image', 'video', or 'audio'.
   * @param originalPrompt The prompt used for generation, for context.
   * @returns boolean indicating if content is deemed safe.
   */
  private async isMultimediaContentSafe(
    asset: MediaAsset,
    mediaType: 'image' | 'video' | 'audio',
    originalPrompt?: string,
  ): Promise<boolean> {
    this.logger.log(
      `Checking safety of ${mediaType} asset ${asset.id} (URL: ${asset.url}, Prompt: "${originalPrompt?.substring(0, 50)}...") (Placeholder)`,
    );

    // Example placeholder logic:
    // 1. Check AI provider's built-in safety flags if available in 'asset.metadata' or response.
    // 2. For images/videos, call an external image/video moderation API.
    //    const moderationResult = await someVisionApi.moderate(asset.url);
    //    if (moderationResult.isUnsafe) return false;
    // 3. For audio, transcribe if necessary and check text, or use audio moderation API.
    //    if (mediaType === 'audio') {
    //      const text = await someSpeechToTextApi.transcribe(asset.url);
    //      if (!this.isContentAgeAppropriate(text, AgeTier.ADULTS)) return false; // Use a general check for text
    //    }

    // For now, assume all generated content is safe by default in mock environment
    const isMockEnvironment = this.configService.get<string>('AI_PROVIDER') === 'mock';
    if (isMockEnvironment) {
      return true;
    }

    // In a real scenario, default to false if checks are not conclusive or fail
    // return false;
    return true; // Placeholder: default to true for now
  }
}
