import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface RequestWithUser {
  user: {
    id: number;
    email: string;
    role: string;
  };
  ip?: string;
  headers?: {
    [key: string]: string | string[] | undefined;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() request: RequestWithUser) {
    return this.authService.login(loginDto, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() request: RequestWithUser) {
    return this.usersService.findOne(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() request: RequestWithUser) {
    return this.authService.logout(request.user.id, request);
  }
}