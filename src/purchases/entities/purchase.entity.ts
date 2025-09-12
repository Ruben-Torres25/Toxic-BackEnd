import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Supplier, { eager: true })
  supplier: Supplier;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true, eager: true })
  items: PurchaseItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;
}
