import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, s => s.purchases, { eager: true })
  supplier: Supplier;

  @OneToMany(() => PurchaseItem, i => i.purchase, { cascade: ['insert'], eager: true })
  items: PurchaseItem[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: string;

  @Column({ type: 'timestamptz' })
  purchasedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
