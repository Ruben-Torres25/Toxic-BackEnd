import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(@InjectRepository(Supplier) private readonly repo: Repository<Supplier>) {}

  async create(dto: CreateSupplierDto) {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException('Ya existe un proveedor con ese nombre.');
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Proveedor no encontrado.');
    return s;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const s = await this.findOne(id);
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
