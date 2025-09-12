import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() name: string;

  @Column({ default: '' }) phone: string;

  @Column({ default: '' }) email: string;

  @Column({ default: '' }) address: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
