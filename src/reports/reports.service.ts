/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository, FindOptionsWhere } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async getDeletedPercentage() {
    const totalProducts = await this.productRepository.count();
    const deletedProducts = await this.productRepository.countBy({ deleted: true });

    return {
      percentage: totalProducts ? (deletedProducts / totalProducts) * 100 : 0,
    };
  }

  async getNonDeletedPercentage(withPrice?: boolean, startDate?: string, endDate?: string) {
    const filters: any = { deleted: false };
    if (withPrice !== undefined) {
      filters.price = withPrice === true ? { $gt: 0 } : { $eq: 0 };
    }

    if (startDate || endDate) {
      filters.creation_date = {};
      if (startDate) filters.creation_date.$gte = new Date(startDate);
      if (endDate) filters.creation_date.$lte = new Date(endDate);
    }

    const totalProducts = await this.productRepository.count();
    const nonDeletedProducts = await this.productRepository.countBy(filters as FindOptionsWhere<Product>);
    if (totalProducts === 0) return 0;

    return (nonDeletedProducts / totalProducts) * 100;
  }

  getCustomReport() {
    return { message: 'This is a custom report' };
  }
}
