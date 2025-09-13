import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int')
  quantity: number;

  @Column({ type: 'varchar' })
  type: 'IN' | 'OUT'; // IN = entrada (compra, cancelación), OUT = salida (venta)

  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
