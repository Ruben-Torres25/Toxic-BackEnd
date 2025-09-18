import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AdjustBalanceDto } from './dto/adjust-balance.dto';
import { Response } from 'express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/balance')
  getBalance(@Param('id') id: string) {
    return this.service.getBalance(id);
  }

  @Post(':id/adjust')
  adjust(@Param('id') id: string, @Body() dto: AdjustBalanceDto) {
    return this.service.adjustBalance(id, dto);
  }

  @Get('export/csv')
  async exportCSV(@Res() res: Response) {
    const csv = await this.service.exportCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
  }
}
