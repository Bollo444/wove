import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User, AgeVerificationRequest, EmailVerificationToken } from '../../database/entities'; // Added EmailVerificationToken
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy'; // Import GoogleStrategy
import { AgeVerificationService } from './services/age-verification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AgeVerificationRequest, EmailVerificationToken]), // Added EmailVerificationToken
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  ],
  controllers: [AuthController],
  providers: [AuthService, AgeVerificationService, JwtStrategy, GoogleStrategy], // Add GoogleStrategy
  exports: [AuthService, AgeVerificationService, JwtStrategy, GoogleStrategy, PassportModule], // Export GoogleStrategy
})
export class AuthModule {}
