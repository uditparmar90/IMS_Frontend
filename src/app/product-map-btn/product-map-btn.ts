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
    styleUrl: './product-map-btn.css',
})
export class ProductMapBtn implements OnInit {
    platformId = inject(PLATFORM_ID);
    private httpClient = inject(HttpClient);
    // recevied Product by API
    stockedProducts = signal<any[]>([]);
    userCartItems = signal<CartProdTDO[]>([]);
    totalamount = signal(0);
    ProductCounter = signal(0);
    productCategoryIds = signal<number[]>([]);
    productCategoryList = signal<any[]>([]);
    ProductCategoryObj = signal<any[]>([]);
    selectedCategory = signal(0);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.httpClient.get<any[]>('/api/Product/GetAllProducts').subscribe((data) => {
                // 1. Filter products with quantity > 0
                const availableProducts = data.filter((prod) => prod.quantity > 0);
                this.stockedProducts.set(availableProducts);
                // 2. Extract unique category IDs
                const categoryIds = availableProducts.map((prod) => prod.category_id);
                const uniqueCategoryIds = Array.from(new Set(categoryIds));
                this.productCategoryIds.set(uniqueCategoryIds);

                // 3. Fetch Categories
                this.httpClient.get<any[]>('/api/Category/GetCategory').subscribe((categories) => {
                    // Optional: Filter category list to only include categories present in your products
                    const categoryIds: number[] = categories.filter((cat) =>
                        uniqueCategoryIds.includes(cat.id),
                    );
                    this.productCategoryList.set(categoryIds);
                    console.log('Categories fetched:', categories);
                    console.log('productCategoryList updated:', this.productCategoryList());
                    console.log('productCategoryIds updated:', this.productCategoryIds());
                });
            });
        }
    }

    ngOnChanges() {
        console.log('stockedProducts : ' + this.stockedProducts());
        console.log('productCategoryIds : ' + this.productCategoryIds());
    }

    categoryFilter(e: Event) {
        const categoryId = Number((e.target as HTMLElement).id);
        this.selectedCategory.set(categoryId);
        if (categoryId == 0) {
            this.ProductCategoryObj.set(this.stockedProducts());
            return;
        }
        this.ProductCategoryObj.set(
            this.stockedProducts().filter((prod) => prod.category_id == categoryId),
        );
    }

    addToOrder(product: any) {
        //console.log('Total Amount: ' + this.totalamount());
        let currentCart: CartProdTDO[] = this.userCartItems();
        let existingItem = currentCart.find((data: { id: number }) => data.id === product.id);

        if (existingItem) {
            if (
                product.quantity >=
                (currentCart.find((data: { id: number }) => data.id === product.id)?.quantity || 0) + 1
            ) {
                this.userCartItems.update((cart) =>
                    cart.map((data2) =>
                        data2.id == product.id ? { ...data2, quantity: data2.quantity + 1 } : data2,
                    ),
                );
                this.totalamount.set(this.totalamount() + product.price);
            } else {

                // alert('No more quantity available for this product');
            }
        } else {
            this.userCartItems.set([
                ...this.userCartItems(),
                { id: product.id, name: product.name, price: product.price, quantity: 1 },
            ]);
            this.totalamount.set(this.totalamount() + product.price);
        }
    }

    checkout() {
        let check = this.userCartItems();
        console.log('Checkout clicked' + check);
        this.httpClient.post<any>('/api/Transactions/Insert', check).subscribe((response) => {
            console.log('Transaction successful:', response);
            this.cancelAll();
        });
    }
    getProductQuantity(productId: number): number {
        const item = this.userCartItems().find(item => item.id === productId);
        return item ? item.quantity : 0;
    }

    deleteFromOrder(product: any) {
        let currentCart = this.userCartItems();
        let existingItem = currentCart.find((data: { id: number }) => data.id === product.id);
        if (existingItem) {
            if (existingItem.quantity == 1) {
                this.userCartItems.update((card) => card.filter((data2) => data2.id != product.id));
            }
            this.userCartItems.update((cart) =>
                cart.map((data2) =>
                    data2.id == product.id ? { ...data2, quantity: data2.quantity - 1 } : data2,
                ),
            );
            this.totalamount.set(this.totalamount() - existingItem.price);
        }
    }

    cancelAll() {
        this.totalamount.set(0);
        this.userCartItems.set([]);
        this.ProductCounter.set(0);
    }
}
