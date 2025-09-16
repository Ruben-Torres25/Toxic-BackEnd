import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { StockModule } from '../stock/stock.module';
import { CashModule } from '../cash/cash.module'; // 👈 relativo

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, Customer]),
    StockModule,
    CashModule, // 👈 para inyectar CashService
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
