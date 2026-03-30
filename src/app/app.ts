import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IMS_Frontend');
  // isDark = false;

ngOnInit() {
  // this.isDark = localStorage.getItem('theme') === 'dark';
  // this.applyTheme();
}

// applyTheme() {
//   document.body.setAttribute(
//     'data-bs-theme',
//     this.isDark ? 'dark' : 'light'
//   );
// }

// toggleTheme() {
//   this.isDark = !this.isDark;
//   localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
//   this.applyTheme();
// }
}
