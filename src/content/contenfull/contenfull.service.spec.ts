import { Test, TestingModule } from '@nestjs/testing';
import { ContenfullService } from './contenfull.service';
import { ProductsService } from '../../products/products.service';
import { Logger } from '@nestjs/common';

jest.mock('../../products/products.service');

describe('ContenfullService', () => {
  let service: ContenfullService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContenfullService,
        ProductsService, // Inyectamos el servicio mockeado
        Logger,
      ],
    }).compile();

    service = module.get<ContenfullService>(ContenfullService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContenfullContent', () => {
    it('should fetch content and insert new items into DB', async () => {
      const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({ items: [{ fields: { sku: '123' } }] }),
      };
      global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

      const mockFindAll = jest.fn().mockResolvedValue([{ sku: '456' }]);
      productsService.findAll = mockFindAll;

      const mockCreate = jest.fn().mockResolvedValue(true);
      productsService.create = mockCreate;

      const result = await service['getContenfullContent']();

      expect(global.fetch).toHaveBeenCalled();
      expect(mockFindAll).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith({ sku: '123' });
      expect(result).toBe(-1); // Expecting the result to be -1, indicating new items were inserted
    });

    it('should handle errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Fetch failed'));

      const result = await service['getContenfullContent']();

      expect(result).toBe(99); // Error case
    });

    it('should return 1 if the response status is not 200', async () => {
      const mockResponse = { status: 500 };
      global.fetch = jest.fn().mockResolvedValue(mockResponse as any);

      const result = await service['getContenfullContent']();

      expect(result).toBe(1); // Error case with non-200 response status
    });
  });
});
