import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  BadRequestException,
  Query, // Added Query
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AgeVerificationService } from '../services/age-verification.service';
import { LoginDto } from '../dtos/login.dto';
import { RegistrationDto } from '../dtos/registration.dto';
import { AgeVerificationRequestDto } from '../dtos/age-verification.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AgeTier } from '@shared/types';
import { User } from '../../../database/entities';
import { GetUser } from '../decorators/get-user.decorator';
import { VerificationTokenType } from '../../../database/entities/email-verification-token.entity';
import { ConfigService } from '@nestjs/config';

/**
 * Controller handling authentication, OAuth, email verification, and age verification operations
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private ageVerificationService: AgeVerificationService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new user account
   */
  @Post('register')
  async register(@Body(ValidationPipe) registrationDto: RegistrationDto) {
    return this.authService.register(registrationDto);
  }

  /**
   * Log in a user
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh an access token using a refresh token
   */
  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req, @Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshToken(req.user.id, body.refreshToken);
  }

  /**
   * Create an age verification request
   */
  @Post('verify-age')
  @UseGuards(JwtAuthGuard)
  async verifyAge(@Req() req, @Body(ValidationPipe) verificationDto: AgeVerificationRequestDto) {
    return this.ageVerificationService.createVerificationRequest(req.user.id, verificationDto);
  }

  /**
   * Get all verification requests for the authenticated user
   */
  @Get('verification-requests')
  @UseGuards(JwtAuthGuard)
  async getVerificationRequests(@Req() req) {
    return this.ageVerificationService.getVerificationRequestsForUser(req.user.id);
  }

  /**
   * Get a specific verification request by ID
   */
  @Get('verification-requests/:id')
  @UseGuards(JwtAuthGuard)
  async getVerificationRequest(@Req() req, @Param('id') requestId: string) {
    const request = await this.ageVerificationService.getVerificationRequest(requestId);

    // Only allow users to access their own verification requests
    if (request.userId !== req.user.id) {
      throw new BadRequestException('You do not have permission to view this verification request');
    }

    return request;
  }

  /**
   * Get the current user profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetUser() user: User) {
    // Use GetUser decorator
    return user;
  }

  /**
   * Initiates Google OAuth flow
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard will redirect to Google
  }

  /**
   * Google OAuth callback
   * This is where Google redirects after successful authentication.
   * The GoogleStrategy's validate method will have run, and its result
   * (the googleUser object) will be available on req.user.
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res() res,
    @GetUser() googleUser: any,
  ) {
    try {
      this.authService.logger.log(`Google callback with user: ${googleUser.email}`);
      
      // Find or create user from Google profile
      const user = await this.authService.findOrCreateUserFromGoogle({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.googleId,
        accessToken: googleUser.accessToken,
        dateOfBirth: googleUser.dateOfBirth,
      });

      // Generate JWT tokens
      const tokens = await this.authService.generateTokens(user);
      
      // Update last login
      await this.authService.updateLastLogin(user.id);

      // Redirect to frontend with tokens
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&userId=${user.id}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      this.authService.logger.error(`Google OAuth callback error: ${error.message}`, error.stack);
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?message=Authentication failed`);
    }

    // Example of what authService might do:
    // const appUser = await this.authService.handleGoogleLogin(googleUser);
    // return this.authService.login(appUser); // Assuming login returns tokens

    return {
      message:
        'Google authentication successful. User data received. Implement token generation and user processing.',
      googleProfile: googleUser,
      // tokens: await this.authService.generateTokensForOAuthUser(googleUser) // This method needs to be created in AuthService
    };
  }

  /**
   * Verify an email using a token
   */
  @Get('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
    @Query('type') type: VerificationTokenType = VerificationTokenType.EMAIL_VERIFICATION,
  ) {
    if (!Object.values(VerificationTokenType).includes(type)) {
      throw new BadRequestException('Invalid verification type specified.');
    }

    const user = await this.authService.verifyEmailToken(token, type);

    let successMessage = 'Email successfully verified.';
    if (type === VerificationTokenType.PARENTAL_CONSENT) {
      successMessage = 'Parental consent successfully verified.';
    }

    return {
      message: successMessage,
      userId: user.id,
      email: user.email,
    };
  }

  // Example endpoint to trigger a parental consent email (for testing/dev)
  @Post('request-parental-consent/:childId')
  @UseGuards(JwtAuthGuard)
  async requestParentalConsentManually(
    @Param('childId') childId: string,
    @Body('parentEmail') parentEmail: string,
    @GetUser() requestingUser: User,
  ) {
    if (!parentEmail) throw new BadRequestException('Parent email is required.');

    // const childUser = await this.usersRepository.findOne({where: {id: childId}}); // Needs UsersRepository/Service
    // if(!childUser) throw new BadRequestException('Child user not found.');
    // For now, assuming childUser object would be fetched and passed to authService
    const mockChildUser = { id: childId, isParentalApprovalRequired: true } as User; // Mock user for now

    // Add permission checks here: e.g., is requestingUser the parent of childId, or an admin?

    await this.authService.requestParentalConsent(mockChildUser, parentEmail);
    return { message: `Parental consent email requested for ${parentEmail}.` };
  }
}
