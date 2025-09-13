import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, Product])],
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
