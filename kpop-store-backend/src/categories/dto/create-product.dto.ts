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
  
  export class CreateProductDto {
    @IsInt()
    @Min(1)
    categoryId: number;
  
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    name: string;
  
    @IsString()
    @MinLength(5)
    description: string;
  
    @IsNumber()
    @Min(0)
    price: number;
  
    @IsOptional()
    @IsString()
    @MaxLength(255)
    imageUrl?: string;
  
    @IsInt()
    @Min(0)
    stock: number;
  
    @IsString()
    @MinLength(2)
    @MaxLength(80)
    artist: string;
  
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
  }