import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  UseGuards 
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get()
  @UseGuards(JwtAuthGuard) // cualquier usuario logueado puede ver compras
  list() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // 👈 solo admin puede registrar compras
  create(@Body() dto: CreatePurchaseDto) {
    return this.service.create(dto);
  }
}
