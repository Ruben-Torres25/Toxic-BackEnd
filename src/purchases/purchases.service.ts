import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { Product } from '../products/entities/product.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { StockService } from '../stock/stock.service';
import { CashService } from '../cash/cash.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase) private purchases: Repository<Purchase>,
    @InjectRepository(PurchaseItem) private items: Repository<PurchaseItem>,
    @InjectRepository(Product) private products: Repository<Product>,
    @InjectRepository(Supplier) private suppliers: Repository<Supplier>,
    private stockService: StockService,
    private cashService: CashService,
  ) {}

  async findAll() {
    return this.purchases.find({ relations: ['items', 'supplier'] });
  }

  async create(dto: CreatePurchaseDto) {
    const supplier = await this.suppliers.findOne({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');

    let total = 0;
    const purchase = this.purchases.create({
      supplier,
      items: [],
    });

    for (const it of dto.items) {
      const p = await this.products.findOne({ where: { id: it.productId } });
      if (!p) throw new NotFoundException('Producto no encontrado');

      const subtotal = it.price * it.qty;
      total += subtotal;

      const item = this.items.create({
        product: p,
        qty: it.qty,
        price: it.price,
        subtotal,
      });
      purchase.items.push(item);

      p.stock += it.qty;
      await this.products.save(p);

      await this.stockService.create({
        productId: p.id,
        quantity: it.qty,
        type: 'IN',
        reason: `Compra a proveedor - ${supplier.name}`,
      });
    }

    purchase.total = total;
    await this.purchases.save(purchase);

    // 👇 Registrar gasto en caja
    await this.cashService.create({
      type: 'EXPENSE',
      amount: total,
      reason: `Compra proveedor - ${supplier.name}`,
    });

    return purchase;
  }
}
