import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'; // Removed OnChanges
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators'; // Import this to handle loading state safely

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  
  // Dependency Injection
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);
  
  public isLoading = false;
  private apiUrl = 'https://localhost:44398/api/Authorize/login';
  public errorMessage: string = '';


  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // You can remove the alert here, it will annoy users!
    // alert('Method not implemented.'); 
  }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return; 
  //   }

  //   // 1. Start Loading
  //   this.isLoading = true;
  //   const credentials = this.loginForm.value;

  //   this.http.post(this.apiUrl, credentials)
  //     .pipe(
  //       // 2. 'finalize' runs when the request is done (Success OR Error)
  //       // This is the correct replacement for your ngOnChanges idea
  //       finalize(() => this.isLoading = false) 
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log('Login successful', response);  
  //         if (response && response.token) {
  //           localStorage.setItem('Token', response.token);
  //           this.router.navigate(['/ProductList']);
  //         } 
  //       },
  //       error: (error) => {
  //         console.error('Login failed', error);
  //         if(error.status === 401){
  //            //alert('Invalid email or password'); 
  //            this.isLoading = false;    
  //         }
  //       },
  //     });
  // }
onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.http.post(this.apiUrl, credentials)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Force screen update on success just in case
          this.cdr.detectChanges(); 

          console.log('Login successful', response);
          if (response && response.token) {
            localStorage.setItem('Token', response.token);
            this.router.navigate(['/ProductList']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          
          // 1. Stop the loader
          this.isLoading = false;
          
          // 2. Set the message
          if (error && error.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (error && error.status === 0) {
            this.errorMessage = 'Server is offline.';
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }

          // 3. FORCE THE SCREEN TO UPDATE
          // This tells Angular: "I changed something, refresh the HTML NOW."
          this.cdr.detectChanges(); 
        },
      });
  }
}