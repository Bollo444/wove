import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities';
import { UserRole } from '@shared/types';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Load fresh user data to ensure we have current role information
    const currentUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }

    // Check if user has moderator role or higher privileges
    const hasAccess = currentUser.roles?.some(role =>
      [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(role),
    );

    if (!hasAccess) {
      throw new ForbiddenException('User does not have moderator privileges');
    }

    return true;
  }
}
