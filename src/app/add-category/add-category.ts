import { Component, OnInit } from '@angular/core';
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
    // private categoryService: CategoryService // Inject your service here
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
    // 1. Check if form is valid
    if (this.categoryForm.invalid) {
      // Trigger all validation messages if user clicked submit without filling fields
      this.categoryForm.markAllAsTouched();
      return;
    }

    // 2. Prepare Data
    const formData = this.categoryForm.value;
    this.isSubmitting = true;

    console.log('Submitting Payload:', formData);

    // 3. Call API Service (Simulated)
    /*
    this.categoryService.createCategory(formData).subscribe({
      next: (res) => {
        // Success Toast/Notification here
        this.router.navigate(['/categories']); // Redirect to list
      },
      error: (err) => {
        this.isSubmitting = false;
        // Error handling logic
      }
    });
    */

    // Remove this timeout when you add your actual API call
    setTimeout(() => {
      alert('Category Saved Successfully! (Check console for data)');
      this.isSubmitting = false;
      this.router.navigate(['/categories']); 
    }, 1000);
  }

  /**
   * Handle Cancel Button
   */
  onCancel(): void {
    this.categoryForm.reset();
    this.router.navigate(['/categories']); // Navigate back to the list page
  }
}