import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Product } from '../../products/entities/product.entity';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 80, unique: true })
    name: string;
  
    @Column({ length: 200, nullable: true })
    description: string;
  
    @Column({ default: true })
    isActive: boolean;
  
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }