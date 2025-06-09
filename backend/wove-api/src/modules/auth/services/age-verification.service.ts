import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AgeVerificationRequest } from '../../../database/entities';
import { AgeVerificationRequestDto } from '../dtos/age-verification.dto';
import { ConfigService } from '@nestjs/config';
import { VerificationMethod, VerificationStatus, AgeTier } from '@shared/types';

@Injectable()
export class AgeVerificationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AgeVerificationRequest)
    private verificationRequestRepository: Repository<AgeVerificationRequest>,
    private configService: ConfigService,
  ) {}

  /**
   * Create a new age verification request
   * @param userId - User ID
   * @param verificationDto - Age verification request data
   * @returns Created verification request
   */
  async createVerificationRequest(
    userId: string,
    verificationDto: AgeVerificationRequestDto,
  ): Promise<AgeVerificationRequest> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if there's an existing pending request
    const existingRequest = await this.verificationRequestRepository.findOne({
      where: {
        userId,
        status: VerificationStatus.PENDING,
        method: verificationDto.method,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('A pending verification request already exists');
    }

    // Create the verification request
    const verificationRequest = new AgeVerificationRequest();
    verificationRequest.userId = userId;
    verificationRequest.method = verificationDto.method;
    verificationRequest.status = VerificationStatus.PENDING;
    verificationRequest.verificationData = verificationDto.verificationData || {};

    // Set expiration date (48 hours from now)
    const expirationHours = 48;
    verificationRequest.expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    // For automatic methods or self-declaration, process immediately
    if (this.shouldProcessImmediately(verificationDto.method)) {
      return this.processAutomaticVerification(verificationRequest, verificationDto);
    }

    // For manual verification methods, save the request for later processing
    return this.verificationRequestRepository.save(verificationRequest);
  }

  /**
   * Process the outcome of a verification request
   * @param requestId - Verification request ID
   * @param isApproved - Whether the verification was approved
   * @param notes - Optional reviewer notes
   * @param verifiedAgeTier - The verified age tier (if approved)
   */
  async processVerificationOutcome(
    requestId: string,
    isApproved: boolean,
    notes?: string,
    verifiedAgeTier?: AgeTier,
  ): Promise<AgeVerificationRequest> {
    const verificationRequest = await this.verificationRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!verificationRequest) {
      throw new NotFoundException('Verification request not found');
    }

    if (verificationRequest.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('This verification request has already been processed');
    }

    verificationRequest.status = isApproved
      ? VerificationStatus.VERIFIED
      : VerificationStatus.REJECTED;

    verificationRequest.verifiedAt = new Date();
    verificationRequest.notes = notes || undefined;

    if (isApproved && verifiedAgeTier) {
      // Update the user's verified age tier
      await this.usersRepository.update(
        { id: verificationRequest.userId },
        {
          verifiedAgeTier,
          currentAgeTier: verifiedAgeTier,
        },
      );
    }

    return this.verificationRequestRepository.save(verificationRequest);
  }

  /**
   * Get verification requests for a user
   * @param userId - User ID
   * @returns Array of verification requests
   */
  async getVerificationRequestsForUser(userId: string): Promise<AgeVerificationRequest[]> {
    return this.verificationRequestRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a single verification request by ID
   * @param requestId - Verification request ID
   * @returns Verification request
   */
  async getVerificationRequest(requestId: string): Promise<AgeVerificationRequest> {
    const request = await this.verificationRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException('Verification request not found');
    }

    return request;
  }

  /**
   * Check if a verification method should be processed immediately
   * @param method - Verification method
   */
  private shouldProcessImmediately(method: VerificationMethod): boolean {
    return [VerificationMethod.SELF_DECLARATION, VerificationMethod.AUTOMATED_QUESTION].includes(
      method,
    );
  }

  /**
   * Process automatic verification methods
   * @param verificationRequest - The verification request entity
   * @param verificationDto - The verification request data
   */
  private async processAutomaticVerification(
    verificationRequest: AgeVerificationRequest,
    verificationDto: AgeVerificationRequestDto,
  ): Promise<AgeVerificationRequest> {
    let isApproved = false;
    let verifiedAgeTier = AgeTier.UNVERIFIED;

    // Self-declaration handling
    if (verificationRequest.method === VerificationMethod.SELF_DECLARATION) {
      isApproved = true;

      // Basic age calculation if date of birth provided
      if (verificationDto.dateOfBirth) {
        const birthDate = new Date(verificationDto.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        // Adjust age if birthday hasn't occurred yet this year
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // Set age tier based on calculated age
        if (age < 13) {
          verifiedAgeTier = AgeTier.KIDS;
        } else if (age < 18) {
          verifiedAgeTier = AgeTier.TEENS;
        } else {
          verifiedAgeTier = AgeTier.ADULTS;
        }
      }
    }

    // Save with automatic processing result
    verificationRequest.status = isApproved
      ? VerificationStatus.VERIFIED
      : VerificationStatus.REJECTED;
    verificationRequest.verifiedAt = new Date();

    await this.verificationRequestRepository.save(verificationRequest);

    if (isApproved) {
      // Update the user's verified age tier
      await this.usersRepository.update(
        { id: verificationRequest.userId },
        {
          verifiedAgeTier,
          currentAgeTier: verifiedAgeTier,
        },
      );
    }

    return verificationRequest;
  }
}
