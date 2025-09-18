import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CashMovement } from './cash-movement.entity';

export enum CashboxStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('cashboxes')
export class Cashbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CashboxStatus, default: CashboxStatus.OPEN })
  status: CashboxStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  openingAmount: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  closingAmount: string;

  @Column({ type: 'timestamptz' })
  openedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => CashMovement, m => m.cashbox, { cascade: ['insert', 'update'] })
  movements: CashMovement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
