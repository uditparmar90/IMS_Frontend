import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
  export class Sidebar {
  // Controls the mobile "hamburger" menu state
  isCollapsed = true; 

  // Optional: Close menu when a link is clicked (Better UX on mobile)
  closeMenu() {
    this.isCollapsed = true;
  }
}