import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { StockModule } from '../stock/stock.module';
import { CashModule } from 'src/cash/cash.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Customer]), StockModule, CashModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
