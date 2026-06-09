import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'mi_clave_secreta_kpop_store',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findEntityById(payload.sub);

    if (!user.isActive) {
      throw new UnauthorizedException('El usuario está inactivo.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}