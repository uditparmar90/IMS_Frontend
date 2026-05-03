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
  }

  /**
   * Initialize the Reactive Form
   */
  private initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(3)]],
      description: [''], 
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

    const formData = this.categoryForm.value;
    this.isSubmitting = true;

    console.log('Submitting Payload:', formData);

    this.http.post('/api/Category/Insert', formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.categoryForm.reset({ categoryName: '', description: '', isActive: true });
        this.router.navigate(['/manageCategories']);
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
    this.router.navigate(['/manageCategories']);
  }
}