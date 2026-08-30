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
  editingProductId = signal<number | null>(null);

  productForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.min(0)]],
    unitsInStock: [0, [Validators.min(0)]],
  });

  // Load the initial product list when the component is initialized
  ngOnInit(): void {
    this.loadProducts();
  }

  // Fetch products, optionally filtered by search text
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

  // Reload the products list using the entered search value
  onSearch(search: string): void {
    this.loadProducts(search);
  }

  // Create a new product using the current form values
  onCreateProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isCreating.set(true);
    this.errorMessage.set('');

    this.productsService.createProduct(this.productForm.getRawValue()).subscribe({
      next: () => {
        // Clear the form after a successful creation
        this.productForm.reset({
          name: '',
          category: '',
          price: 0,
          unitsInStock: 0,
        });

        this.isCreating.set(false);
        this.loadProducts();
      },
      error: () => {
        this.errorMessage.set('Failed to create product');
        this.isCreating.set(false);
      },
    });
  }
}
