import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AccessEvent {
  INGRESO = 'ingreso',
  SALIDA = 'salida',
}

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 50 })
  ip: string;

  @Column({
    type: 'enum',
    enum: AccessEvent,
  })
  event: AccessEvent;

  @Column({ type: 'text' })
  browser: string;

  @CreateDateColumn()
  createdAt: Date;
}