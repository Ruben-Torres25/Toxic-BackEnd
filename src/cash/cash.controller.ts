import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CashService } from './cash.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cash')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashController {
  constructor(private readonly service: CashService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() body: { type: 'INCOME' | 'EXPENSE'; amount: number; reason?: string }) {
    return this.service.create(body);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.service.findAll();
  }

  @Get('balance')
  @Roles('ADMIN')
  getBalance() {
    return this.service.getBalance();
  }
}
