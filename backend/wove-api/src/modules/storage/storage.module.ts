import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAsset } from '../../database/entities';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';
import { LocalStorageProvider } from './providers/local-storage.provider';
// Import other providers like S3StorageProvider if you create them
import { STORAGE_PROVIDER_TOKEN } from './interfaces/storage-provider.interface';

@Module({})
export class StorageModule {
  static register(): DynamicModule {
    const storageProvider: Provider = {
      provide: STORAGE_PROVIDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        const providerType = configService.get<string>('STORAGE_PROVIDER', 'local');
        switch (providerType) {
          // case 's3':
          //   return new S3StorageProvider(configService);
          case 'local':
          default:
            return new LocalStorageProvider(configService);
        }
      },
      inject: [ConfigService],
    };

    return {
      module: StorageModule,
      imports: [ConfigModule, TypeOrmModule.forFeature([MediaAsset])],
      controllers: [StorageController],
      providers: [storageProvider, StorageService],
      exports: [StorageService, storageProvider],
    };
  }
}
