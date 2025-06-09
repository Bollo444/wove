import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Readable } from 'stream';
import {
  StorageProvider,
  UploadOptions,
  FileMetadata,
  STORAGE_PROVIDER_TOKEN,
} from '../interfaces/storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly baseStoragePath: string;

  constructor(private readonly configService: ConfigService) {
    this.baseStoragePath = this.configService.get<string>('STORAGE_LOCAL_PATH', './uploads');
    fs.ensureDirSync(this.baseStoragePath);
    this.logger.log(`Local storage initialized at: ${this.baseStoragePath}`);
  }

  private getFilePath(bucketName: string, fileName: string): string {
    return path.join(this.baseStoragePath, bucketName, fileName);
  }

  async upload(
    bucketName: string,
    fileName: string,
    content: Buffer | Readable,
    options?: UploadOptions,
  ): Promise<string> {
    const filePath = this.getFilePath(bucketName, fileName);
    const dirPath = path.dirname(filePath);
    await fs.ensureDir(dirPath);

    if (content instanceof Readable) {
      const writeStream = fs.createWriteStream(filePath);
      content.pipe(writeStream);
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    } else {
      await fs.writeFile(filePath, content);
    }

    this.logger.log(`File uploaded: ${filePath}`);
    // For local storage, the "URL" is just the file path relative to the server
    // In a real scenario, this would be a public URL if options.isPublic is true
    return `/${path.join(bucketName, fileName)}`;
  }

  async download(bucketName: string, fileName: string): Promise<Readable> {
    const filePath = this.getFilePath(bucketName, fileName);
    if (!(await fs.pathExists(filePath))) {
      throw new NotFoundException(`File not found: ${fileName} in bucket ${bucketName}`);
    }
    return fs.createReadStream(filePath);
  }

  async delete(bucketName: string, fileName: string): Promise<void> {
    const filePath = this.getFilePath(bucketName, fileName);
    if (!(await fs.pathExists(filePath))) {
      this.logger.warn(`Attempted to delete non-existent file: ${filePath}`);
      return; // Or throw NotFoundException if strict behavior is needed
    }
    await fs.remove(filePath);
    this.logger.log(`File deleted: ${filePath}`);
  }

  async getMetadata(bucketName: string, fileName: string): Promise<FileMetadata> {
    const filePath = this.getFilePath(bucketName, fileName);
    if (!(await fs.pathExists(filePath))) {
      throw new NotFoundException(`File not found: ${fileName} in bucket ${bucketName}`);
    }
    const stats = await fs.stat(filePath);
    return {
      name: fileName,
      size: stats.size,
      contentType: 'application/octet-stream', // Basic default, could be improved
      lastModified: stats.mtime,
      url: `/${path.join(bucketName, fileName)}`,
    };
  }

  async getSignedUrl(
    bucketName: string,
    fileName: string,
    expiresInSeconds: number,
  ): Promise<string> {
    // Local storage doesn't typically use signed URLs.
    // This would be a direct path or a simple token-based access for dev.
    this.logger.warn(
      `getSignedUrl called for local storage. Returning direct path for ${fileName}. Expiry not applicable.`,
    );
    return `/${path.join(bucketName, fileName)}`;
  }

  async exists(bucketName: string, fileName: string): Promise<boolean> {
    const filePath = this.getFilePath(bucketName, fileName);
    return fs.pathExists(filePath);
  }
}
