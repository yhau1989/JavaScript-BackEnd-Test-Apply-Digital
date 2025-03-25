import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  it('should validate all required fields', async () => {
    const dto = plainToClass(CreateProductDto, {
      sku: '12345',
      name: 'Product Name',
      brand: 'Brand Name',
      model: 'Model Name',
      category: 'Category Name',
      color: 'Color Name',
      price: 100,
      currency: 'USD',
      stock: 10,
      deleted: false,
      creation_date: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when required fields are missing', async () => {
    const dto = plainToClass(CreateProductDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate optional fields', async () => {
    const dto = plainToClass(CreateProductDto, {
      sku: '12345',
      name: 'Product Name',
      brand: 'Brand Name',
      model: 'Model Name',
      category: 'Category Name',
      color: 'Color Name',
      price: 100,
      currency: 'USD',
      stock: 10,
      deleted: false,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when fields have incorrect types', async () => {
    const dto = plainToClass(CreateProductDto, {
      sku: 12345,
      name: 12345,
      brand: 12345,
      model: 12345,
      category: 12345,
      color: 12345,
      price: '100',
      currency: 12345,
      stock: '10',
      deleted: 'false',
      creation_date: 'not a date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
