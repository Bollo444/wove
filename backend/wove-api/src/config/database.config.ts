import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  User,
  AgeVerificationRequest,
  ParentalLink,
  Story,
  StorySegment,
  StoryCollaborator,
  DigitalBook,
  MediaAsset,
  StoryPremise,
  UserStoryBookmark,
  ChatMessage,
  Notification,
  ContentReport,
  EmailVerificationToken,
  StoryCharacter,
  StoryPlotPoint,
  StoryBranchPoint,
  StoryChoiceOption,
} from '../database/entities';

// dotenv.config(); // No longer needed here as ConfigModule handles .env files

const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'wove_dev_db'), // Updated default
  entities: [
    User,
    AgeVerificationRequest,
    ParentalLink,
    Story,
    StorySegment,
    StoryCollaborator,
    DigitalBook,
    MediaAsset,
    StoryPremise,
    UserStoryBookmark,
    ChatMessage,
    Notification,
    ContentReport,
    EmailVerificationToken,
    StoryCharacter,
    StoryPlotPoint,
    StoryBranchPoint,
    StoryChoiceOption,
  ],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') !== 'production',
  ssl:
    configService.get<string>('DATABASE_SSL') === 'true'
      ? { rejectUnauthorized: false } // Common for self-signed or some cloud DBs
      : false,
});

export default databaseConfig;
