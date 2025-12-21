import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from "@angular/router";
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet, NgIf, NgClass, RouterLinkWithHref],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
