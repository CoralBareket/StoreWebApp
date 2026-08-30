import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductRequest, ProductResponse } from '../models/product.models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5249/api/products';

  getProducts(search?: string) {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductResponse[]>(this.apiUrl, {
      params,
    });
  }

  createProduct(request: ProductRequest) {
    return this.http.post<ProductResponse>(this.apiUrl, request);
  }

  updateProduct(id: number, request: ProductRequest) {
    return this.http.put<ProductResponse>(
      `${this.apiUrl}/${id}`,
      request,
    );
  }
}