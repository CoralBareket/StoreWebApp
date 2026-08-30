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
  isSubmitting = signal(false);
  editingProductId = signal<number | null>(null);

  productForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, [Validators.min(0)]],
    unitsInStock: [0, [Validators.min(0)]],
  });

  private resetProductForm(): void {
    this.productForm.reset({
      name: '',
      category: '',
      price: 0,
      unitsInStock: 0,
    });

    this.editingProductId.set(null);
    this.isSubmitting.set(false);
  }

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

  onSubmitProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const request = this.productForm.getRawValue();
    const productId = this.editingProductId();

    if (productId !== null) {
      this.productsService.updateProduct(productId, request).subscribe({
        next: () => {
          this.resetProductForm();
          this.loadProducts();
        },
        error: () => {
          this.errorMessage.set('Failed to update product');
          this.isSubmitting.set(false);
        },
      });

      return;
    }

    this.productsService.createProduct(request).subscribe({
      next: () => {
        this.resetProductForm();
        this.loadProducts();
      },
      error: () => {
        this.errorMessage.set('Failed to create product');
        this.isSubmitting.set(false);
      },
    });
  }

  onEditProduct(product: ProductResponse): void {
    this.editingProductId.set(product.id);

    this.productForm.setValue({
      name: product.name,
      category: product.category,
      price: product.price,
      unitsInStock: product.unitsInStock,
    });
  }

  onCancelEdit(): void {
    this.resetProductForm();
  }
}
