import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Purchase } from './purchase.entity';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.items)
  purchase: Purchase;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  qty: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
