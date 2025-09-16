import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashMovement } from './entities/cash-movement.entity';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashMovement)
    private repo: Repository<CashMovement>,
  ) {}

  async create(body: { type: 'INCOME' | 'EXPENSE'; amount: number; reason?: string }) {
    const movement = this.repo.create(body);
    return this.repo.save(movement);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async getBalance() {
    const movements = await this.repo.find();
    const income = movements
      .filter(m => m.type === 'INCOME')
      .reduce((sum, m) => sum + Number(m.amount), 0);
    const expense = movements
      .filter(m => m.type === 'EXPENSE')
      .reduce((sum, m) => sum + Number(m.amount), 0);
    return { income, expense, balance: income - expense };
  }
}
