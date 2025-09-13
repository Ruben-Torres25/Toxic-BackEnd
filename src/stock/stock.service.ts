import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement) private movements: Repository<StockMovement>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  async create(data: { productId: string; quantity: number; type: 'IN' | 'OUT'; reason?: string }) {
    const product = await this.products.findOne({ where: { id: data.productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const movement = this.movements.create({
      product,
      quantity: data.quantity,
      type: data.type,
      reason: data.reason,
    });

    return this.movements.save(movement);
  }

  async findAll(query?: string) {
    const qb = this.movements.createQueryBuilder('m')
      .leftJoinAndSelect('m.product', 'p')
      .orderBy('m.createdAt', 'DESC');

    if (query) {
      qb.where('p.name ILIKE :q OR p.sku ILIKE :q OR m.reason ILIKE :q', { q: `%${query}%` });
    }

    return qb.getMany();
  }
}
