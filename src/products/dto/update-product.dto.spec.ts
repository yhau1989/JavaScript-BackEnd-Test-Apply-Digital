import { validate } from 'class-validator';
import { UpdateProductDto } from './update-product.dto';

describe('UpdateProductDto', () => {
  it('should validate with all optional fields', async () => {
    const dto = new UpdateProductDto();
    dto.name = 'Product Name';
    dto.brand = 'Brand';
    dto.model = 'Model';
    dto.category = 'Category';
    dto.color = 'Color';
    dto.price = 100;
    dto.currency = 'USD';
    dto.stock = 10;
    dto.deleted = false;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with no fields', async () => {
    const dto = new UpdateProductDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with incorrect types', async () => {
    const dto = new UpdateProductDto();
    dto.price = 'not a number' as any;
    dto.stock = 'not a number' as any;
    dto.deleted = 'not a boolean' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
