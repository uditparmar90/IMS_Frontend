import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sub-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-sub-category.html',
  styleUrls: ['./add-sub-category.css'],
})
export class AddSubCategory implements OnInit {
  parentCategories: any[] = [];
  isSubmitting = false;
  subCategoryForm;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.subCategoryForm = this.fb.group({
      subCategoryName: ['', [Validators.required, Validators.minLength(2)]],
      id: [0],
      parentCategoryId: [null, Validators.required],
      parentCategoryName: [''],
      description: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>('/api/Category/GetCategory').subscribe({
      next: (categories) => {
        this.parentCategories = categories || [];
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subCategoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      return;
    }

    const payload = this.subCategoryForm.value;
    this.isSubmitting = true;
    this.http.post('/api/SubCategory/Insert', payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.subCategoryForm.reset({
          subCategoryName: '',
          id: 0,
          parentCategoryId: null,
          parentCategoryName: '',
          description: '',
          isActive: true,
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Failed to save sub category', err);
      },
    });
  }

  onCancel() {
    this.subCategoryForm.reset();
    this.router.navigate(['/manageSubCategories']);
  }
}
