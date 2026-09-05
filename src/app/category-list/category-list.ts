import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from "primeng/table";

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.html',
    styleUrl: './category-list.css',
    imports: [TableModule],
})
export class CategoryList  implements OnInit {
    protected http = inject(HttpClient); 
    protected router = inject(Router);
    categories: { id: number; name: string }[] = [];
    ngOnInit() {
        type category={
            id: number;
            name: string;
        }
        this.http.get<category[]>("/api/Category/GetCategory").subscribe({
            next: (data: category[]) => {
                console.log('Data received:', data);
                this.categories = data;
            },
            error: (err) => {
                console.error('Failed to load categories', err);
            }
        });
    }
    editProduct(category: { id: number; name: string }) {
        // Implementation for editing a category
    }   
    deleteProduct(category: { id: number; name: string }) {
        // Implementation for deleting a category
    }
    addCategory(){
        this.router.navigate(['/categories']);

    }
}