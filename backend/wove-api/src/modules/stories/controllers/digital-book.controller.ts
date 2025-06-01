import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DigitalBookService } from '../services/digital-book.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '../../../database/entities';

@Controller('stories/:storyId/digital-books') // Nested under stories
@UseGuards(JwtAuthGuard)
export class DigitalBookController {
  constructor(private readonly digitalBookService: DigitalBookService) {}

  @Post()
  async createDigitalBook(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    @GetUser() user: User,
    @Body('title') title?: string, // Optional title for the book edition
  ) {
    // Permission to create a book from a story would typically be for the story owner/editor
    return this.digitalBookService.createDigitalBook(storyId, user.id, title);
  }

  @Get()
  async getBooksForStory(
    @Param('storyId', ParseUUIDPipe) storyId: string,
    // @GetUser() user: User, // Permission check might be needed if books can be private
  ) {
    return this.digitalBookService.findBooksByStory(storyId);
  }

  @Get(':bookId')
  async getBookById(
    @Param('storyId', ParseUUIDPipe) storyId: string, // storyId might be used for context or permission
    @Param('bookId', ParseUUIDPipe) bookId: string,
    // @GetUser() user: User, // Permission check
  ) {
    // Add permission checks if necessary, e.g., if book is tied to user's library
    const book = await this.digitalBookService.findBookById(bookId);
    if (book.storyId !== storyId) {
      throw new Error('Book does not belong to this story.'); // Or NotFoundException
    }
    return book;
  }

  @Delete(':bookId')
  async deleteBook(
    @Param('storyId', ParseUUIDPipe) storyId: string, // For context/permission
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @GetUser() user: User,
  ) {
    // Permission to delete a book would typically be for the story owner/editor
    return this.digitalBookService.deleteDigitalBook(bookId, user.id);
  }

  // Placeholder for an endpoint to trigger book compilation
  // @Post(':storyId/compile')
  // async compileStoryToBook(
  //   @Param('storyId', ParseUUIDPipe) storyId: string,
  //   @GetUser() user: User,
  // ) {
  //   // Permission check
  //   return this.digitalBookService.compileBook(storyId);
  // }
}
