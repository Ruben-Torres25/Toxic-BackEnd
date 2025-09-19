import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './config/ormconfig';

// importa tus módulos reales
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { CashModule } from './cash/cash.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    OrdersModule,
    ProductsModule,
    CustomersModule,
    CashModule,
    SuppliersModule,
    PurchasesModule,
  ],
})
export class AppModule {}
