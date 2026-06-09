import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { Roles } from '../common/decorators/roles.decorator';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { UserRole } from '../users/entities/user.entity';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { ProductsService } from './products.service';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Get()
    findAllActive() {
      return this.productsService.findAllActive();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin')
    findAllAdmin() {
      return this.productsService.findAllAdmin();
    }
  
    @Get(':id')
    findOneActive(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.findOneActive(id);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProductDto: UpdateProductDto,
    ) {
      return this.productsService.update(id, updateProductDto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/delete')
    logicalDelete(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.logicalDelete(id);
    }
  }