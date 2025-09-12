import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';

export type OrderStatus = 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Customer, { nullable: true }) customer?: Customer;

  @Column({ type: 'text', default: 'PENDIENTE' }) status: OrderStatus;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) subtotal: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) discount: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) total: number;
  @Column({ default: '' }) notes: string;

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true }) items: OrderItem[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
