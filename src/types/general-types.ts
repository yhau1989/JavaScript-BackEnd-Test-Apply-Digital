export type ContenfullContentType = 'product' | 'category' | 'brand';

export type Product = {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
  deleted: boolean;
};

export type ProductResponse = {
  sys: { type: string };
  total: number;
  skip: number;
  limit: number;
  items: {
    metadata: {
      tags: string[];
      concepts: string[];
    };
    sys: {
      space: {
        sys: {
          type: string;
          linkType: string;
          id: string;
        };
      };
      id: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      environment: {
        sys: {
          id: string;
          type: string;
          linkType: string;
        };
      };
      publishedVersion: number;
      revision: number;
      contentType: {
        sys: {
          type: string;
          linkType: string;
          id: string;
        };
      };
      locale: string;
    };
    fields: Product;
  }[];
};
