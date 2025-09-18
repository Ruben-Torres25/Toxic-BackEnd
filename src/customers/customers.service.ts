import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { AdjustBalanceDto } from './dto/adjust-balance.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Cliente no encontrado');
    return c;
  }

  async getBalance(id: string) {
    const c = await this.findOne(id);
    return { id: c.id, name: c.name, balance: Number(c.balance) };
  }

  async adjustBalance(id: string, dto: AdjustBalanceDto) {
    const c = await this.findOne(id);
    c.balance = (Number(c.balance) + dto.amount).toFixed(2);
    await this.repo.save(c);
    return { ok: true, id: c.id, newBalance: c.balance, reason: dto.reason };
  }

  // ⚡ Exportar clientes a CSV
  async exportCSV() {
    const customers = await this.findAll();
    const headers = ['id', 'name', 'phone', 'email', 'balance'];
    const rows = customers.map(c => [c.id, c.name, c.phone ?? '', c.email ?? '', c.balance]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csv;
  }
}
