import { AgeTier } from './age-tier';

/**
 * User interface representing the common properties of a user
 * shared between frontend and backend
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  verifiedAgeTier: AgeTier;
  currentAgeTier: AgeTier;
  isEmailVerified: boolean;
  parentalMonitoringEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User creation data interface for registration
 */
export interface UserRegistrationData {
  email: string;
  password: string;
  dateOfBirth?: string;
  parentEmail?: string; // Required for kids tier
}