import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  ngOnInit() {
    const product = history.state.product;

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      category: ['', Validators.required],
      status: ['Active'],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, Validators.required],
      reorderLevel: [0, Validators.required],
    });

    if (product) {
      this.isEditMode = true;
      this.productId = product.id; // assumes backend sends id
      this.productForm.patchValue(product);
      console.log('Editing product:', product);
    }
  }

  submitProduct() {
    if (!this.productForm.valid) return;

    const payload = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.http.put(
        `https://localhost:44398/api/Product/Update/${this.productId}`,
        payload
      ).subscribe({
        next: res => console.log('Product updated', res),
        error: err => console.error(err)
      });
    } else {
      this.http.post(
        'https://localhost:44398/api/Product/Insert',
        payload
      ).subscribe({
        next: res => {
          console.log('Product added', res);
          this.productForm.reset();
        },
        error: err => console.error(err)
      });
    }
  }
}
