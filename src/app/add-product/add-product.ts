import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProductComponent implements OnInit {

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  ngOnInit() {
    const product = history.state.product;

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      Category_id: [0, Validators.required],
      isActive: [true, Validators.required  ],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      Original_Cost:[0,[Validators.required, Validators.min(1)]],
      quantity: [0, Validators.required],
      Reorder_level: [0, Validators.required],
    });

if (product) {
  this.isEditMode = true;
  this.productId = product.id;

  this.productForm.patchValue({
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.price,
    Original_Cost: product.original_Cost,
    quantity: product.quantity,
    // Manually map mismatched keys:
    Category_id: product.category_id?.toString(), // Match 'C' and convert to string for <select>
    isActive: product.isActive,                   // Match 'I'
    Reorder_level: product.reorder_level          // Match spelling 'level' vs 'lavel'
  });
}

  }

  submitProduct() {
    if (!this.productForm.valid) return;

    const payload = this.productForm.value;
    console.log('Submitting product:', payload);

    if (this.isEditMode && this.productId) {
      this.http.put(
        `/api/Product/Update/${this.productId}`,
        payload
      ).subscribe({
        next: res => console.log('Product updated', res),
        error: err => console.error(err)
      });
    } else {
      this.http.post(
        '/api/Product/Insert',
        payload
      ).subscribe({
        next: res => {
          console.log('Product added', res);
          if(res!=="Product added successfully")
          // this.productForm.reset();
        this.router.navigate(['/ProductList']);
        
        },
        error: err => console.error(err)
      });
    }
  }
}
