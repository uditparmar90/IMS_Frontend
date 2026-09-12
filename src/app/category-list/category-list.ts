import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from "primeng/table";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.html',
    styleUrl: './category-list.css',
    imports: [TableModule, AsyncPipe],
})
export class CategoryList  implements OnInit {
    protected http = inject(HttpClient); 
    protected router = inject(Router);
    categories: Observable<any[]> = this.loadProducts();
    ngOnInit() {
        console.log('ngOnInit called');
        type category={
            id: number;
            name: string;
        }
        console.log('Fetching categories from API...');
        
    }
    private loadProducts(): Observable<any[]> {
    return this.http.get<any[]>('/api/Category/GetAllCategories').pipe(tap((data) => console.log('Data received:', data)));
  }
    editProduct(category: { id: number; name: string }) {
        console.log('Editing category:', category);
        this.router.navigate(['/categories', category.id]);
        // Implementation for editing a category
    }
    // deleteProduct(category: { id: number; name: string }) {
    //     console.log('Deleting category:', category);
    //     this.http.delete(`/api/Category/Delete/${category.id}`).subscribe({
    //         next: () => {
    //             console.log('Category deleted successfully');
    //             // Remove the deleted category from the list
    //             this.categories = this.categories.filter(c => c.id !== category.id);
    //         },
    //         error: (err) => {
    //             console.error('Failed to delete category', err);
    //         }
    //     });
    // }

    addCategory(){
        this.router.navigate(['/categories']);

    }
}