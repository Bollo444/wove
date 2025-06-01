import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile, StrategyOptions } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service'; // Assuming AuthService will handle user creation/linking

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService, // Or a dedicated OAuthUserService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'), // e.g., http://localhost:3001/auth/google/callback
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.birthday.read'], // Request birthday for age verification
      passReqToCallback: false, // Explicitly set based on validate signature
    } as StrategyOptions); // Cast to StrategyOptions to satisfy the constructor
    this.logger.log(
      'GoogleStrategy initialized. Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL are set in .env',
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, _json } = profile;
    this.logger.debug(`Google Profile received: ${JSON.stringify(profile._json)}`);

    const birthdayData = (_json as any).birthdays?.[0]?.date;
    let dateOfBirth: Date | undefined;
    if (birthdayData && birthdayData.year && birthdayData.month && birthdayData.day) {
      dateOfBirth = new Date(birthdayData.year, birthdayData.month - 1, birthdayData.day);
    } else {
      this.logger.warn(
        `Birthday data not found or incomplete in Google profile for ${emails?.[0]?.value}. Age verification might be impacted.`,
      );
    }

    const googleUser = {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
      googleId: profile.id,
      dateOfBirth,
    };

    try {
      this.logger.log(`User validated via Google: ${googleUser.email}`);
      done(null, googleUser);
    } catch (err) {
      this.logger.error(
        `Error during Google OAuth validation for ${googleUser.email}: ${err.message}`,
        err.stack,
      );
      done(err, false);
    }
  }
}
