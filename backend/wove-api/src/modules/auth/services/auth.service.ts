import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, EmailVerificationToken } from '../../../database/entities';
import { LoginDto } from '../dtos/login.dto';
import { RegistrationDto } from '../dtos/registration.dto';
import { AgeTier, UserRole } from '@shared/types';
import { ConfigService } from '@nestjs/config';
import { VerificationTokenType } from '../../../database/entities/email-verification-token.entity'; // Import enum
import { ParentalControlService } from '../../users/services/parental-control.service'; // Import ParentalControlService
import { v4 as uuidv4 } from 'uuid'; // For token generation
import { MailService } from '../../mail/mail.service'; // Import MailService

@Injectable()
export class AuthService {
  // Add logger if not already present
  // private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailVerificationToken) // Inject token repository
    private tokenRepository: Repository<EmailVerificationToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private parentalControlService: ParentalControlService, // Inject ParentalControlService
    private readonly mailService: MailService, // Inject MailService
  ) {}

  // Add logger if not already present
  public readonly logger = new Logger(AuthService.name);

  /**
   * Find or create user from Google OAuth profile
   * @param googleUser - Google user data from OAuth
   * @returns User entity
   */
  async findOrCreateUserFromGoogle(googleUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    googleId: string;
    accessToken: string;
    refreshToken?: string;
    dateOfBirth?: Date;
  }): Promise<User> {
    // First, try to find user by Google ID
    let user = await this.usersRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (user) {
      // Update Google tokens and profile info
      user.googleAccessToken = googleUser.accessToken;
      if (googleUser.refreshToken) {
        user.googleRefreshToken = googleUser.refreshToken;
      }
      if (googleUser.picture) {
        user.avatarUrl = googleUser.picture;
      }
      return await this.usersRepository.save(user);
    }

    // Try to find user by email
    user = await this.usersRepository.findOne({
      where: { email: googleUser.email },
    });

    if (user) {
      // Link existing account to Google
      user.googleId = googleUser.googleId;
      user.isGoogleLinked = true;
      user.googleAccessToken = googleUser.accessToken;
      if (googleUser.refreshToken) {
        user.googleRefreshToken = googleUser.refreshToken;
      }
      if (googleUser.picture && !user.avatarUrl) {
        user.avatarUrl = googleUser.picture;
      }
      
      // Update age verification if we have date of birth from Google
      if (googleUser.dateOfBirth && !user.dateOfBirth) {
        user.dateOfBirth = googleUser.dateOfBirth;
        const ageTier = this.calculateAgeTier(googleUser.dateOfBirth);
        user.currentAgeTier = ageTier;
        user.verifiedAgeTier = ageTier;
        user.isAgeVerified = true;
      }
      
      return await this.usersRepository.save(user);
    }

    // Create new user from Google profile
    const ageTier = googleUser.dateOfBirth 
      ? this.calculateAgeTier(googleUser.dateOfBirth)
      : AgeTier.UNVERIFIED;

    const newUser = this.usersRepository.create({
      email: googleUser.email,
      username: this.generateUsernameFromEmail(googleUser.email),
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      displayName: `${googleUser.firstName} ${googleUser.lastName}`,
      avatarUrl: googleUser.picture,
      dateOfBirth: googleUser.dateOfBirth,
      currentAgeTier: ageTier,
      verifiedAgeTier: ageTier,
      isEmailVerified: true, // Google emails are verified
      isAgeVerified: !!googleUser.dateOfBirth,
      googleId: googleUser.googleId,
      isGoogleLinked: true,
      googleAccessToken: googleUser.accessToken,
      googleRefreshToken: googleUser.refreshToken,
      password: '', // No password for Google OAuth users
      roles: [UserRole.USER],
      isParentalApprovalRequired: ageTier === AgeTier.KIDS,
    });

    return await this.usersRepository.save(newUser);
  }

  /**
   * Generate username from email
   * @param email - User email
   * @returns Generated username
   */
  private generateUsernameFromEmail(email: string): string {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${baseUsername}${randomSuffix}`;
  }

  /**
   * Update user's last login timestamp
   * @param userId - User ID
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
    });
  }

  /**
   * Register a new user
   * @param registrationDto - User registration data
   * @returns The newly created user object (without password)
   */
  async register(registrationDto: RegistrationDto): Promise<User> {
    const { email, password, username, dateOfBirth, parentalMonitoringEnabled, parentEmail } =
      registrationDto;

    // Check if user already exists with this email
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine initial age tier
    let initialAgeTier = AgeTier.UNVERIFIED;
    if (registrationDto.claimedAgeTier) {
      initialAgeTier = registrationDto.claimedAgeTier;
    }

    // Create a new user
    const user = new User();
    user.email = email;
    user.password = passwordHash; // Corrected field name
    user.username = username || email.split('@')[0];
    user.verifiedAgeTier = AgeTier.UNVERIFIED;
    user.currentAgeTier = initialAgeTier;
    user.isEmailVerified = false;
    user.parentalMonitoringEnabled = parentalMonitoringEnabled || false;

    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
      // Potentially set isParentalApprovalRequired based on age here if not already handled
      // For now, assuming claimedAgeTier or other logic sets this flag if needed
    }

    // Save the user to the database first to get an ID
    const savedUser = await this.usersRepository.save(user);

    if (parentalMonitoringEnabled && parentEmail) {
      savedUser.parentEmail = parentEmail;
      // Assuming Kids tier always requires parental approval
      if (savedUser.currentAgeTier === AgeTier.KIDS) {
        savedUser.isParentalApprovalRequired = true;
      }
      await this.usersRepository.save(savedUser); // Save again if parentEmail or isParentalApprovalRequired changed

      try {
        // Create the link request. This might throw if parent/child conditions aren't met.
        // The ParentalControlService.createParentalLink itself doesn't send an email.
        // It sets up the link to be approved by the child (or parent, depending on flow).
        // For direct parental consent via email, we'll use requestParentalConsent.
        this.logger.log(`Attempting to create parental link for child ${savedUser.email} with parent ${parentEmail}`);
        // We might not need to create a formal 'ParentalLink' entity here if the consent email
        // directly leads to approval. The current ParentalControlService.createParentalLink
        // is more for a child-initiated or parent-dashboard initiated link.
        // For now, let's assume the primary action is sending the consent email.
        await this.requestParentalConsent(savedUser, parentEmail);
      } catch (error) {
        this.logger.error(`Failed to initiate parental consent for ${savedUser.email} with parent ${parentEmail}: ${error.message}`, error.stack);
        // Decide if registration should fail or proceed with user's email verification only
        // For now, let's log and proceed with user's own email verification as a fallback.
        await this.createAndSendVerificationEmail(savedUser, savedUser.email, VerificationTokenType.EMAIL_VERIFICATION);
      }
    } else {
      // Send email verification for the user's own email if not under parental consent flow
      await this.createAndSendVerificationEmail(savedUser, savedUser.email, VerificationTokenType.EMAIL_VERIFICATION);
    }

    // Remove the password hash before returning the user
    const { password: _, ...userWithoutPassword } = savedUser; // Corrected field name
    return userWithoutPassword as User;
  }

  /**
   * Authenticate a user and return a JWT token
   * @param loginDto - Login credentials
   * @returns Object containing the access token and user details
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: Partial<User> }> {
    const { email, password } = loginDto;

    // Find the user by email with password included
    const user = await this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password', // Corrected field name
        'username',
        'verifiedAgeTier',
        'currentAgeTier',
        'isActive',
        'isSuspended',
        'roles', // Include roles for JWT payload
      ],
    });

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active and not suspended
    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password); // Corrected field name
    if (!isPasswordValid) {
      // Increment login attempts (would implement lockout in a full system)
      await this.usersRepository.increment({ id: user.id }, 'loginAttempts', 1);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lastLoginAt = new Date();

    // Generate refresh token
    const refreshToken = this.generateRefreshToken();
    user.refreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, roles: user.roles }; // Add roles to payload
    const accessToken = this.jwtService.sign(payload);

    // Remove sensitive data before returning the user
    const { password: _, refreshToken: __, ...userInfo } = user; // Corrected field name

    return {
      accessToken,
      refreshToken,
      user: userInfo,
    };
  }

  /**
   * Refresh an access token using a refresh token
   * @param userId - The user ID
   * @param refreshToken - The refresh token
   * @returns New access token
   */
  async refreshToken(userId: string, refreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Generate tokens for a user
   * @param user - User object
   * @returns Object containing access token and refresh token
   */
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    // Generate refresh token
    const refreshToken = this.generateRefreshToken();
    
    // Hash and save refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.save(user);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate a random refresh token
   * @returns Refresh token string
   */
  private generateRefreshToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate user by ID
   * @param userId - User ID to validate
   * @returns User object or null
   */
  async validateUserById(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'username',
        'verifiedAgeTier',
        'currentAgeTier',
        'isEmailVerified',
        'parentalMonitoringEnabled',
        'roles',
      ],
    });
  }

  /**
   * Create and send an email verification token.
   * @param user - The user for whom to send the verification.
   * @param emailToVerify - The email address to send the verification to.
   * @param tokenType - The type of verification.
   * @param expiresInMinutes - Token expiry time.
   */
  async createAndSendVerificationEmail(
    user: User,
    emailToVerify: string,
    tokenType: VerificationTokenType,
    expiresInMinutes: number = 60 * 24, // Default 24 hours
  ): Promise<void> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    const verificationToken = this.tokenRepository.create({
      userId: user.id,
      emailToVerify,
      token,
      type: tokenType,
      expiresAt,
    });
    await this.tokenRepository.save(verificationToken);

    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}&type=${tokenType}`;

    this.logger.log(
      `Generated verification link for ${emailToVerify} (${tokenType}): ${verificationLink}`,
    );

    let emailSubject: string;
    let templateName: string;
    let emailContext: any = {
        username: user.displayName || user.firstName || user.username,
        verificationLink,
        tokenType,
    };

    if (tokenType === VerificationTokenType.PARENTAL_CONSENT) {
        emailSubject = 'Wove: Parental Consent Required';
        templateName = 'parental-consent'; // Assuming parent's name is not directly available here, template might need adjustment
        // Context for parental consent might be different, e.g. child's name/email
        emailContext = {
            parentName: 'Guardian', // Placeholder, ideally get parent's name if available
            childEmail: user.email, // Child's email
            consentLink: verificationLink,
        };
    } else if (tokenType === VerificationTokenType.EMAIL_VERIFICATION) {
        emailSubject = 'Verify your email for Wove';
        templateName = 'email-verification';
    } else {
        // Fallback or error for unhandled token types
        this.logger.error(`Unhandled token type for email sending: ${tokenType}`);
        return; // Or throw an error
    }

    try {
      await this.mailService.sendEmail(
        emailToVerify,
        emailSubject,
        templateName,
        emailContext,
      );
      this.logger.log(`Verification email sent to ${emailToVerify} for token type ${tokenType}.`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${emailToVerify} for token type ${tokenType}: ${error.message}`,
        error.stack,
      );
      // Optionally, re-throw or handle the error appropriately
    }
  }

  /**
   * Verify an email token.
   * @param token - The verification token.
   * @param tokenType - The expected type of the token.
   * @returns The user associated with the token if valid.
   */
  async verifyEmailToken(token: string, tokenType: VerificationTokenType): Promise<User> {
    const verificationRecord = await this.tokenRepository.findOne({
      where: { token, type: tokenType, isUsed: false },
      relations: ['user'],
    });

    if (!verificationRecord) {
      throw new BadRequestException('Invalid or expired verification token.');
    }

    if (verificationRecord.expiresAt < new Date()) {
      await this.tokenRepository.remove(verificationRecord); // Clean up expired token
      throw new BadRequestException('Verification token has expired.');
    }

    const user = verificationRecord.user;
    if (!user) {
      // Should not happen if DB constraints are correct
      throw new BadRequestException('User not found for this token.');
    }

    // Mark token as used
    verificationRecord.isUsed = true;
    verificationRecord.usedAt = new Date();
    await this.tokenRepository.save(verificationRecord);

    // Perform action based on token type
    if (tokenType === VerificationTokenType.EMAIL_VERIFICATION) {
      user.isEmailVerified = true;
    } else if (tokenType === VerificationTokenType.PARENTAL_CONSENT) {
      // This assumes the userId on the token is the child's ID
      // and emailToVerify was the parent's email.
      // The ParentalControlService might handle the actual linking logic.
      user.hasParentalApproval = true; // Or trigger a more complex approval flow
      this.logger.log(
        `Parental consent verified for user ${user.id} via parent email ${verificationRecord.emailToVerify}`,
      );
    }
    // Add other token type handling (e.g., PASSWORD_RESET) here

    await this.usersRepository.save(user);
    return user;
  }

  // Placeholder for a method that might be called from ParentalControlService or during registration
  async requestParentalConsent(childUser: User, parentEmail: string): Promise<void> {
    if (!childUser.isParentalApprovalRequired) {
      this.logger.warn(`Parental consent requested for user ${childUser.id} but not required.`);
      return;
    }
    await this.createAndSendVerificationEmail(
      childUser,
      parentEmail,
      VerificationTokenType.PARENTAL_CONSENT,
    );
    this.logger.log(
      `Parental consent email request initiated for child ${childUser.id} to parent ${parentEmail}.`,
    );
  }

  /**
   * Calculate age tier based on date of birth
   * @param dateOfBirth - User's date of birth
   * @returns AgeTier enum value
   */
  private calculateAgeTier(dateOfBirth: Date | string): AgeTier {
    if (!dateOfBirth) {
        this.logger.warn('calculateAgeTier called with no dateOfBirth, returning UNVERIFIED.');
        return AgeTier.UNVERIFIED;
    }

    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      this.logger.warn(`Invalid dateOfBirth provided to calculateAgeTier: ${dateOfBirth}, returning UNVERIFIED.`);
      return AgeTier.UNVERIFIED;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    this.logger.log(`Calculated age: ${age} for DOB: ${dob.toISOString()}`);

    if (age < 0) {
        this.logger.warn(`Calculated negative age: ${age} for DOB: ${dob.toISOString()}. Returning UNVERIFIED.`);
        return AgeTier.UNVERIFIED; // Should not happen with valid DOB from reliable source like Google
    }
    if (age < 13) {
      return AgeTier.KIDS;
    } else if (age < 18) {
      return AgeTier.TEENS;
    } else {
      return AgeTier.ADULTS;
    }
  }
}
