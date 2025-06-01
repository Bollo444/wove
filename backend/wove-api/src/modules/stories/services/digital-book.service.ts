import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'; // Added BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalBook, Story, StorySegment, MediaAsset } from '../../../database/entities'; // Added StorySegment, MediaAsset
import { User } from '../../../database/entities'; // Assuming User might be needed for permissions
import { StoryService } from './story.service'; // For fetching segments
import { AiService } from '../../ai/services/ai.service'; // For cover generation

@Injectable()
export class DigitalBookService {
  constructor(
    @InjectRepository(DigitalBook)
    private digitalBookRepository: Repository<DigitalBook>,
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
    @InjectRepository(StorySegment) // Added
    private segmentRepository: Repository<StorySegment>,
    private readonly storyService: StoryService, // To get all segments for a story
    // private readonly aiService: AiService, // For cover generation - temporarily commented out due to circular dependency
  ) {}

  async createDigitalBook(storyId: string, userId: string, title?: string): Promise<DigitalBook> {
    const story = await this.storyRepository.findOne({ where: { id: storyId, creatorId: userId } }); // Basic permission check
    if (!story) {
      throw new NotFoundException(
        `Story with ID ${storyId} not found or user does not have permission.`,
      );
    }

    const book = this.digitalBookRepository.create({
      storyId,
      title: title || `${story.title} - Digital Edition`,
      // Add other fields like compiledAt, pageCount (once compilation logic exists)
    });
    return this.digitalBookRepository.save(book);
  }

  async findBookById(bookId: string): Promise<DigitalBook> {
    const book = await this.digitalBookRepository.findOne({
      where: { id: bookId },
      relations: ['story', 'story.creator'],
    });
    if (!book) {
      throw new NotFoundException(`Digital book with ID ${bookId} not found.`);
    }
    return book;
  }

  async findBooksByStory(storyId: string): Promise<DigitalBook[]> {
    return this.digitalBookRepository.find({
      where: { storyId },
      order: { createdAt: 'DESC' },
    });
  }

  // Placeholder for deleting a book
  async deleteDigitalBook(bookId: string, userId: string): Promise<void> {
    const book = await this.findBookById(bookId);
    if (book.creatorId !== userId) {
      // Basic permission check
      throw new ForbiddenException('You do not have permission to delete this book.');
    }
    await this.digitalBookRepository.delete(bookId);
  }

  async findBooksByUser(userId: string): Promise<DigitalBook[]> {
    // Books created by the user OR public books from stories they created/collaborated on
    // This is a simplified query; a real bookshelf might involve bookmarks or explicit "add to bookshelf" actions.
    return this.digitalBookRepository.find({
      where: [
        { creatorId: userId }, // Books they directly created
        // { story: { creatorId: userId }, isPublic: true }, // Public books from their stories (more complex query needed for collaborators)
      ],
      relations: ['story'], // Include story for context
      order: { createdAt: 'DESC' },
    });
  }

  // Placeholder for book compilation logic
  async compileBook(bookId: string, userId: string): Promise<DigitalBook> {
    const book = await this.findBookById(bookId);
    // Basic permission check: only story creator can compile? Or collaborators?
    if (book.story.creatorId !== userId) {
      throw new ForbiddenException('You do not have permission to compile this book.');
    }

    const story = await this.storyRepository.findOne({
      where: { id: book.storyId },
      relations: ['segments', 'segments.mediaAssets', 'creator'], // Ensure segments and their media are loaded
    });

    if (!story || !story.segments) {
      throw new NotFoundException('Story or segments not found for compilation.');
    }

    // Task 3 & 5: Dynamic text formatting and media embedding (Placeholder)
    // This is where complex logic for pagination, chapter division, and media placement would go.
    // For now, we'll create a simple structure.

    interface CompiledPageSegmentMedia {
      url?: string;
      type: string;
      altText?: string | null;
    }
    interface CompiledPageSegment {
      content: string;
      media: CompiledPageSegmentMedia[];
    }
    interface CompiledPage {
      pageNumber: number;
      segments: CompiledPageSegment[];
    }

    const compiledPages: CompiledPage[] = [];
    let currentPageSegments: CompiledPageSegment[] = [];
    let charCount = 0;
    const charsPerPageApproximation = 1500; // Very rough estimate

    for (const segment of story.segments.sort((a, b) => a.position - b.position)) {
      currentPageSegments.push({
        content: segment.content, // Raw HTML content
        media:
          segment.mediaAssets?.map(ma => ({ url: ma.url, type: ma.type, altText: ma.altText })) ||
          [],
      });
      charCount += segment.content.length;

      if (charCount >= charsPerPageApproximation) {
        compiledPages.push({ pageNumber: compiledPages.length + 1, segments: currentPageSegments });
        currentPageSegments = [];
        charCount = 0;
      }
    }
    if (currentPageSegments.length > 0) {
      // Add any remaining segments
      compiledPages.push({ pageNumber: compiledPages.length + 1, segments: currentPageSegments });
    }

    // Task 4: Chapter division (Very basic placeholder)
    // A real system might look for H1/H2 tags or allow manual chapter breaks.
    const chapters = [{ title: 'Chapter 1', startPage: 1 }]; // Placeholder

    book.compiledContent = {
      pages: compiledPages,
      chapters: chapters, // Placeholder
      // layoutSettings: book.layoutSettings, // Apply layout settings
      // chapterConfiguration: book.chapterConfiguration, // Apply chapter settings
    };
    book.pageCount = compiledPages.length;
    book.compiledAt = new Date();

    // Task 2: Cover design generation (Placeholder)
    if (!book.coverImageUrl) {
      try {
        const coverPrompt = `Book cover for a story titled "${story.title}", genre: ${story.genreIds?.join(', ') || 'general'}, for age group ${story.ageTier}. Style: artistic, engaging.`;
        // const imageResult = await this.aiService.generateImage(
        //   { prompt: coverPrompt, numImages: 1, size: { width: 600, height: 800 } },
        //   story.creatorId,
        //   story.id,
        // );
        // if (imageResult.assets.length > 0) {
        //   book.coverImageUrl = imageResult.assets[0].url;
        // }
        // Temporarily disabled due to circular dependency
      } catch (e) {
        console.error('Failed to generate cover image:', e);
      }
    }

    return this.digitalBookRepository.save(book);
  }

