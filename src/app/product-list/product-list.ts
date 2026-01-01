import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
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

  products = this.httpClient.get<any[]>('https://localhost:44398/api/Product/GetAllProducts')
    .pipe(
      tap(data => console.log('Data received:', data)),
      tap(data => console.log('Count:', data.length))
    );
}