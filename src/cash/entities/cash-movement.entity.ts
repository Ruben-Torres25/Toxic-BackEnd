import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cashbox } from './cashbox.entity';

export enum CashMovementType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SALE = 'SALE',
}

@Entity('cash_movements')
export class CashMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cashbox, c => c.movements, { onDelete: 'CASCADE', eager: false })
  cashbox: Cashbox;

  @Column({ type: 'enum', enum: CashMovementType })
  type: CashMovementType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // opcional: para enlazar con ventas/IDs externos
  @Column({ type: 'varchar', length: 64, nullable: true })
  referenceId: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  referenceType: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
