import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../services/products';
import { ProductResponse } from '../../models/product.models';

@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})

export class Products implements OnInit {
  private readonly productsService = inject(ProductsService);

  products = signal<ProductResponse[]>([]);
  errorMessage = signal('');
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(search?: string): void {
    this.isLoading = true;
    this.errorMessage.set('');

    this.productsService.getProducts(search).subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage.set('Failed to load products');
        this.isLoading = false;
      },
    });
  }

  onSearch(search: string): void {
    this.loadProducts(search);
  }
}