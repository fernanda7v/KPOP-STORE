import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('products-by-category')
  getProductsByCategory() {
    return this.statsService.getProductsByCategory();
  }

  @Get('orders-by-status')
  getOrdersByStatus() {
    return this.statsService.getOrdersByStatus();
  }

  @Get('dashboard-summary')
  getDashboardSummary() {
    return this.statsService.getDashboardSummary();
  }
}
