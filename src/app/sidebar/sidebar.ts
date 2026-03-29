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
  isDark = false;

  islogin: boolean = false;
  afternextRender() {
    this.islogin = localStorage.getItem('token') ? true : false;
  }


  applyTheme() {
    const html = document.documentElement;
    const isNgDark=html.classList.contains('dark');
    document.body.setAttribute(
    'data-bs-theme',
    this.isDark ? 'dark' : 'light'
    );
    this.isDark=!this.isDark;

    if (isNgDark) {
    html.classList.remove('dark');
    document.body.setAttribute('data-bs-theme', 'light');
  } else {
    html.classList.add('dark');
    document.body.setAttribute('data-bs-theme', 'dark');
  }
    // this.toggleTheme(); 
}

toggleTheme() {
  this.isDark = !this.isDark;
  localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  this.applyTheme();
}


  // toggleTheme() {
  //   const body = document.body;
  //   body.classList.toggle('dark-theme');
  //   const div = document.querySelector('div');
  //   const nav = document.querySelector('nav');
    
  //   if (div) {
  //     div.classList.toggle('dark-theme');
  //   }
  //   if (nav) {
  //     nav.classList.toggle('dark-theme');
  //   }
  //   const DarkThemeToggle = document.getElementById('DarkThemeToggle');
  //   if (DarkThemeToggle) {
  //     if(DarkThemeToggle.classList.contains('bi-brightness-high')){
  //         DarkThemeToggle.classList.add('bi-moon');
  //         DarkThemeToggle.classList.remove('bi-brightness-high');
  //     }else{
  //         DarkThemeToggle.classList.add('bi-brightness-high');
  //         DarkThemeToggle.classList.remove('bi-moon');
  //     }
  //   }
    

  //   console.log('Theme toggled');
  // }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('IMSUsername');
    localStorage.removeItem('IMSPassword');
    window.location.href = '/ProductLists';
  }
}
