/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductFilterDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { deleted: false } });
  }

  async findOne(sku: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { sku } });
    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({ where: { sku: createProductDto.sku } });
    if (existingProduct) {
      throw new HttpException(`Product with SKU ${createProductDto.sku} already exists`, HttpStatus.CONFLICT);
    }
    const newProduct = this.productRepository.create({ ...createProductDto, deleted: false });
    return this.productRepository.save(newProduct);
  }

  async update(sku: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(sku);
    const updateProduct = { ...product, ...updateProductDto };
    const savedProduct = await this.productRepository.save(updateProduct);
    return savedProduct;
  }

  async delete(sku: string): Promise<void> {
    const product = await this.findOne(sku);
    product.deleted = true;
    await this.productRepository.save(product);
  }

  async findAllByPage(page: number = 1, filters: ProductFilterDto): Promise<any> {
    const limit = 5;
    const skip = (page - 1) * limit;
    const queryFilters = this.buildFilters(filters);
    const totalCount = await this.productRepository.count({ where: queryFilters } as FindManyOptions<Product>);
    const totalPages = Math.ceil(totalCount / limit);
    const products = await this.productRepository.find({
      skip,
      take: limit,
      where: queryFilters,
    });

    return {
      currentPage: page,
      totalPages,
      totalCount,
      products,
    };
  }

  private buildFilters(filters: ProductFilterDto) {
    const queryFilters: any = {};

    if (filters.sku) {
      queryFilters.sku = { $regex: filters.sku, $options: 'i' };
    }

    if (filters.name) {
      queryFilters.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.brand) {
      queryFilters.brand = { $regex: filters.brand, $options: 'i' };
    }

    if (filters.model) {
      queryFilters.model = { $regex: filters.model, $options: 'i' };
    }

    if (filters.category) {
      queryFilters.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.color) {
      queryFilters.color = { $regex: filters.color, $options: 'i' };
    }

    if (filters.price) {
      queryFilters.price = filters.price;
    }

    if (filters.currency) {
      queryFilters.currency = { $regex: filters.currency, $options: 'i' };
    }

    if (filters.stock) {
      queryFilters.stock = filters.stock;
    }

    if (filters.deleted !== undefined) {
      queryFilters.deleted = filters.deleted;
    } else {
      queryFilters.deleted = false;
    }

    return queryFilters;
  }
}
