import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { StockService } from '../stock/stock.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase) private purchases: Repository<Purchase>,
    @InjectRepository(PurchaseItem) private items: Repository<PurchaseItem>,
    @InjectRepository(Supplier) private suppliers: Repository<Supplier>,
    @InjectRepository(Product) private products: Repository<Product>,
    private dataSource: DataSource,
    private stockService: StockService,
  ) {}

  async create(dto: CreatePurchaseDto) {
    const supplier = await this.suppliers.findOne({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Proveedor no encontrado');

    let total = 0;
    const items: PurchaseItem[] = [];

    await this.dataSource.transaction(async (trx) => {
      for (const it of dto.items) {
        const product = await this.products.findOne({ where: { id: it.productId } });
        if (!product) throw new NotFoundException('Producto no encontrado');

        const subtotal = Number(it.price) * it.qty;
        total += subtotal;

        // Actualizar stock
        product.stock += it.qty;
        product.cost = it.price; // actualizar costo promedio, opcional
        await trx.getRepository(Product).save(product);

        // Registrar movimiento de stock
        await this.stockService.create({
          productId: product.id,
          quantity: it.qty,
          type: 'IN',
          reason: `Compra a proveedor ${supplier.name}`,
        });

        const item = this.items.create({ product, qty: it.qty, price: it.price, subtotal });
        items.push(item);
      }

      const purchase = this.purchases.create({
        supplier,
        items,
        total,
      });

      await trx.getRepository(Purchase).save(purchase);
    });

    return { ok: true };
  }

  async findAll() {
    return this.purchases.find({ order: { createdAt: 'DESC' } });
  }
}
