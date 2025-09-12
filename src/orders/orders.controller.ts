import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  UseGuards 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // cualquier usuario logueado puede listar
  list() {
    return this.service.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard) // cualquier usuario logueado puede crear pedidos
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // 👈 solo admin confirma pedidos
  confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // 👈 solo admin cancela pedidos
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}
