import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductResponse } from '../../models/product.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly products = signal<ProductResponse[]>([]);
  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly editingProductId = signal<number | null>(null);

  protected readonly productForm = this.formBuilder.nonNullable.group({
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

  private loadProducts(search?: string): void {
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

  protected onSearch(search: string): void {
    this.loadProducts(search);
  }

  protected onSubmitProduct(): void {
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

  protected onEditProduct(product: ProductResponse): void {
    this.editingProductId.set(product.id);

    this.productForm.setValue({
      name: product.name,
      category: product.category,
      price: product.price,
      unitsInStock: product.unitsInStock,
    });
  }

  protected onCancelEdit(): void {
    this.resetProductForm();
  }

  protected onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
