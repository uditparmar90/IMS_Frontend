import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['../login/login.css'],
})
export class SignupComponent {
  httpClient = inject(HttpClient);
  router = inject(Router);
    errorMsg: string = '';

  signupForm;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
        role: ['User', Validators.required],
      },
      { validators: this.passwordMatch }
    );
  }

  submit() {
    if (!this.signupForm.valid) return;
    this.httpClient.post('/api/Authorize/AddNewUser', this.signupForm.value).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
        if (response === 200) {
          this.router.navigate(["/login"]);
        }

      },
       error: (err) => {

        if (err.status === 409) {
          this.errorMsg="Email already exists. Please use a different email.";
        }

        else {
          this.errorMsg="Something went wrong.";
        }
        console.error('Signup failed', err);}
    });
  }
  

  passwordMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
