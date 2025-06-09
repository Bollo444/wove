import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Readable } from 'stream';
import * as path from 'path';
import {
  StorageProvider,
  UploadOptions,
  FileMetadata,
  STORAGE_PROVIDER_TOKEN,
} from '../interfaces/storage-provider.interface';
import { MediaAsset } from '../../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly defaultBucket: string;

  constructor(
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: StorageProvider,
    @InjectRepository(MediaAsset)
    private readonly mediaAssetRepository: Repository<MediaAsset>,
    private readonly configService: ConfigService,
  ) {
    this.defaultBucket = this.configService.get<string>('STORAGE_DEFAULT_BUCKET', 'wove-media');
  }

  /**
   * Upload a file and create a MediaAsset record.
   * @param fileName - The name of the file.
   * @param content - The file content.
   * @param options - Upload options.
   * @param userId - The ID of the user uploading the file.
   * @param storyId - Optional story ID to associate the asset with.
   * @param segmentId - Optional segment ID to associate the asset with.
   * @returns The created MediaAsset record.
   */
  async uploadFile(
    fileName: string,
    content: Buffer | Readable,
    options: UploadOptions & { originalFilename?: string; size?: number },
    userId: string,
    storyId?: string,
    segmentId?: string,
  ): Promise<MediaAsset> {
    const bucketName = this.defaultBucket;
    const uniqueFileName = `${Date.now()}-${options.originalFilename || fileName}`;

    const publicUrl = await this.storageProvider.upload(
      bucketName,
      uniqueFileName,
      content,
      options,
    );

    const mediaAsset = new MediaAsset();
    mediaAsset.type = this.determineAssetType(options.contentType || '');
    mediaAsset.url = publicUrl;
    mediaAsset.creatorId = userId;
    if (storyId) {
      mediaAsset.storyId = storyId;
    }
    mediaAsset.segmentId = segmentId;
    mediaAsset.originalFilename = options.originalFilename || fileName;
    mediaAsset.size = options.size || 0; // Should be determined more accurately if possible
    mediaAsset.metadata = options.metadata;
    // Other fields like width, height, duration would need to be extracted from the file
    // This might require a separate processing step (e.g., using a queue)

    const savedAsset = await this.mediaAssetRepository.save(mediaAsset);
    this.logger.log(`MediaAsset created: ${savedAsset.id} for file ${uniqueFileName}`);
    return savedAsset;
  }

  async downloadFile(assetId: string): Promise<Readable> {
    const mediaAsset = await this.findAssetOrFail(assetId);
    // Assuming URL stores the path/key in the bucket
    const fileName = this.getFileNameFromUrl(mediaAsset.url);
    return this.storageProvider.download(this.defaultBucket, fileName);
  }

  async deleteFile(assetId: string): Promise<void> {
    const mediaAsset = await this.findAssetOrFail(assetId);
    const fileName = this.getFileNameFromUrl(mediaAsset.url);

    await this.storageProvider.delete(this.defaultBucket, fileName);
    await this.mediaAssetRepository.remove(mediaAsset);
    this.logger.log(`MediaAsset deleted: ${assetId}`);
  }

  async getFileMetadata(assetId: string): Promise<FileMetadata> {
    const mediaAsset = await this.findAssetOrFail(assetId);
    const fileName = this.getFileNameFromUrl(mediaAsset.url);
    return this.storageProvider.getMetadata(this.defaultBucket, fileName);
  }

  async getPublicUrl(assetId: string): Promise<string> {
    const mediaAsset = await this.findAssetOrFail(assetId);
    // If the asset is public, return its direct URL.
    // If private, generate a signed URL.
    // This logic depends on how `isPublic` is handled by the provider and asset.
    // For now, assuming all URLs from provider are directly accessible or provider handles public/private.
    return mediaAsset.url;
  }

  private async findAssetOrFail(assetId: string): Promise<MediaAsset> {
    const mediaAsset = await this.mediaAssetRepository.findOne({ where: { id: assetId } });
    if (!mediaAsset) {
      throw new NotFoundException(`MediaAsset with ID ${assetId} not found`);
    }
    return mediaAsset;
  }

  private getFileNameFromUrl(url: string): string {
    // This is a simplistic way to get filename from URL.
    // It might need to be more robust depending on URL structure.
    try {
      const parsedUrl = new URL(url); // If it's a full URL
      return path.basename(parsedUrl.pathname);
    } catch (e) {
      // If it's a relative path like '/bucket/filename.ext'
      return path.basename(url);
    }
  }

  private determineAssetType(contentType: string): string {
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'video';
    if (contentType.startsWith('audio/')) return 'audio';
    return 'file'; // Default
  }
}
