import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  fullName: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  city: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  phone: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}