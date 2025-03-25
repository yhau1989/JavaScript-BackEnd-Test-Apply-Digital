import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ReportsService', () => {
  let service: ReportsService;
  let productRepository: MockProxy<Repository<Product>>;

  beforeEach(async () => {
    productRepository = mock<Repository<Product>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should calculate the percentage of deleted products', async () => {
    productRepository.count.mockResolvedValueOnce(10); // Total products
    productRepository.countBy.mockResolvedValueOnce(2); // deletes
    const result = await service.getDeletedPercentage();
    expect(result.percentage).toBe(20);
  });

  it('should calculate the percentage of non-deleted products', async () => {
    productRepository.count.mockResolvedValueOnce(10);
    productRepository.countBy.mockResolvedValueOnce(8);
    const result = await service.getNonDeletedPercentage();
    expect(result).toBe(80);
  });

  it('should return 0 if there are no products', async () => {
    productRepository.count.mockResolvedValueOnce(0);
    const result = await service.getNonDeletedPercentage();
    expect(result).toBe(0);
  });

  it('should return a message in getCustomReport', () => {
    expect(service.getCustomReport()).toEqual({ message: 'This is a custom report' });
  });

  it('should return 0% deleted if no products are deleted', async () => {
    productRepository.count.mockResolvedValueOnce(10); // Total products
    productRepository.countBy.mockResolvedValueOnce(0); // No deleted products
    const result = await service.getDeletedPercentage();
    expect(result.percentage).toBe(0);
  });

  it('should filter products by price when withPrice is true', async () => {
    productRepository.count.mockResolvedValueOnce(10);
    productRepository.countBy.mockResolvedValueOnce(5);
    const result = await service.getNonDeletedPercentage(true);
    expect(result).toBe(50);
  });

  it('should filter products by price when withPrice is false', async () => {
    productRepository.count.mockResolvedValueOnce(10);
    productRepository.countBy.mockResolvedValueOnce(3);
    const result = await service.getNonDeletedPercentage(false);
    expect(result).toBe(30);
  });

  it('should filter products by date range', async () => {
    productRepository.count.mockResolvedValueOnce(10);
    productRepository.countBy.mockResolvedValueOnce(4);
    const result = await service.getNonDeletedPercentage(undefined, '2024-01-01', '2024-12-31');
    expect(result).toBe(40);
  });
});
