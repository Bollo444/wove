import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story, StoryCharacter, StoryPlotPoint, StorySegment } from '../../../database/entities';

@Injectable()
export class StoryMemoryService {
  private readonly logger = new Logger(StoryMemoryService.name);

  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(StoryCharacter)
    private characterRepository: Repository<StoryCharacter>,
    @InjectRepository(StoryPlotPoint)
    private plotPointRepository: Repository<StoryPlotPoint>,
    @InjectRepository(StorySegment)
    private segmentRepository: Repository<StorySegment>,
  ) {}

  // == Character Management ==
  async addCharacterToStory(
    storyId: string,
    characterData: Partial<StoryCharacter>,
  ): Promise<StoryCharacter> {
    this.logger.log(`Adding character to story ${storyId}: ${characterData.name}`);
    const character = this.characterRepository.create({ ...characterData, storyId });
    return this.characterRepository.save(character);
  }

  async getStoryCharacters(storyId: string): Promise<StoryCharacter[]> {
    return this.characterRepository.find({ where: { storyId, isActiveInStory: true } });
  }

  async updateCharacter(
    characterId: string,
    updates: Partial<StoryCharacter>,
  ): Promise<StoryCharacter> {
    await this.characterRepository.update(characterId, updates);
    const updatedCharacter = await this.characterRepository.findOne({ where: { id: characterId } });
    if (!updatedCharacter)
      throw new NotFoundException(`Character with ID ${characterId} not found after update.`);
    return updatedCharacter;
  }

  // == Plot Point Management ==
  async addPlotPoint(
    storyId: string,
    plotPointData: Partial<StoryPlotPoint>,
  ): Promise<StoryPlotPoint> {
    this.logger.log(`Adding plot point to story ${storyId}: ${plotPointData.summary}`);
    // Determine sequence
    const lastPlotPoint = await this.plotPointRepository.findOne({
      where: { storyId },
      order: { sequence: 'DESC' },
    });
    const sequence = lastPlotPoint ? lastPlotPoint.sequence + 1 : 0;

    const plotPoint = this.plotPointRepository.create({ ...plotPointData, storyId, sequence });
    return this.plotPointRepository.save(plotPoint);
  }

  async getStoryPlotPoints(storyId: string): Promise<StoryPlotPoint[]> {
    return this.plotPointRepository.find({ where: { storyId }, order: { sequence: 'ASC' } });
  }

  /**
   * Gathers relevant context for AI prompt generation.
   * This is a placeholder and would become much more sophisticated.
   */
  async getStoryContextForAI(
    storyId: string,
    recentSegmentCount: number = 3,
  ): Promise<{
    story: Story;
    characters: StoryCharacter[];
    plotPoints: StoryPlotPoint[];
    recentSegments: StorySegment[];
  }> {
    const story = await this.storyRepository.findOne({ where: { id: storyId } });
    if (!story) throw new NotFoundException(`Story with ID ${storyId} not found.`);

    const characters = await this.getStoryCharacters(storyId);
    const plotPoints = await this.getStoryPlotPoints(storyId); // Maybe only recent/relevant plot points

    const recentSegments = await this.segmentRepository.find({
      where: { storyId },
      order: { position: 'DESC' },
      take: recentSegmentCount,
    });
    recentSegments.reverse(); // Ensure chronological order for the prompt

    return { story, characters, plotPoints, recentSegments };
  }

  // TODO: Methods to extract key information from new segments to update character knowledge, relationships, or create new plot points.
  async processNewSegmentForMemory(segment: StorySegment): Promise<void> {
    this.logger.log(
      `Processing segment ${segment.id} for memory updates for story ${segment.storyId}.`,
    );

    const storyCharacters = await this.getStoryCharacters(segment.storyId);
    const segmentContentLower = segment.content.toLowerCase();

    // 1. Identify characters mentioned and potentially update their knowledge/status
    for (const character of storyCharacters) {
      if (segmentContentLower.includes(character.name.toLowerCase())) {
        this.logger.log(`Character ${character.name} mentioned in segment ${segment.id}.`);
        // Placeholder: Update character's 'knowledge' or 'lastSeenSegmentId'
        // Example:
        // let knowledge = character.knowledge ? [...character.knowledge] : [];
        // knowledge.push(`Appeared in segment ${segment.position}: ${segment.content.substring(0,50)}...`);
        // await this.updateCharacter(character.id, { knowledge });
      }
    }

    // 2. Identify potential new plot points or updates to existing ones
    // This is highly complex and would ideally use NLP/AI.
    // Placeholder: Look for keywords.
    const plotKeywords = ['discovered', 'revealed', 'decided', 'attacked', 'found a clue'];
    for (const keyword of plotKeywords) {
      if (segmentContentLower.includes(keyword)) {
        this.logger.log(
          `Potential plot point keyword "${keyword}" found in segment ${segment.id}.`,
        );
        // Placeholder: Create or update a StoryPlotPoint
        // Example:
        // await this.addPlotPoint(segment.storyId, {
        //   summary: `Event related to "${keyword}" occurred in segment ${segment.position}`,
        //   details: segment.content,
        //   triggeringSegmentId: segment.id,
        //   status: 'active',
        // });
        break; // Avoid creating multiple plot points from one segment for this basic example
      }
    }

    // 3. Update character relationships based on segment content (very complex, placeholder)
    // e.g., if "Alice helped Bob", update their relationship.

    // This method would likely be called by StoryService after a new segment is successfully added.
    // It might also trigger further AI analysis via AiService for deeper understanding.
  }
}
