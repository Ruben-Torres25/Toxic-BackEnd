import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashMovement } from './entities/cash-movement.entity';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashMovement)
    private readonly repo: Repository<CashMovement>,
  ) {}

  async create(body: { type: 'INCOME' | 'EXPENSE'; amount: number; reason?: string }) {
    const movement = this.repo.create({
      type: body.type,
      amount: Number(body.amount),
      reason: body.reason ?? '',
    });
    return this.repo.save(movement);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async getBalance() {
    const rows = await this.repo.find();
    const income = rows.filter(r => r.type === 'INCOME').reduce((s, r) => s + Number(r.amount), 0);
    const expense = rows.filter(r => r.type === 'EXPENSE').reduce((s, r) => s + Number(r.amount), 0);
    return { income, expense, balance: income - expense };
  }
}
