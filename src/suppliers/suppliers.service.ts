import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(@InjectRepository(Supplier) private repo: Repository<Supplier>) {}

  async findAll(query?: string, page = 1, limit = 20) {
    const where = query ? [
      { name: ILike(`%${query}%`) },
      { email: ILike(`%${query}%`) }
    ] : {};
    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async create(dto: CreateSupplierDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async findOne(id: string) {
    const supplier = await this.repo.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.repo.save(supplier);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
