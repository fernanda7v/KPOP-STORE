import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { AccessLogsService } from './access-logs.service';

@Controller('access-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Get()
  findAll() {
    return this.accessLogsService.findAll();
  }
}