import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';
import { StockModule } from '../stock/stock.module';
import { CashModule } from '../cash/cash.module'; // 👈 agregar

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseItem, Supplier, Product]),
    StockModule,
    CashModule, // 👈 agregar
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
