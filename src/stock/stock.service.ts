import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockMovement) private movements: Repository<StockMovement>,
    @InjectRepository(Product) private products: Repository<Product>,
  ) {}

  async create(dto: CreateStockMovementDto) {
    const product = await this.products.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const movement = this.movements.create({
      product,
      quantity: dto.quantity,
      type: dto.type,
      reason: dto.reason || '',
    });

    return this.movements.save(movement);
  }

  async findAll() {
    return this.movements.find({ order: { createdAt: 'DESC' } });
  }
}
