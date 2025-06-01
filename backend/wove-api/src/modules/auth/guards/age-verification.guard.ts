import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AgeTier } from '@shared/types';

/**
 * Metadata key for setting the required age tier on routes
 */
export const REQUIRED_AGE_TIER_KEY = 'requiredAgeTier';

/**
 * Guard to check if a user's verified age tier meets the required age tier for a resource
 */
@Injectable()
export class AgeVerificationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required age tier from the route metadata
    const requiredAgeTier = this.reflector.getAllAndOverride<AgeTier>(REQUIRED_AGE_TIER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no age requirement is specified, allow access
    if (!requiredAgeTier) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user is present in the request, deny access
    if (!user) {
      throw new ForbiddenException('Authentication required for age-restricted content');
    }

    // Determine if the user's verified age tier is sufficient
    const isAgeTierSufficient = this.isAgeTierSufficient(user.verifiedAgeTier, requiredAgeTier);

    if (!isAgeTierSufficient) {
      throw new ForbiddenException('Age verification required to access this content');
    }

    return true;
  }

  /**
   * Check if a user's age tier is sufficient for the required age tier
   * @param userAgeTier - The user's verified age tier
   * @param requiredAgeTier - The required age tier for the resource
   * @returns boolean
   */
  private isAgeTierSufficient(userAgeTier: AgeTier, requiredAgeTier: AgeTier): boolean {
    const ageTierHierarchy = [AgeTier.UNVERIFIED, AgeTier.KIDS, AgeTier.TEENS, AgeTier.ADULTS];

    const userTierIndex = ageTierHierarchy.indexOf(userAgeTier);
    const requiredTierIndex = ageTierHierarchy.indexOf(requiredAgeTier);

    return userTierIndex >= requiredTierIndex;
  }
}

/**
 * Decorator to set the required age tier for a route
 * @param ageTier - The required age tier
 * @returns DecoratorFunction
 */
export const RequiredAgeTier = (ageTier: AgeTier) => {
  return (target: any, key?: string | symbol, descriptor?: any) => {
    if (descriptor) {
      // Method decorator
      Reflect.defineMetadata(REQUIRED_AGE_TIER_KEY, ageTier, target, key as string | symbol);
    } else {
      // Class decorator
      Reflect.defineMetadata(REQUIRED_AGE_TIER_KEY, ageTier, target);
    }
    return descriptor;
  };
};
