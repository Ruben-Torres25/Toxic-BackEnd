import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export type StockMovementType = 'IN' | 'OUT' | 'ADJUST';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int') quantity: number;

  @Column({ type: 'text' })
  type: StockMovementType; // IN = ingreso, OUT = salida, ADJUST = ajuste manual

  @Column({ default: '' })
  reason: string; // ej: "Venta confirmada", "Compra a proveedor", "Cancelación"

  @CreateDateColumn()
  createdAt: Date;
}
