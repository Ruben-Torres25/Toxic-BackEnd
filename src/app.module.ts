import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import options from './config/ormconfig';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { StockModule } from './stock/stock.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options as any),
    ProductsModule,
    OrdersModule,
    CustomersModule,
    StockModule,
    SuppliersModule,
  ],
})
export class AppModule {}
