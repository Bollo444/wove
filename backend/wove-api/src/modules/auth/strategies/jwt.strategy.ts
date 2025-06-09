import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../database/entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'wove-development-secret-key',
    });
  }

  /**
   * Validate the JWT payload and return the user
   * @param payload - The decoded JWT payload
   * @returns The user object or throws an UnauthorizedException
   */
  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
      select: [
        'id',
        'email',
        'username',
        'verifiedAgeTier',
        'currentAgeTier',
        'isEmailVerified',
        'parentalMonitoringEnabled',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('User account is suspended');
    }

    return user;
  }
}
