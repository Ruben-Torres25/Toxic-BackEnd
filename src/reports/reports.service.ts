import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  // Total de ventas en un rango (status COMPLETADO)
  async sales(from?: string, to?: string) {
    const qb = this.orders.createQueryBuilder('o')
      .select('SUM(o.total)', 'total')
      .addSelect('COUNT(o.id)', 'orders')
      .where('o.status = :status', { status: 'COMPLETADO' });

    if (from) qb.andWhere('o.createdAt >= :from', { from });
    if (to) qb.andWhere('o.createdAt <= :to', { to });

    const row = await qb.getRawOne<{ total: string; orders: string }>();
    return {
      total: Number(row?.total ?? 0),
      orders: Number(row?.orders ?? 0),
      from: from ?? null,
      to: to ?? null,
    };
  }

  // Top productos vendidos (por cantidad)
  async topProducts(limit = 5) {
    const qb = this.orders.manager
      .createQueryBuilder()
      .select('p.id', 'productId')
      .addSelect('p.name', 'name')
      .addSelect('SUM(oi.qty)', 'qty')
      .from('order_items', 'oi')
      .innerJoin('products', 'p', 'p.id = oi.productId')
      .innerJoin('orders', 'o', 'o.id = oi.orderId')
      .where('o.status = :status', { status: 'COMPLETADO' })
      .groupBy('p.id, p.name')
      .orderBy('qty', 'DESC')
      .limit(limit);

    const rows = await qb.getRawMany<{ productId: string; name: string; qty: string }>();
    return rows.map(r => ({ productId: r.productId, name: r.name, qty: Number(r.qty) }));
  }

  // Productos con stock crítico
  async criticalStock() {
    return this.products.createQueryBuilder('p')
      .where('p.stock <= p.stockMin')
      .orderBy('p.stock', 'ASC')
      .getMany();
  }
}
