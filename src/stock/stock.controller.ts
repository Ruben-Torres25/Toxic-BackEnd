import { Body, Controller, Get, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Get()
  list() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateStockMovementDto) {
    return this.service.create(dto);
  }
}
