import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  // 🔹 Total de ventas en un rango de fechas
  async sales(from?: string, to?: string) {
    const qb = this.orders.createQueryBuilder('o')
      .where('o.status = :status', { status: 'COMPLETADO' });

    if (from) qb.andWhere('o.createdAt >= :from', { from });
    if (to) qb.andWhere('o.createdAt <= :to', { to });

    const total = await qb.select('SUM(o.total)', 'sum').getRawOne();
    return { total: Number(total.sum) || 0 };
  }

  // 🔹 Productos más vendidos
  async topProducts(limit = 5) {
    const qb = this.orders.createQueryBuilder('o')
      .leftJoin('o.items', 'i')
      .leftJoin('i.product', 'p')
      .select('p.name', 'name')
      .addSelect('SUM(i.qty)', 'qty')
      .where('o.status = :status', { status: 'COMPLETADO' })
      .groupBy('p.id')
      .orderBy('qty', 'DESC')
      .limit(limit);

    return qb.getRawMany();
  }

  // 🔹 Productos con stock crítico
  async criticalStock() {
    const critical = await this.products.createQueryBuilder('p')
      .where('p.stock <= p.stockMin')
      .getMany();

    return critical;
  }
}
