import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit,OnChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from "primeng/table";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.html',
    styleUrl: './category-list.css',
    imports: [TableModule, AsyncPipe],
})
export class CategoryList implements OnInit {
    protected http = inject(HttpClient); 
    protected router = inject(Router);
    protected route = inject(ActivatedRoute);
    categories: Observable<any[]> = this.loadProducts();
    
    ngOnInit() {
        console.log('ngOnInit called');
        type category={
            id: number;
            name: string;
        }
        this.route.queryParams.subscribe(params => {
            const categoryId = params['categoryId'];
            console.log('Query parameter categoryId:', categoryId);
        });
        console.log('Fetching categories from API...');
        
    }
    OnChanges() {
        console.log('OnChanges called');
        this.categories = this.loadProducts();
    }

    private loadProducts(): Observable<any[]> {
    return this.http.get<any[]>('/api/Category/GetAllCategories').pipe(tap((data) => console.log('Data received:', data)));
  }
    editProduct(categoryId: number) {
        console.log('Editing category:', categoryId);
        this.router.navigate(['/app-add-category', categoryId]);
        // Implementation for editing a category
    }
    deleteProduct(categoryId: number) {
        console.log('Deleting category:', categoryId);  
        this.http.delete(`/api/Category/Delete/${categoryId}`).subscribe({
            next: () => {
                alert('Category deleted successfully');
                this.categories = this.loadProducts();
            }
        });
    }
    addCategory(){
        this.router.navigate(['/categories']);

    }
}