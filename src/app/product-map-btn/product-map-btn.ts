import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
@Component({
  selector: 'app-product-map-btn',
  imports: [],
  templateUrl: './product-map-btn.html',
  styleUrl: './product-map-btn.css',
})
export class ProductMapBtn implements OnInit {
  private httpClient=inject(HttpClient);
  ProdList: any[] = [];
  
  ngOnInit() {
    this.httpClient.get<any>('https://localhost:44398/api/Product/GetAllProducts',{}).subscribe(data=>{this.ProdList=data;console.log('ProdData : '+data)})
  }

}
