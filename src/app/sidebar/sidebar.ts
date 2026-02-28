import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  islogin: boolean = false;
  afternextRender() {
    this.islogin = localStorage.getItem('token') ? true : false;
  }
  
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('IMSUsername');
    localStorage.removeItem('IMSPassword');
    window.location.href = '/ProductLists';
  }
}
