import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Card } from 'primeng/card';
export interface CartProdTDO {
  id: number;
  name: string;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-product-map-btn',
  imports: [],
  templateUrl: './product-map-btn.html',
  styleUrl: './product-map-btn.css'
})

export class ProductMapBtn implements OnInit {
  constructor() { 
    
  }


  platformId = inject(PLATFORM_ID);
  private httpClient=inject(HttpClient);
  ProdList = signal<any[]>([]);
  cartProd = signal<CartProdTDO[]>([]);
  totalamount = signal(0);
  ProductCounter= signal(0);
  



  ngOnInit() {
  if (isPlatformBrowser(this.platformId)) { 
    this.httpClient.get<any>('/api/Product/GetAllProducts').subscribe(data => {
      this.ProdList.set(data);
    });
  }

}
ngOnChanges() {
  console.log('ProdList : ' + this.ProdList()); 
}

addToOrder(product: any) {
  this.totalamount.set(this.totalamount() + product.price);

  //console.log('Total Amount: ' + this.totalamount());
  let currentCart = this.cartProd();
  let existingItem=currentCart.find((data: { id: any; })=>data.id===product.id);
  console.log('Existing Item:', existingItem);
  if(existingItem){
    // this.cartProd.set([...this.cartProd(),existingItem?existingItem:{id:product.id,name:product.name,price:product.price,quantity:1}]);
  this.cartProd.update(cart => cart.map(data2=>data2.id==product.id ? {...data2, quantity: data2.quantity + 1} : data2));
  }
  else{
    this.cartProd.set([...this.cartProd(),{id:product.id,name:product.name,price:product.price,quantity:1}]);
  }
}
cancelAll() {
  this.totalamount.set(0);
}

}
