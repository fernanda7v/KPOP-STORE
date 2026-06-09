import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { Category } from './entities/category.entity';
  
  @Injectable()
  export class CategoriesService {
    constructor(
      @InjectRepository(Category)
      private readonly categoriesRepository: Repository<Category>,
    ) {}
  
    async create(createCategoryDto: CreateCategoryDto) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: createCategoryDto.name.trim() },
      });
  
      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con ese nombre.');
      }
  
      const category = this.categoriesRepository.create({
        name: createCategoryDto.name.trim(),
        description: createCategoryDto.description?.trim() ?? '',
        isActive: true,
      });
  
      return this.categoriesRepository.save(category);
    }
  
    async findAllActive() {
      return this.categoriesRepository.find({
        where: { isActive: true },
        order: { id: 'ASC' },
      });
    }
  
    async findAllAdmin() {
      return this.categoriesRepository.find({
        order: { id: 'ASC' },
      });
    }
  
    async findOneActive(id: number) {
      const category = await this.categoriesRepository.findOne({
        where: { id, isActive: true },
      });
  
      if (!category) {
        throw new NotFoundException('Categoría no encontrada.');
      }
  
      return category;
    }
  
    async findOneEntity(id: number) {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
  
      if (!category) {
        throw new NotFoundException('Categoría no encontrada.');
      }
  
      return category;
    }
  
    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
      const category = await this.findOneEntity(id);
  
      if (updateCategoryDto.name) {
        const existingCategory = await this.categoriesRepository.findOne({
          where: { name: updateCategoryDto.name.trim() },
        });
  
        if (existingCategory && existingCategory.id !== id) {
          throw new ConflictException('Ya existe una categoría con ese nombre.');
        }
  
        category.name = updateCategoryDto.name.trim();
      }
  
      if (updateCategoryDto.description !== undefined) {
        category.description = updateCategoryDto.description.trim();
      }
  
      if (updateCategoryDto.isActive !== undefined) {
        category.isActive = updateCategoryDto.isActive;
      }
  
      return this.categoriesRepository.save(category);
    }
  
    async logicalDelete(id: number) {
      const category = await this.findOneEntity(id);
      category.isActive = false;
      return this.categoriesRepository.save(category);
    }
  }