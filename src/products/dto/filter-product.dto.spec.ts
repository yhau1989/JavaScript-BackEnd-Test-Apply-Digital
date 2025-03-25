import { validate } from 'class-validator';
import { ProductFilterDto } from './filter-product.dto';

describe('ProductFilterDto', () => {
  it('should validate with all optional fields', async () => {
    const dto = new ProductFilterDto();
    dto.sku = '12345';
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
    const dto = new ProductFilterDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with incorrect types', async () => {
    const dto = new ProductFilterDto();
    dto.sku = 12345 as any;
    dto.name = 123 as any;
    dto.brand = 123 as any;
    dto.model = 123 as any;
    dto.category = 123 as any;
    dto.color = 123 as any;
    dto.price = '100' as any;
    dto.currency = 123 as any;
    dto.stock = '10' as any;
    dto.deleted = 'false' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate with some fields', async () => {
    const dto = new ProductFilterDto();
    dto.sku = '12345';
    dto.price = 100;
    dto.deleted = true;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
