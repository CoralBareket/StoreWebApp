export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  unitsInStock: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  category: string;
  price: number;
  unitsInStock: number;
}