import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  deleted: boolean;

  @IsOptional() // Permite que no sea obligatorio al crear un producto
  @Type(() => Date)
  @IsDate()
  creation_date?: Date;
}
