import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' })
  purchase: Purchase;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  qty: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number; // 👈 igual que en order_items
}
