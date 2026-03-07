import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  platformId = inject(PLATFORM_ID);
  private httpClient = inject(HttpClient);
  ProdList = signal<any[]>([]);
  cartProd = signal<CartProdTDO[]>([]);
  totalamount = signal(0);
  ProductCounter = signal(0);
  productCategory = signal<number[]>([]);
  productCategoryList = signal<any[]>([]);
  ProductCategoryObj=signal<any[]>([]);
  selectedCategory=signal(0);
  


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.httpClient.get<any>('/api/Product/GetAllProducts').subscribe(data => {
        this.ProdList.set(data);
        
        const categoryid:number[]=data.map((prod:any)=>prod.category_id);
        const uniqueCategoryIds = Array.from(new Set(categoryid));
        this.productCategory.set(uniqueCategoryIds);
        
        this.httpClient.get<any>('api/Category/GetCategory').subscribe(category=>{
          this.productCategoryList.set(category);
          console.log('productCategoryList : ' + this.productCategoryList());
        })

      });
    }
  }
    ngOnChanges() {
    console.log('ProdList : ' + this.ProdList());
    console.log('productCategory : ' + this.productCategory());
  }
  


  categoryFilter(e:any){
    const categoryId = Number(e.target.id);
    this.selectedCategory.set(categoryId);
    if(categoryId==0){
      this.ProductCategoryObj.set(this.ProdList());
      return;
    }

    this.ProductCategoryObj.set(this.ProdList().filter(prod=>prod.category_id==categoryId))
  }


  addToOrder(product: any) {
    this.totalamount.set(this.totalamount() + product.price);

    //console.log('Total Amount: ' + this.totalamount());
    let currentCart = this.cartProd();
    let existingItem = currentCart.find((data: { id: any; }) => data.id === product.id);
    if (existingItem) {
      // this.cartProd.set([...this.cartProd(),existingItem?existingItem:{id:product.id,name:product.name,price:product.price,quantity:1}]);
      this.cartProd.update(cart => cart.map(data2 => data2.id == product.id ? { ...data2, quantity: data2.quantity + 1 } : data2));
    }
    else {
      this.cartProd.set([...this.cartProd(), { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  }



  deleteFromOrder(product: any) {
    let currentCart = this.cartProd();
    let existingItem = currentCart.find((data: { id: any; }) => data.id === product.id);
    if (existingItem) {
      if (existingItem.quantity == 1) {
        this.cartProd.update(card => card.filter(data2 => data2.id != product.id));
      }
      this.cartProd.update(cart => cart.map(data2 => data2.id == product.id ? { ...data2, quantity: data2.quantity - 1 } : data2));
      this.totalamount.set(this.totalamount() - existingItem.price);
    }
  }



  cancelAll() {
    this.totalamount.set(0);
    this.cartProd.set([]);
    this.ProductCounter.set(0);
  }

}
