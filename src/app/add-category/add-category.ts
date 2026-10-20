import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // For navigation after save

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrls: ['./add-category.css']
})
export class AddCategory implements OnInit {

  // The form group instance
  categoryForm!: FormGroup;

  // State to handle button loading/disabling during API calls
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.http.get<{ id: boolean | null; name: string | null; userId: string | null }>('/api/Category/GetCategory').subscribe({
      next: (data) => {
        console.log('Fetched category:', data);
        // this.categoryForm.patchValue(data);

        if (data) {
          this.categoryForm.get('categoryName')?.setValue(data.name === null ? '' : data.name);
          this.categoryForm.get('isActive')?.setValue(data.id === null ? true : data.id);
        }
      },

      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        console.error('Failed to fetch category', err);
      }
    });

  }

  /**
   * Initialize the Reactive Form
   */
  private initForm(): void {
    this.categoryForm = this.fb.group({
      Id:[0],
      categoryName: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true] // Default to true (Active)
    });
  }

  /**
   * Helper to determine if a field has a validation error
   * Used in HTML: [class.is-invalid]="isFieldInvalid('categoryName')"
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    // Return true only if field is invalid AND (touched by user OR dirty)
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Handle Form Submission
   */
  onCategorySubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formData = {
      // id: this.categoryForm.get('Id')?.value,
      name: this.categoryForm.get('categoryName')?.value,
      isActive: this.categoryForm.get('isActive')?.value
    }
    console.log('Submitting Payload:', formData);

    this.http.post('/api/Category/Insert', formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.categoryForm.reset({ categoryName: '', isActive: true });
        this.router.navigate(['/category-list']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Failed to create category', err);
      }
    });
  }

  /**
   * Handle Cancel Button
   */
  onCancel(): void {
    this.categoryForm.reset();
    this.router.navigate(['/category-list']);
  }
}