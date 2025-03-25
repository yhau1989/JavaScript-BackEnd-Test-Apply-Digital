import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/filter-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('page/:num')
  findAllByPage(@Param('num') page: number = 1, @Query() filters: ProductFilterDto) {
    console.log('page: ', JSON.stringify({ page, filters }));
    return this.productsService.findAllByPage(page, filters);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':sku')
  findOne(@Param('sku') sku: string) {
    return this.productsService.findOne(sku);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Patch(':sku')
  update(@Param('sku') sku: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(sku, updateProductDto);
  }

  @Delete(':sku')
  delete(@Param('sku') sku: string) {
    return this.productsService.delete(sku);
  }
}
