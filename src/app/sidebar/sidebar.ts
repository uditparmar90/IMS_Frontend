import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, NgIf,NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