  async exportBook(
    bookId: string,
    userId: string,
    format: 'epub' | 'pdf' | 'txt' = 'txt',
  ): Promise<DigitalBook> {
    const book = await this.findBookById(bookId);
    // Permission check
    if (book.story.creatorId !== userId && !book.isPublic) {
      // Example: only creator or if public
      throw new ForbiddenException('You do not have permission to export this book.');
    }
    if (!book.compiledContent) {
      throw new NotFoundException('Book has not been compiled yet.');
    }

    let fileContent: string | Buffer = '';
    let fileName = `${book.title.replace(/\s+/g, '_')}.${format}`;
    let contentType = 'text/plain';

    // This is a highly simplified placeholder for export logic
    switch (format) {
      case 'txt':
        contentType = 'text/plain';
        // @ts-ignore // compiledContent is any for now
        fileContent = book.compiledContent.pages
          .map(
            page =>
              // @ts-ignore
              page.segments.map(seg => seg.content.replace(/<[^>]*>?/gm, '')).join('\n\n'), // Strip HTML for TXT
          )
          .join('\n\n--- Page Break ---\n\n');
        break;
      case 'epub':
        contentType = 'application/epub+zip';
        // TODO: Implement EPUB generation using a library like epub-gen
        // This would involve creating chapters, cover, metadata, and packaging HTML content.
        fileContent = 'EPUB content placeholder'; // Placeholder
        this.storyRepository.manager.query(
          `UPDATE "digital_books" SET "download_url" = 'epub_placeholder_url', "download_format" = 'epub', "last_exported_at" = NOW() WHERE "id" = '${bookId}'`,
        );
        throw new Error('EPUB export not yet implemented.');
      case 'pdf':
        contentType = 'application/pdf';
        // TODO: Implement PDF generation using a library like pdfmake or puppeteer
        // This would involve rendering HTML content to PDF.
        fileContent = 'PDF content placeholder'; // Placeholder
        this.storyRepository.manager.query(
          `UPDATE "digital_books" SET "download_url" = 'pdf_placeholder_url', "download_format" = 'pdf', "last_exported_at" = NOW() WHERE "id" = '${bookId}'`,
        );
        throw new Error('PDF export not yet implemented.');
      default:
        throw new BadRequestException('Unsupported export format.');
    }

    // For TXT, actually upload (EPUB/PDF are placeholders above)
    if (format === 'txt') {
      // const uploadResult = await this.storageService.uploadFile(fileName, Buffer.from(fileContent), {contentType, isPublic: true}, userId, book.storyId);
      // book.downloadUrl = uploadResult.url; // Assuming storageService.uploadFile returns an asset with a URL
      // book.downloadFormat = format;
      // book.lastExportedAt = new Date();
      // await this.digitalBookRepository.save(book);
      // For now, just log and return book as if uploaded
      const logContent =
        typeof fileContent === 'string' ? fileContent.substring(0, 100) : '[Buffer Content]';
      console.log(`Placeholder: Would upload ${fileName} with content: ${logContent}...`);
      book.downloadUrl = `placeholder_txt_url_for_${fileName}`;
      book.downloadFormat = format;
      book.lastExportedAt = new Date();
    }

    return book; // Return the book with updated download info (or placeholder info)
  }
}
