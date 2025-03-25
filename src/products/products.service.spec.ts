import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

const result = [
  {
    sku: '123',
    name: 'Product 1',
    price: 100,
    _id: '1',
    brand: 'Brand',
    model: 'Model',
    category: 'Category',
    color: 'Red',
    stock: 10,
    currency: 'USD',
    deleted: false,
  },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: MockProxy<Repository<Product>>;

  beforeEach(async () => {
    productRepository = mock<Repository<Product>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
      ],
    }).compile();
    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      productRepository.find.mockResolvedValue(result as Product[]);
      const products = await service.findAll();
      expect(Array.isArray(products)).toBe(true);
    });

    it('should return an empty array if no products are found', async () => {
      productRepository.find.mockResolvedValue([]);
      const products = await service.findAll();
      expect(Array.isArray(products)).toBe(true);
      expect(products).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const sku = '123';
      productRepository.findOne.mockResolvedValue(result[0] as Product);
      expect(await service.findOne(sku)).toEqual(result[0]);
    });

    it('should throw a NotFoundException if product not found', async () => {
      const sku = '123';
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(sku)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        sku: '1234',
        name: 'Product 1234',
        price: 100,
        brand: 'Brand',
        model: 'Model',
        category: 'Category',
        color: 'Red',
        stock: 10,
        currency: 'USD',
        deleted: false,
      };

      const r = { ...createProductDto, deleted: false } as Product;
      productRepository.create.mockReturnValue(r);
      productRepository.save.mockResolvedValue(r);

      expect(await service.create(createProductDto)).toEqual(r);
    });

    it('should throw a HttpException if product with SKU already exists', async () => {
      const createProductDto = {
        sku: '123',
        name: 'Product 123',
        price: 100,
        brand: 'Brand',
        model: 'Model',
        category: 'Category',
        color: 'Red',
        stock: 10,
        currency: 'USD',
        deleted: false,
      };

      productRepository.findOne.mockResolvedValue(result[0] as Product);

      await expect(service.create(createProductDto)).rejects.toThrowError(
        new HttpException(`Product with SKU ${createProductDto.sku} already exists`, HttpStatus.CONFLICT)
      );
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const sku = '123';
      const updateProductDto = { name: 'Updated Product' };
      const existingProduct = { ...result[0], deleted: false };
      const updatedProduct = { ...existingProduct, ...updateProductDto };

      productRepository.findOne.mockResolvedValue(existingProduct as Product);
      productRepository.save.mockResolvedValue(updatedProduct as Product);

      expect(await service.update(sku, updateProductDto)).toEqual(updatedProduct);
    });

    it('should handle no updates if DTO is empty', async () => {
      const sku = '123';
      const updateProductDto = {}; // No fields to update
      const existingProduct = { ...result[0], deleted: false };

      productRepository.findOne.mockResolvedValue(existingProduct as Product);
      productRepository.save.mockResolvedValue(existingProduct as Product);

      expect(await service.update(sku, updateProductDto)).toEqual(existingProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      const sku = '123';
      const updateProductDto = { name: 'Updated Product' };

      productRepository.findOne.mockResolvedValue(null);

      await expect(service.update(sku, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should mark the product as deleted', async () => {
      const sku = '123';
      const product = { ...result[0], deleted: false };
      productRepository.findOne.mockResolvedValue(product as Product);
      productRepository.save.mockResolvedValue({ ...product, deleted: true } as Product);

      await service.delete(sku);
      expect(productRepository.save).toHaveBeenCalledWith({ ...product, deleted: true });
    });

    it('should throw NotFoundException if product not found', async () => {
      const sku = '123';
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(sku)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByPage', () => {
    it('should return paginated products', async () => {
      const filters = { sku: '123', name: 'Product' };
      const page = 1;
      const paginatedResult = {
        currentPage: page,
        totalPages: 2,
        totalCount: 10,
        products: [{ sku: '123', name: 'Product 1' }],
      };

      productRepository.count.mockResolvedValue(10);
      productRepository.find.mockResolvedValue(paginatedResult.products as Product[]);

      expect(await service.findAllByPage(page, filters)).toEqual(paginatedResult);
    });

    it('should handle empty filter results', async () => {
      const filters = { sku: '123', name: 'Nonexistent' };
      const page = 1;
      const paginatedResult = {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
        products: [],
      };

      productRepository.count.mockResolvedValue(0);
      productRepository.find.mockResolvedValue([]);

      expect(await service.findAllByPage(page, filters)).toEqual(paginatedResult);
    });
  });

  //     it('should return paginated products', async () => {
  //       const filters = { sku: '123', name: 'Product' }; // Include 'sku' to match 'ProductFilterDto'
  //       const page = 1;
  //       const result = {
  //         currentPage: page,
  //         totalPages: 1,
  //         totalCount: 10,
  //         products: [{ sku: '123', name: 'Product 1' }],
  //       };

  //       mockProductRepository.count.mockResolvedValue(10);
  //       mockProductRepository.find.mockResolvedValue(result.products);

  //       expect(await service.findAllByPage(page, filters)).toEqual(result);
  //     });

  //     it('should handle empty filter results', async () => {
  //       const filters = { sku: '123', name: 'Nonexistent' }; // No products match
  //       const page = 1;
  //       const result = {
  //         currentPage: page,
  //         totalPages: 1,
  //         totalCount: 0,
  //         products: [],
  //       };

  //       mockProductRepository.count.mockResolvedValue(0);
  //       mockProductRepository.find.mockResolvedValue([]);

  //       expect(await service.findAllByPage(page, filters)).toEqual(result);
  //     });
  //   });
});
