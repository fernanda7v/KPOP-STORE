import {
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength,
  } from 'class-validator';
  
  export class UpdateProductDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    categoryId?: number;
  
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name?: string;
  
    @IsOptional()
    @IsString()
    @MinLength(5)
    description?: string;
  
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;
  
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;
  
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    artist?: string;
  
    @IsOptional()
    @IsBoolean()
    featured?: boolean;
  
    @IsOptional()
    @IsBoolean()
    isPreorder?: boolean;
  
    @IsOptional()
    @IsString()
    @MaxLength(100)
    estimatedDelivery?: string;
  
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
  }