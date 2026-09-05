import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

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
  categories: { id: number; name: string }[] = [];

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.http.get<{id:number;name:string}[]>("api/Category/GetCategory").subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.categories = data;
      },
      error:(err)=>{
        console.error('Error fetching categories:', err);
      }

    });

    let product = null;
    if (isPlatformBrowser(this.platformId)) {
      console.log("platformId : " + this.platformId);
      product = window.history.state?.product;
    }
    this.productForm = this.fb.group({
      image: [null],
      name: ['', Validators.required],
      sku: [''],
      Category_id: [0, Validators.required],
      isActive: [true, Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      Original_Cost: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, Validators.required],
      Reorder_level: [0, Validators.required],
    });

    if (product) {
      this.isEditMode = true;
      this.productId = product.id;

      this.productForm.patchValue({
        image: product.image,
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

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.productForm.patchValue({
        image: file
      });

      this.productForm.get('image')?.updateValueAndValidity();
    }
  }


  submitProduct() {
  if (!this.productForm.valid) return;

  const formData = new FormData();

  formData.append('name', this.productForm.value.name);
  formData.append('sku', this.productForm.value.sku ?? '');
  formData.append('Category_id',this.productForm.value.Category_id?.toString() ?? '0');
  formData.append('isActive',this.productForm.value.isActive?.toString() ?? 'true');
  formData.append('description',this.productForm.value.description ?? '');
  formData.append('price',this.productForm.value.price?.toString() ?? '0');
  formData.append('Original_Cost',this.productForm.value.Original_Cost?.toString() ?? '0');
  formData.append('quantity',this.productForm.value.quantity?.toString() ?? '0');
  formData.append('Reorder_level',this.productForm.value.Reorder_level?.toString() ?? '0');

  const image = this.productForm.value.image;

  if (image instanceof File) {
    formData.append('image', image, image.name);
  }

  if (this.isEditMode && this.productId) {

    this.http.put(
      `/api/Product/Update/${this.productId}`,
      formData
    ).subscribe({
      next: res => {
        console.log('Product updated', res);
        this.router.navigate(['/ProductList']);
      },
      error: err => console.error(err)
    });
  } else {
    this.http.post(
      '/api/Product/Insert',
      formData
    ).subscribe({
      next: res => {
        console.log('Product added', res);
        this.router.navigate(['/ProductList']);
      },
      error: err => console.error(err)
    });
  }
} 
}
