import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLinkWithHref],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  // 1. Dependency Injection
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // 2. API URL
  private apiUrl = 'https://localhost:44398/api/Authorize/login';
  // 3. Login Function
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      //http call
      this.http.post(this.apiUrl, credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);  
          if (response && (response as any)) {
            localStorage.setItem('Token', (response as any).token);
            this.router.navigate(['/Product']);
          } 
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    }
  }
}
