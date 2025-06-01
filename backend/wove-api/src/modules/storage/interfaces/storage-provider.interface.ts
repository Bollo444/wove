import { Readable } from 'stream';

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  lastModified: Date;
  url?: string;
  metadata?: Record<string, string>;
}

export interface StorageProvider {
  /**
   * Upload a file to the storage provider.
   * @param bucketName - The name of the bucket to upload to.
   * @param fileName - The name of the file in the bucket.
   * @param content - The file content (Buffer or Readable stream).
   * @param options - Optional upload parameters.
   * @returns A promise that resolves with the public URL of the uploaded file.
   */
  upload(
    bucketName: string,
    fileName: string,
    content: Buffer | Readable,
    options?: UploadOptions,
  ): Promise<string>;

  /**
   * Download a file from the storage provider.
   * @param bucketName - The name of the bucket.
   * @param fileName - The name of the file to download.
   * @returns A promise that resolves with a Readable stream of the file content.
   */
  download(bucketName: string, fileName: string): Promise<Readable>;

  /**
   * Delete a file from the storage provider.
   * @param bucketName - The name of the bucket.
   * @param fileName - The name of the file to delete.
   * @returns A promise that resolves when the file is deleted.
   */
  delete(bucketName: string, fileName: string): Promise<void>;

  /**
   * Get metadata for a file.
   * @param bucketName - The name of the bucket.
   * @param fileName - The name of the file.
   * @returns A promise that resolves with the file metadata.
   */
  getMetadata(bucketName: string, fileName: string): Promise<FileMetadata>;

  /**
   * Generate a signed URL for accessing a private file.
   * @param bucketName - The name of the bucket.
   * @param fileName - The name of the file.
   * @param expiresInSeconds - The duration for which the URL is valid.
   * @returns A promise that resolves with the signed URL.
   */
  getSignedUrl(bucketName: string, fileName: string, expiresInSeconds: number): Promise<string>;

  /**
   * Check if a file exists.
   * @param bucketName - The name of the bucket.
   * @param fileName - The name of the file.
   * @returns A promise that resolves with true if the file exists, false otherwise.
   */
  exists(bucketName: string, fileName: string): Promise<boolean>;
}

export const STORAGE_PROVIDER_TOKEN = 'STORAGE_PROVIDER_TOKEN';
