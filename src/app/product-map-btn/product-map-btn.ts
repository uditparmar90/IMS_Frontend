import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-product-map-btn',
  imports: [],
  templateUrl: './product-map-btn.html',
  styleUrl: './product-map-btn.css',
})
export class ProductMapBtn implements OnInit {
  private httpClient=inject(HttpClient);
  ProdList = signal<any[]>([]);
  // inside the class
platformId = inject(PLATFORM_ID);
  ngOnInit() {
  if (isPlatformBrowser(this.platformId)) { 
    this.httpClient.get<any>('/api/Product/GetAllProducts').subscribe(data => {
      this.ProdList.set(data);
      // loop inside subscribe
      this.ProdList().forEach(element => {
         console.log('ProdList : ' + element);
      });
    });
  }
}
 
 

}
