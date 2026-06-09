import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Category } from '../../categories/entities/category.entity';
  
  @Entity('products')
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    categoryId: number;
  
    @ManyToOne(() => Category, (category) => category.products, {
      eager: true,
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category;
  
    @Column({ length: 120 })
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'float' })
    price: number;
  
    @Column({ length: 255, nullable: true })
    imageUrl: string;
  
    @Column({ default: 0 })
    stock: number;
  
    @Column({ length: 80 })
    artist: string;
  
    @Column({ default: false })
    featured: boolean;
  
    @Column({ default: false })
    isPreorder: boolean;
  
    @Column({ length: 100, nullable: true })
    estimatedDelivery: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }