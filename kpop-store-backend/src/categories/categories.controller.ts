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
  import { CategoriesService } from './categories.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  
  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Get()
    findAllActive() {
      return this.categoriesService.findAllActive();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin')
    findAllAdmin() {
      return this.categoriesService.findAllAdmin();
    }
  
    @Get(':id')
    findOneActive(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.findOneActive(id);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoriesService.create(createCategoryDto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
      return this.categoriesService.update(id, updateCategoryDto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/delete')
    logicalDelete(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.logicalDelete(id);
    }
  }