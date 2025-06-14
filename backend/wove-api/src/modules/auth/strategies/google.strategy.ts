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
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.birthday.read'], // Added birthday scope
    });
    this.logger.log(
      'GoogleStrategy initialized. Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL are set in .env',
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any, // Profile type from 'passport-google-oauth20'
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos, _json } = profile; // Added _json to access raw profile data
    this.logger.log(`Validating Google profile for email: ${emails?.[0]?.value}`);

    if (!emails || emails.length === 0) {
      this.logger.error('Google profile did not return an email.');
      return done(new Error('No email found in Google profile'), false);
    }

    let dateOfBirth: Date | undefined = undefined;
    // Google People API returns birthdays in the 'birthdays' field
    // The structure is an array, and we need to parse year, month, day
    // Example: _json.birthdays = [ { metadata: { primary: true, source: { type: 'ACCOUNT', id: 'xxx' } }, date: { year: 1990, month: 1, day: 15 } } ]
    if (_json?.birthdays && Array.isArray(_json.birthdays) && _json.birthdays.length > 0) {
      const birthdayEntry = _json.birthdays.find(b => b.date && b.date.year && b.date.month && b.date.day);
      if (birthdayEntry && birthdayEntry.date) {
        const { year, month, day } = birthdayEntry.date;
        // Ensure year, month, and day are valid numbers before creating a Date object
        if (typeof year === 'number' && typeof month === 'number' && typeof day === 'number') {
          dateOfBirth = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
          this.logger.log(`Extracted date of birth: ${dateOfBirth.toISOString()}`);
        } else {
          this.logger.warn('Birthday data found but year, month, or day was not a number:', birthdayEntry.date);
        }
      } else {
        this.logger.log('No primary birthday entry with year, month, and day found in Google profile.');
      }
    } else {
      this.logger.log('No birthdays field found or it is empty in Google profile _json.');
    }

    const googleUser = {
      googleId: id,
      email: emails[0].value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value,
      accessToken,
      refreshToken, // Note: refreshToken might not always be provided by Google
      dateOfBirth, // Assign extracted date of birth
    };

    this.logger.debug(`Google user constructed: ${JSON.stringify(googleUser)}`);

    // Here, you might want to call authService to find or create the user
    // For now, we just pass the constructed googleUser to the callback
    // The AuthController's google/callback route will handle user processing
    return done(null, googleUser);
  }
}
