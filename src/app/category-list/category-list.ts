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
            isActive: boolean;
        }
        this.loadProducts();
    }

    private loadProducts(): void {
        this.http.get<any[]>('/api/Category/GetAllCategories').subscribe({ next: (data) => 
            this.categories.set(data) 
        });
    }


    editProduct(categoryId: number) {
        this.router.navigate(['/app-add-category', categoryId]);
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