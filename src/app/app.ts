import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./sidebar/sidebar";
import { AddProductComponent } from "./add-product/add-product";

@Component({
  selector: 'app-root',
  imports: [Sidebar, AddProductComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IMS_Frontend');
}
