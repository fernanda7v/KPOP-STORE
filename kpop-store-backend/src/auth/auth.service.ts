import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessLogsService } from '../access-logs/access-logs.service';
import { AccessEvent } from '../access-logs/entities/access-log.entity';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface RequestInfo {
  ip?: string;
  headers?: {
    [key: string]: string | string[] | undefined;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly accessLogsService: AccessLogsService,
  ) {}

  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register(registerDto: RegisterDto) {
    return this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      role: UserRole.CLIENTE,
    });
  }

  async login(loginDto: LoginDto, request: RequestInfo) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('El usuario está inactivo.');
    }

    const passwordIsValid = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    await this.accessLogsService.registerAccess(
      user.id,
      AccessEvent.INGRESO,
      request,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async logout(userId: number, request: RequestInfo) {
    await this.accessLogsService.registerAccess(
      userId,
      AccessEvent.SALIDA,
      request,
    );

    return {
      message: 'Salida del sistema registrada correctamente.',
    };
  }
}