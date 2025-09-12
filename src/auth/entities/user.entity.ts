import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) email: string;

  @Column() passwordHash: string;

  @Column({ default: 'ADMIN' }) role: string; // ADMIN | USER

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
