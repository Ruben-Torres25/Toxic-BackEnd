import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('sales')
  @Roles('ADMIN')
  sales(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.sales(from, to);
  }

  @Get('products/top')
  @Roles('ADMIN')
  topProducts(@Query('limit') limit?: string) {
    return this.service.topProducts(limit ? parseInt(limit, 10) : 5);
  }

  @Get('stock/critical')
  @Roles('ADMIN')
  criticalStock() {
    return this.service.criticalStock();
  }
}
