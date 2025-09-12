import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async findAll(query?: string, page = 1, limit = 20) {
    const where = query ? [{ name: ILike(`%${query}%`) }, { sku: ILike(`%${query}%`) }] : {};
    const [data, total] = await this.repo.findAndCount({ where, skip: (page - 1) * limit, take: limit, order: { createdAt: 'DESC' } });
    return { data, total, page, limit };
  }

  async create(dto: CreateProductDto) { return this.repo.save(this.repo.create(dto)); }
  async findOne(id: string) { return this.repo.findOneByOrFail({ id }); }
  async update(id: string, partial: UpdateProductDto) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Product not found');
    Object.assign(entity, partial);
    return this.repo.save(entity);
  }
  async remove(id: string) { await this.repo.delete(id); return { ok: true }; }
}
