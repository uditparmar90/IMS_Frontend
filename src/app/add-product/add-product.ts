import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProductComponent {
  private HttpClient=inject(HttpClient);
  private FB=inject(FormBuilder);


  productForm;

  constructor(private fb: FormBuilder) {
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
  }

  submitProduct() {
    if(this.productForm.valid){
      const productData = this.productForm.value;
      this.HttpClient.post('https://localhost:44398/api/Product/Insert', productData).subscribe({
        next: (response) => {
          console.log('Product added successfully', response);
          this.productForm.reset();
        },
        error: (error) => {
          console.error('Error adding product', error);
        },
      });




  }
  }
}
