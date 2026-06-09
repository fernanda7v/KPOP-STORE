import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Category } from '../categories/entities/category.entity';
  import { Repository } from 'typeorm';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { Product } from './entities/product.entity';
  
  @Injectable()
  export class ProductsService {
    constructor(
      @InjectRepository(Product)
      private readonly productsRepository: Repository<Product>,
  
      @InjectRepository(Category)
      private readonly categoriesRepository: Repository<Category>,
    ) {}
  
    private async validateCategory(categoryId: number) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId, isActive: true },
      });
  
      if (!category) {
        throw new BadRequestException('La categoría indicada no existe o está inactiva.');
      }
  
      return category;
    }
  
    async create(createProductDto: CreateProductDto) {
      await this.validateCategory(createProductDto.categoryId);
  
      const product = this.productsRepository.create({
        categoryId: createProductDto.categoryId,
        name: createProductDto.name.trim(),
        description: createProductDto.description.trim(),
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl?.trim() ?? '',
        stock: createProductDto.stock,
        artist: createProductDto.artist.trim(),
        featured: createProductDto.featured ?? false,
        isPreorder: createProductDto.isPreorder ?? false,
        estimatedDelivery: createProductDto.estimatedDelivery?.trim() ?? '',
        isActive: true,
      });
  
      return this.productsRepository.save(product);
    }
  
    async findAllActive() {
      return this.productsRepository.find({
        where: { isActive: true },
        order: { id: 'ASC' },
      });
    }
  
    async findAllAdmin() {
      return this.productsRepository.find({
        order: { id: 'ASC' },
      });
    }
  
    async findOneActive(id: number) {
      const product = await this.productsRepository.findOne({
        where: { id, isActive: true },
      });
  
      if (!product) {
        throw new NotFoundException('Producto no encontrado.');
      }
  
      return product;
    }
  
    async findOneEntity(id: number) {
      const product = await this.productsRepository.findOne({
        where: { id },
      });
  
      if (!product) {
        throw new NotFoundException('Producto no encontrado.');
      }
  
      return product;
    }
  
    async update(id: number, updateProductDto: UpdateProductDto) {
      const product = await this.findOneEntity(id);
  
      if (updateProductDto.categoryId !== undefined) {
        await this.validateCategory(updateProductDto.categoryId);
        product.categoryId = updateProductDto.categoryId;
      }
  
      if (updateProductDto.name !== undefined) {
        product.name = updateProductDto.name.trim();
      }
  
      if (updateProductDto.description !== undefined) {
        product.description = updateProductDto.description.trim();
      }
  
      if (updateProductDto.price !== undefined) {
        product.price = updateProductDto.price;
      }
  
      if (updateProductDto.imageUrl !== undefined) {
        product.imageUrl = updateProductDto.imageUrl.trim();
      }
  
      if (updateProductDto.stock !== undefined) {
        product.stock = updateProductDto.stock;
      }
  
      if (updateProductDto.artist !== undefined) {
        product.artist = updateProductDto.artist.trim();
      }
  
      if (updateProductDto.featured !== undefined) {
        product.featured = updateProductDto.featured;
      }
  
      if (updateProductDto.isPreorder !== undefined) {
        product.isPreorder = updateProductDto.isPreorder;
      }
  
      if (updateProductDto.estimatedDelivery !== undefined) {
        product.estimatedDelivery = updateProductDto.estimatedDelivery.trim();
      }
  
      if (updateProductDto.isActive !== undefined) {
        product.isActive = updateProductDto.isActive;
      }
  
      return this.productsRepository.save(product);
    }
  
    async logicalDelete(id: number) {
      const product = await this.findOneEntity(id);
      product.isActive = false;
      return this.productsRepository.save(product);
    }
  }