import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import options from './config/ormconfig';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { StockModule } from './stock/stock.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AuthModule } from './auth/auth.module';
import { CashModule } from './cash/cash.module';
import { ReportsModule } from './reports/reports.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(options as any),
    ProductsModule,
    OrdersModule,
    CustomersModule,
    StockModule,
    SuppliersModule,
    AuthModule,
    CashModule,
    ReportsModule,
    PurchasesModule,
  ],
})
export class AppModule {}
