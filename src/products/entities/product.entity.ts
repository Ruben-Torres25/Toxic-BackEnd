import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) sku: string;
  @Column() name: string;
  @Column({ default: '' }) description: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) price: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) cost: number;
  @Column('int', { default: 0 }) stock: number;
  @Column('int', { default: 0 }) stockMin: number;
  @Column({ default: true }) isActive: boolean;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
