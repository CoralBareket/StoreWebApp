export enum ProductCategory {
  Sofa = 'Sofa',
  Chair = 'Chair',
  Table = 'Table',
  Bed = 'Bed',
  Storage = 'Storage',
}

export const PRODUCT_CATEGORIES = Object.values(ProductCategory);

export interface ProductRequest {
  name: string;
  category: ProductCategory;
  price: number;
  unitsInStock: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  unitsInStock: number;
}