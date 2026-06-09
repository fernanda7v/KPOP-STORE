import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum UserRole {
    ADMIN = 'admin',
    CLIENTE = 'cliente',
  }
  
  export enum PasswordStrength {
    DEBIL = 'debil',
    INTERMEDIA = 'intermedia',
    FUERTE = 'fuerte',
  }
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ unique: true, length: 120 })
    email: string;
  
    @Column({ length: 255 })
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.CLIENTE,
    })
    role: UserRole;
  
    @Column({
      type: 'enum',
      enum: PasswordStrength,
      default: PasswordStrength.DEBIL,
    })
    passwordStrength: PasswordStrength;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @BeforeInsert()
    @BeforeUpdate()
    normalizeEmail() {
      if (this.email) {
        this.email = this.email.trim().toLowerCase();
      }
    }
  
    @BeforeInsert()
    @BeforeUpdate()
    normalizeName() {
      if (this.name) {
        this.name = this.name.trim();
      }
    }
  }