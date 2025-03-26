import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/filter-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get products by page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved products by page.' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price filter' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Category filter' })
  @ApiQuery({ name: 'stock', required: false, type: Boolean, description: 'Filter by stock availability' })
  @Get('page/:num')
  findAllByPage(@Param('num') page: number = 1, @Query() filters: ProductFilterDto) {
    return this.productsService.findAllByPage(page, filters);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all products.' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Get a product by SKU' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':sku')
  findOne(@Param('sku') sku: string) {
    return this.productsService.findOne(sku);
  }

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Successfully created the product.' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Update a product by SKU' })
  @ApiResponse({ status: 200, description: 'Successfully updated the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':sku')
  update(@Param('sku') sku: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(sku, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product by SKU' })
  @ApiResponse({ status: 200, description: 'Successfully deleted the product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':sku')
  delete(@Param('sku') sku: string) {
    return this.productsService.delete(sku);
  }
}
