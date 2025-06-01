import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, ParentalLink } from '../../database/entities';
import { UserService } from './services/user.service';
import { ParentalControlService } from './services/parental-control.service';
import { UsersController } from './controllers/users.controller';
import { ParentalControlController } from './controllers/parental-control.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ParentalLink]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'wove-development-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d',
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [UsersController, ParentalControlController],
  providers: [UserService, ParentalControlService],
  exports: [UserService, ParentalControlService],
})
export class UsersModule {}
