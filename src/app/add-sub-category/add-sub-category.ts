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

}
