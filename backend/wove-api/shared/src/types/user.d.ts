import { AgeTier } from './age-tier';
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
export interface UserRegistrationData {
    email: string;
    password: string;
    dateOfBirth?: string;
    parentEmail?: string;
}
