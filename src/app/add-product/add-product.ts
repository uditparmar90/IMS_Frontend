import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

function categoryRequired(control: AbstractControl): ValidationErrors | null {
  const value = Number(control.value);
  return value > 0 ? null : { categoryRequired: true };
}

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
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: { id: number; name: string }[] = [];
  imagePreview: string | null = null;
  submitError = '';
  isSubmitting = false;

  ngOnInit() {
    this.productForm = this.fb.group({
      image: [null],
      name: ['', Validators.required],
      sku: ['', Validators.required],
      Category_id: [0, [Validators.required, categoryRequired]],
      isActive: [true, Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      Original_Cost: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, Validators.required],
      Reorder_level: [0, Validators.required],
    });

    this.http.get<{ id: number; name: string }[]>('/api/Category/GetAllCategories').subscribe({
      next: (data) => {
        this.categories = data ?? [];
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const routeId = idParam ? Number(idParam) : 0;
    if (routeId > 0) {
      this.isEditMode = true;
      this.productId = routeId;
      this.http.get<any>(`/api/Product/GetProduct/${routeId}`).subscribe({
        next: (product) => {
          this.patchProduct(product);
        },
        error: (err) => {
          console.error('Failed to fetch product', err);
          this.submitError = 'Product not found.';
        },
      });
    }
  }

  private patchProduct(product: any) {
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      price: product.price,
      Original_Cost: product.original_Cost,
      quantity: product.quantity,
      Category_id: product.category_id,
      isActive: product.isActive ?? true,
      Reorder_level: product.reorder_level,
    });

    if (product.image && product.image.length > 0) {
      this.imagePreview = 'data:image/jpeg;base64,' + product.image;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.router.navigate(['/ProductList']);
  }

  submitProduct() {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitError = '';
    this.isSubmitting = true;

    const formData = new FormData();

    formData.append('name', this.productForm.value.name);
    formData.append('sku', this.productForm.value.sku ?? '');
    formData.append('Category_id', this.productForm.value.Category_id?.toString() ?? '0');
    formData.append('SubCategory_id', '0');
    formData.append('isActive', this.productForm.value.isActive?.toString() ?? 'true');
    formData.append('price', this.productForm.value.price?.toString() ?? '0');
    formData.append('Original_Cost', this.productForm.value.Original_Cost?.toString() ?? '0');
    formData.append('quantity', this.productForm.value.quantity?.toString() ?? '0');
    formData.append('Reorder_level', this.productForm.value.Reorder_level?.toString() ?? '0');

    const image = this.productForm.value.image;
    
    if (image instanceof File) {
      formData.append('image', image, image.name);
    }

    const request$ =
      this.isEditMode && this.productId
        ? this.http.put(`/api/Product/Update/${this.productId}`, formData)
        : this.http.post('/api/Product/Insert', formData);
    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/ProductList']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.submitError = err.error?.message ?? 'A product with this SKU already exists.';
        } else if (err.status === 400) {
          this.submitError = err.error?.message ?? 'Please check the form and try again.';
        } else {
          this.submitError = 'Failed to save product. Please try again.';
        }
        console.error(err);
      },
    });
    
  }
}
