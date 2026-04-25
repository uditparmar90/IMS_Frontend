import { afterNextRender, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent  {
  autoUsername: string | null = null;
  autoPassword: string | null = null;
isLoading: boolean = false;
errorMessage: string = "";
constructor() {
  afterNextRender(() => {
    this.autoUsername = window.localStorage.getItem('IMSUsername');
    this.autoPassword = window.localStorage.getItem('IMSPassword');
    console.log(`this.autoUsername : ${this.autoUsername}`);
    console.log(`this.autoPassword : ${this.autoPassword}`);
    if (this.autoUsername && this.autoPassword) {
      this.loginForm.patchValue({
        email: this.autoUsername,
        password: this.autoPassword,
      });
      // this.onSubmit();
    }
  }
  );}


  // ngOnInit(): void {
    
    
  // }

  // 1. Dependency Injection
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  // 2. API URL
  private apiUrl = '/api/Authorize/login';
  // 3. Login Function
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;
      localStorage.setItem('IMSUsername', credentials.email || '');
      localStorage.setItem('IMSPassword', credentials.password || '');
      console.log(localStorage.getItem('IMSUsername'));
      console.log(localStorage.getItem('IMSPassword'));

      
      //http call
      this.http.post(this.apiUrl, credentials).subscribe({
        next: (response) => {
          console.log('Login successful', response);  
          if (response && (response as any)) {
            localStorage.setItem('token', (response as any).token);
            sessionStorage.setItem('token', (response as any).token);
            this.router.navigate(['/ProductMapBtn']);
          } 
        },
        error: (error) => {
          this.isLoading = false; // ✅ BEST PLACE
          this.errorMessage = "Please check email and password and try again.";
          console.log('Login failed', error);
          if (error.status === 401) {
            this.errorMessage = "Unauthorized: Invalid email or password.";
          } else {
            this.errorMessage = "Sorry we are experiencing technical difficulties. Please try again later.";
          }
          this.cd.detectChanges();
        },
        complete: () => {
    this.isLoading = false; // ✅ BEST PLACE
    this.cd.detectChanges();
  }
      });
    }
  }
}
