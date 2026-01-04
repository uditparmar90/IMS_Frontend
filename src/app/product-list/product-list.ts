import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { tap } from 'rxjs/operators'; // 1. Import 'tap'

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, TableModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  products = this.httpClient.get<any[]>('https://localhost:44398/api/Product/GetAllProducts')
    .pipe(
      tap(data => console.log('Data received:', data))
    );
    editProduct(product: any) {
      // Implement edit functionality here
      this.router.navigate(['/Product'], { state: { product: product } });
      
      console.log('Editing product:', product);
    }
    deleteProduct(product: any) {
      // Implement delete functionality here
      console.log('Deleting product:', product);
    }
    addProduct(){
      this.router.navigate(['/Product']);
    }
}