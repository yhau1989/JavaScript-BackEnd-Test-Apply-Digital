import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductsService } from '../../products/products.service';
import { ProductResponse } from 'src/types/general-types';
import { contenfullUrlByContentType } from '../../uitls/contenfull';

@Injectable()
export class ContenfullService {
  constructor(private readonly productsService: ProductsService) {}
  private readonly logger = new Logger('ContenfullService');

  @Cron('0 * * * * *')
  async handleCron() {
    this.logger.log('Executing scheduled task');
    await this.getContenfullContent();
  }

  private async getContenfullContent() {
    const url = contenfullUrlByContentType('product');
    this.logger.log('getContenfullContent init');
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        this.logger.log('getContenfullContent fetch contefull [OK]');
        const newItems = (await response.json()) as ProductResponse;
        const existing = await this.productsService.findAll();
        this.logger.log('getContenfullContent fetch existing SKU on DB [OK]');
        const existingSkusSet = new Set(existing.map(({ sku }) => sku));
        const itemsToInsert = newItems.items.filter((item) => !existingSkusSet.has(item.fields.sku));
        const g = await Promise.all(itemsToInsert.map((item) => this.productsService.create({ ...item.fields })));
        this.logger.log('getContenfullContent insert new items on DB [OK]');
        return g.length === 0 ? 0 : -1;
      }
      this.logger.error('Error retrieving content from Contenfull', response);
      return 1;
    } catch (error) {
      this.logger.error('Error retrieving content from Contenfull', error);
      return 99;
    }
  }
}
