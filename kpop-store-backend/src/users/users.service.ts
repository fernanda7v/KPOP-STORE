import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { PasswordStrength, User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private calculatePasswordStrength(password: string): PasswordStrength {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return PasswordStrength.DEBIL;
    if (score <= 4) return PasswordStrength.INTERMEDIA;
    return PasswordStrength.FUERTE;
  }

  private sanitizeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con ese correo.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const passwordStrength = this.calculatePasswordStrength(createUserDto.password);

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role ?? UserRole.CLIENTE,
      passwordStrength,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: { id: 'ASC' },
    });

    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return this.sanitizeUser(user);
  }

  async findEntityById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.role = updateUserRoleDto.role;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }

  async updateStatus(id: number, updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.isActive = updateUserStatusDto.isActive;
    const updatedUser = await this.usersRepository.save(user);

    return this.sanitizeUser(updatedUser);
  }
}