import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Cashbox, CashboxStatus } from './entities/cashbox.entity';
import { CashMovement, CashMovementType } from './entities/cash-movement.entity';
import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cashbox) private readonly cashboxRepo: Repository<Cashbox>,
    @InjectRepository(CashMovement) private readonly movementRepo: Repository<CashMovement>,
  ) {}

  async getCurrentOpen(): Promise<Cashbox | null> {
    return this.cashboxRepo.findOne({
      where: { status: CashboxStatus.OPEN },
      relations: ['movements'],
      order: { openedAt: 'DESC' },
    });
  }

  async open(dto: OpenCashDto): Promise<Cashbox> {
    const existing = await this.getCurrentOpen();
    if (existing) throw new BadRequestException('Ya existe una caja abierta.');

    const cashbox = this.cashboxRepo.create({
      status: CashboxStatus.OPEN,
      openingAmount: dto.openingAmount.toFixed(2),
      closingAmount: '0.00',
      openedAt: new Date(),
      closedAt: null,
      notes: dto.notes ?? null,
    });
    return this.cashboxRepo.save(cashbox);
  }

  async close(dto: CloseCashDto): Promise<Cashbox> {
    const open = await this.getCurrentOpen();
    if (!open) throw new BadRequestException('No hay caja abierta para cerrar.');

    open.status = CashboxStatus.CLOSED;
    open.closingAmount = dto.closingAmount.toFixed(2);
    open.closedAt = new Date();
    open.notes = [open.notes, dto.notes].filter(Boolean).join(' | ');
    return this.cashboxRepo.save(open);
  }

  async addMovement(dto: CreateMovementDto): Promise<CashMovement> {
    const open = await this.getCurrentOpen();
    if (!open) throw new BadRequestException('No hay caja abierta.');

    const movement = this.movementRepo.create({
      cashbox: open,
      type: dto.type,
      amount: dto.amount.toFixed(2),
      description: dto.description ?? null,
      referenceId: dto.referenceId ?? null,
      referenceType: dto.referenceType ?? null,
    });
    return this.movementRepo.save(movement);
  }

  // Para registrar ventas automáticamente desde el módulo de ventas
  async recordSale(amount: number, saleId?: string) {
    return this.addMovement({
      type: CashMovementType.SALE,
      amount,
      description: 'Venta',
      referenceId: saleId,
      referenceType: 'SALE',
    });
  }

  async reportForDate(localDate: string) {
    // Interpretar como día local 00:00—23:59
    const start = new Date(`${localDate}T00:00:00`);
    const end = new Date(`${localDate}T23:59:59.999`);

    const boxes = await this.cashboxRepo.find({
      where: { openedAt: Between(start, end) },
      relations: ['movements'],
      order: { openedAt: 'ASC' },
    });

    // Si la caja se abrió antes del día, también considerar la caja abierta actual o la que estaba abierta ese día:
    const openBox = await this.getCurrentOpen();
    if (openBox && openBox.openedAt < start && (!openBox.closedAt || openBox.closedAt > start)) {
      if (!boxes.some(b => b.id === openBox.id)) boxes.unshift(openBox);
    }

    const movements = await this.movementRepo.find({
      where: { createdAt: Between(start, end) },
      relations: ['cashbox'],
      order: { createdAt: 'ASC' },
    });

    const openingAmount = boxes[0]?.openingAmount ? Number(boxes[0].openingAmount) : 0;

    let totalIncome = 0, totalExpense = 0, totalSales = 0;
    const mv = movements.map(m => {
      const amount = Number(m.amount);
      if (m.type === CashMovementType.EXPENSE) totalExpense += amount;
      if (m.type === CashMovementType.INCOME) totalIncome += amount;
      if (m.type === CashMovementType.SALE) totalSales += amount;
      return {
        id: m.id,
        type: m.type,
        amount,
        description: m.description ?? undefined,
        createdAt: m.createdAt.toISOString(),
      };
    });

    const closingAmount = boxes[boxes.length - 1]?.closingAmount
      ? Number(boxes[boxes.length - 1].closingAmount)
      : null;

    const balance = openingAmount + totalIncome + totalSales - totalExpense;

    return {
      date: localDate,
      openingAmount,
      closingAmount,
      totalIncome,
      totalExpense,
      totalSales,
      balance,
      movements: mv,
    };
  }

  async getById(id: string) {
    const box = await this.cashboxRepo.findOne({ where: { id }, relations: ['movements'] });
    if (!box) throw new NotFoundException('Caja no encontrada.');
    return box;
  }
}
