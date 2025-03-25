import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/filter-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAllByPage: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllByPage', () => {
    it('should call service.findAllByPage with correct parameters', async () => {
      const page = 1;
      const filters: ProductFilterDto = { sku: 'test-sku' };
      await controller.findAllByPage(page, filters);
      expect(service.findAllByPage).toHaveBeenCalledWith(page, filters);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct parameter', async () => {
      const sku = 'test-sku';
      await controller.findOne(sku);
      expect(service.findOne).toHaveBeenCalledWith(sku);
    });
  });

  describe('create', () => {
    it('should call service.create with correct parameter', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        sku: 'test-sku',
        brand: 'Test Brand',
        model: 'Test Model',
        category: 'Test Category',
        stock: 10,
        color: 'Test Color',
        currency: 'USD',
        deleted: false,
      };
      await controller.create(createProductDto);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const sku = 'test-sku';
      const updateProductDto: UpdateProductDto = { name: 'Updated Product', price: 150 };
      await controller.update(sku, updateProductDto);
      expect(service.update).toHaveBeenCalledWith(sku, updateProductDto);
    });
  });

  describe('delete', () => {
    it('should call service.delete with correct parameter', async () => {
      const sku = 'test-sku';
      await controller.delete(sku);
      expect(service.delete).toHaveBeenCalledWith(sku);
    });
  });
});
