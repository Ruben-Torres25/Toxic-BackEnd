import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' }) order: Order;
  @ManyToOne(() => Product) product: Product;

  @Column('int') qty: number;
  @Column('decimal', { precision: 10, scale: 2 }) price: number;
  @Column('decimal', { precision: 10, scale: 2 }) total: number;
}
