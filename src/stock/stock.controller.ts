import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  @Roles('ADMIN') // solo admin puede consultar movimientos
  findAll(@Query('query') query?: string) {
    return this.service.findAll(query);
  }
}
