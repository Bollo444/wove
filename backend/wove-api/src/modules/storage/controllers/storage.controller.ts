import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  Res,
  StreamableFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StorageService } from '../services/storage.service';
import { User } from '../../../database/entities';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Response as ExpressResponse } from 'express';
import { UploadOptions } from '../interfaces/storage-provider.interface';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
    @Query('storyId') storyId?: string,
    @Query('segmentId') segmentId?: string,
    @Query('isPublic') isPublic?: string,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const options: UploadOptions & { originalFilename?: string; size?: number } = {
      contentType: file.mimetype,
      originalFilename: file.originalname,
      size: file.size,
      isPublic: isPublic === 'true',
    };

    return this.storageService.uploadFile(
      file.originalname, // Using original name for now, service will make it unique
      file.buffer,
      options,
      user.id,
      storyId,
      segmentId,
    );
  }

  @Get('download/:assetId')
  async downloadFile(
    @Param('assetId') assetId: string,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<StreamableFile> {
    const stream = await this.storageService.downloadFile(assetId);
    const metadata = await this.storageService.getFileMetadata(assetId);

    res.set({
      'Content-Type': metadata.contentType,
      'Content-Disposition': `attachment; filename="${metadata.name}"`,
    });
    return new StreamableFile(stream);
  }

  @Delete(':assetId')
  async deleteFile(@Param('assetId') assetId: string, @GetUser() user: User) {
    // Add permission check here: e.g., only uploader or admin can delete
    // For now, allowing any authenticated user to delete for simplicity
    return this.storageService.deleteFile(assetId);
  }

  @Get('metadata/:assetId')
  async getFileMetadata(@Param('assetId') assetId: string) {
    return this.storageService.getFileMetadata(assetId);
  }

  @Get('url/:assetId')
  async getPublicUrl(@Param('assetId') assetId: string) {
    return this.storageService.getPublicUrl(assetId);
  }
}
