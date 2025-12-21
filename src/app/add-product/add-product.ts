import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProductComponent {

  productForm;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      category: ['', Validators.required],
      status: ['Active'],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, Validators.required],
      reorderLevel: [5],
    });
  }
}
