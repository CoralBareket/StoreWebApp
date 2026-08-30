import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../services/products';
import { ProductResponse } from '../../models/product.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);

  products = signal<ProductResponse[]>([]);
  errorMessage = signal('');
  isLoading = signal(false);
  isCreating = signal(false);

  productForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.min(0)]],
    unitsInStock: [0, [Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productsService.getProducts(search).subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load products');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(search: string): void {
    this.loadProducts(search);
  }

  onCreateProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isCreating.set(true);
    this.errorMessage.set('');

    this.productsService.createProduct(this.productForm.getRawValue()).subscribe({
      next: () => {
        this.productForm.reset({
          name: '',
          category: '',
          price: 0,
          unitsInStock: 0,
        });

        this.isCreating.set(true);
        this.loadProducts();
      },
      error: () => {
        this.errorMessage.set('Failed to create product');
        this.isCreating.set(true);
      },
    });
  }
}
