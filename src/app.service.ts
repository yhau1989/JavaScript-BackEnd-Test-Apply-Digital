import { Injectable } from '@nestjs/common';
// import { contenfullUrlByContentType } from './uitls/contenfull';
// import { ProductResponse } from './types/general-types';
import { ProductsService } from './products/products.service';

@Injectable()
export class AppService {
  constructor(private readonly productsService: ProductsService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // async getHello(): Promise<any> {
  //   const logger = new Logger('AppService');
  //   const url = contenfullUrlByContentType('product');
  //   try {
  //     const response = await fetch(url);
  //     if (response.status === 200) {
  //       const newItems = (await response.json()) as ProductResponse;
  //       const existing = await this.productsService.findAll();
  //       const existingSkusSet = new Set(existing.map(({ sku }) => sku));
  //       const itemsToInsert = newItems.items.filter((item) => !existingSkusSet.has(item.fields.sku));
  //       const g = await Promise.all(itemsToInsert.map((item) => this.productsService.create({ ...item.fields })));
  //       return g;
  //     }
  //     return null;
  //   } catch (error) {
  //     logger.error('Error retrieving content from Contenfull', error);
  //     return null;
  //   }
  // }
}
