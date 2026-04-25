import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  protected readonly title = signal('IMS_Frontend');
  IsDarkTheme: boolean = null!;
  ngOnInit() {
    if(typeof window !== 'undefined'  ) {
      this.IsDarkTheme = localStorage.getItem('theme') === 'dark';
    
    if (this.IsDarkTheme) {
      document.documentElement.classList.add('dark');
      document.body.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    }
  }

  islogin: boolean = false;
  afternextRender() {
    this.islogin = localStorage.getItem('token') ? true : false;
  }

  applyTheme() {
    const html = document.documentElement;
    const ThemeToggler: HTMLElement | null = document.getElementById('ThemeToggler');

    if (this.IsDarkTheme) {
      html.classList.contains("dark")? html.classList.remove('dark') : null;
      document.body.setAttribute('data-bs-theme', 'light');

      if (ThemeToggler) {
        
        ThemeToggler.classList.contains('bi-sun')? ThemeToggler.classList.remove('bi-sun') : null;
        ThemeToggler.classList.add('bi-moon');
      }

      localStorage.setItem('theme', 'light');
    } 
    else {
      html.classList.add('dark');
      document.body.setAttribute('data-bs-theme', 'dark');

      if (ThemeToggler) {
        ThemeToggler.classList.contains("bi-moon")?ThemeToggler.classList.remove('bi-moon') : null;
        ThemeToggler.classList.add('bi-sun');
      }
      typeof window !== 'undefined' && typeof localStorage !== 'undefined' && localStorage.setItem('theme', 'dark');
    }
  }
  toggleTheme() {
  this.IsDarkTheme = !this.IsDarkTheme;

  if (this.IsDarkTheme) {
    document.documentElement.classList.add('dark');
    document.body.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('IMSUsername');
    localStorage.removeItem('IMSPassword');
    window.location.href = '/';
  }
}
