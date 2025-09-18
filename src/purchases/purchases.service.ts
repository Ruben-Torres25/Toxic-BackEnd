import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(PurchaseItem) private readonly itemRepo: Repository<PurchaseItem>,
    @InjectRepository(Supplier) private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreatePurchaseDto) {
    if (!dto.items?.length) throw new BadRequestException('La compra debe tener ítems.');

    const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
    if (!supplier) throw new BadRequestException('Proveedor inválido.');

    return this.dataSource.transaction(async manager => {
      // cargar productos y validar
      const productIds = dto.items.map(i => i.productId);
      const products = await manager.getRepository(Product).findByIds(productIds as any);
      const productsMap = new Map(products.map(p => [p.id, p]));
      if (products.length !== productIds.length) {
        throw new BadRequestException('Uno o más productos no existen.');
      }

      // construir compra
      const items: PurchaseItem[] = [];
      let total = 0;

      for (const it of dto.items) {
        const prod = productsMap.get(it.productId)!;
        const subtotal = it.quantity * it.unitCost;
        total += subtotal;

        const item = manager.create(PurchaseItem, {
          product: prod,
          quantity: it.quantity,
          unitCost: it.unitCost.toFixed(2),
          subtotal: subtotal.toFixed(2),
        });
        items.push(item);

        // aumentar stock
        const newStock = Number(prod.stock ?? 0) + it.quantity;
        await manager.getRepository(Product).update({ id: prod.id }, { stock: newStock });
      }

      const purchase = manager.create(Purchase, {
        supplier,
        items,
        total: total.toFixed(2),
        purchasedAt: new Date(dto.purchasedAt),
        notes: dto.notes ?? null,
      });

      return manager.save(purchase);
    });
  }

  findAll() {
    return this.purchaseRepo.find({ order: { purchasedAt: 'DESC' } });
  }

  async findOne(id: string) {
    const p = await this.purchaseRepo.findOne({ where: { id } });
    if (!p) throw new BadRequestException('Compra no encontrada.');
    return p;
  }
}
