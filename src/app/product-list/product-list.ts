import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, TableModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  products = signal<any[]>([]);
  errorMessage = '';

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.httpClient.get<any[]>('/api/Product/GetAllProducts').subscribe({
      next: (data) => {
        this.products.set(data ?? []);
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.errorMessage = 'Failed to load products.';
      },
    });
  }

  editProduct(product: any) {
    this.router.navigate(['/Product', product.id]);
  }

  deleteProduct(product: any) {
    if (!confirm(`Delete "${product.name}"?`)) {
      return;
    }
    this.httpClient.delete(`/api/Product/Delete/${product.id}`).subscribe({
      next: () => {
        this.errorMessage = '';
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
        if (err.status === 409) {
          this.errorMessage = err.error?.message ?? 'This product is in use and cannot be deleted.';
        } else if (err.status === 404) {
          this.errorMessage = 'Product not found.';
        } else {
          this.errorMessage = 'Failed to delete product.';
        }
      },
    });
  }

  addProduct() {
    this.router.navigate(['/Product']);
  }
}