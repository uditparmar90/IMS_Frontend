import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-sub-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-sub-category.html',
  styleUrls: ['./add-sub-category.css'],
})
export class AddSubCategory implements OnInit {
subCategoryForm: any;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    const subCategoryForm=this.fb.group({
      subCategoryName:[''],
      id:[0],
      parentCategoryId:[''],
      parentCategoryName:[''],
      description:[''],
      isActive:[false],
    });


  }
  // In your component class
isFieldInvalid(fieldName: string): boolean {
  const field = this.subCategoryForm.get(fieldName);
  // Show error only if field is invalid AND has been touched or dirty
  return !!(field && field.invalid && (field.dirty || field.touched));
}

onSubmit() {
  if (this.subCategoryForm.valid) {
    console.log(this.subCategoryForm.value);
    // Call your service here
  } else {
    // Trigger validation display if user clicks save on empty form
    this.subCategoryForm.markAllAsTouched();
  }
}

onCancel() {
  this.subCategoryForm.reset();
  // Or navigate away
}

}
