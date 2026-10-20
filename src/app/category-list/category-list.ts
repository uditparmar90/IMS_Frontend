import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from "primeng/table";

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.html',
    styleUrl: './category-list.css',
    imports: [TableModule],
})
export class CategoryList implements OnInit {
    protected http = inject(HttpClient); 
    protected router = inject(Router);
    protected route = inject(ActivatedRoute);
    //categories: Observable<any[]> = this.loadProducts();
    categories = signal<any[]>([]);
    
    ngOnInit() {
        console.log('ngOnInit called');
        type category={
            id: number;
            name: string;
        }
        this.loadProducts();
        // this.route.queryParams.subscribe(params => {
        //     const categoryId = params['categoryId'];
        //     console.log('Query parameter categoryId:', categoryId);
        // });
        console.log('Fetching categories from API...');
        
    }

    // private loadProducts(): Observable<any[]> {
    //     return this.http.get<any[]>('/api/Category/GetAllCategories').pipe(tap((data) => console.log('Data received:', data)));
    // }
    private loadProducts(): void {
        this.http.get<any[]>('/api/Category/GetAllCategories').subscribe({ next: (data) => 
            this.categories.set(data) });
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
                this.loadProducts();
            },
            error: (error) => {
                if(error.status === 404) {
                    alert('Category not found');
                }
                if(error.status === 400) {
                    alert('Bad request');
                }
                if(error.status === 500) {
                    alert('Internal server error');
                }
                if(error.status === 409) {
                    alert(error.error?.message ?? 'Category is in use and cannot be deleted.');
                }
            }
        });
    }
    addCategory(){
        this.router.navigate(['/app-add-category',0]);

    }
}