import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './order-detail.entity';

export enum OrderStatus {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  PREPARANDO = 'preparando',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export enum PaymentMethod {
  QR = 'qr',
  TRANSFERENCIA = 'transferencia',
  CONTRAENTREGA = 'contraentrega',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 120 })
  fullName: string;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 80 })
  city: string;

  @Column({ length: 30 })
  phone: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.QR,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE,
  })
  status: OrderStatus;

  @Column({ length: 250, nullable: true })
  notes: string;

  @Column({ type: 'float', default: 0 })
  total: number;

  @Column({ default: false })
  containsPreorder: boolean;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: true,
    eager: true,
  })
  details: OrderDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}