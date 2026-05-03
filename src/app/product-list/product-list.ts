import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs/operators'; // 1. Import 'tap'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, TableModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  products: Observable<any[]> = this.loadProducts();

  private loadProducts(): Observable<any[]> {
    return this.httpClient.get<any[]>('/api/Product/GetAllProducts').pipe(tap((data) => console.log('Data received:', data)));
  }

  editProduct(product: any) {
    this.router.navigate(['/Product'], { state: { product: product } });
    console.log('Editing product:', product);
  }

  deleteProduct(product: any) {
    if (!confirm(`Delete "${product.name}"?`)) {
      return;
    }
    this.httpClient.delete(`/api/Product/Delete/${product.id}`).subscribe({
      next: () => {
        this.products = this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
      },
    });
  }

  addProduct() {
    this.router.navigate(['/Product']);
  }
}