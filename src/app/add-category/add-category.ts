import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory implements OnInit {
categoryForm: any;
  constructor (private fb:FormBuilder) {}

  ngOnInit(): void {
    const categoryForm=this.fb.group({
      categoryName:[''],
      description:[''],
      isActive:[false],
    });



  }

}
