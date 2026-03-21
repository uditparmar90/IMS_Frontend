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
  // recevied Product by API
  ProdList = signal<any[]>([]);
  cartProd = signal<CartProdTDO[]>([]);
  totalamount = signal(0);
  ProductCounter = signal(0);
  productCategory = signal<number[]>([]);
  productCategoryList = signal<any[]>([]);
  ProductCategoryObj=signal<any[]>([]);
  selectedCategory=signal(0);
  


  // ngOnInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.httpClient.get<any>('/api/Product/GetAllProducts').subscribe(data => {
  //       this.ProdList.set(data);
        
  //       const categoryid:number[]=data.map((prod:any)=>prod.category_id);
  //       const uniqueCategoryIds = Array.from(new Set(categoryid));
  //       this.productCategory.set(uniqueCategoryIds);
        
  //       this.httpClient.get<any>('/api/Category/GetCategory').subscribe(category=>{
  //         this.productCategoryList.set(category);
  //         console.log('productCategoryList : ' + this.productCategoryList());
  //       })

  //     });
  //   }
  // }
  ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.httpClient.get<any[]>('/api/Product/GetAllProducts').subscribe(data => {
      
      // 1. Filter products with quantity > 0
      const availableProducts = data.filter(prod => prod.quantity > 0);
      this.ProdList.set(availableProducts);

      // 2. Extract unique category IDs
      const categoryIds = availableProducts.map(prod => prod.category_id);
      const uniqueCategoryIds = Array.from(new Set(categoryIds));
      this.productCategory.set(uniqueCategoryIds);

      // 3. Fetch Categories
      this.httpClient.get<any[]>('/api/Category/GetCategory').subscribe(categories => {
        // Optional: Filter category list to only include categories present in your products
        const filteredCategories = categories.filter(cat => 
          uniqueCategoryIds.includes(cat.id)
        );
        
        this.productCategoryList.set(filteredCategories);
        console.log('productCategoryList updated:', this.productCategoryList());
      });
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
    

    //console.log('Total Amount: ' + this.totalamount());
    let currentCart: CartProdTDO[] = this.cartProd();
    let existingItem = currentCart.find((data: { id: any; }) => data.id === product.id);
    if (existingItem) {
      // this.cartProd.set([...this.cartProd(),existingItem?existingItem:{id:product.id,name:product.name,price:product.price,quantity:1}]);
      if(product.quantity >= (currentCart.find((data: { id: any; }) => data.id === product.id)?.quantity || 0) + 1){
        this.cartProd.update(cart => cart.map(data2 => data2.id == product.id ? { ...data2, quantity: data2.quantity + 1 } : data2));
        this.totalamount.set(this.totalamount() + product.price);
      }
      else{
        alert('No more quantity available for this product');

      }

      
    }
    else {
      this.cartProd.set([...this.cartProd(), { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
      this.totalamount.set(this.totalamount() + product.price);
    }
  }

  checkout() {
    let check=this.cartProd();
    console.log('Checkout clicked'+check);
    this.httpClient.post<any>('/api/Transactions/Insert', check).subscribe(response => {
      console.log('Transaction successful:', response);
      this.cancelAll();
    });

    
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
