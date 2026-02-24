import { Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product';
import {  SignupComponent } from './sign-up/sign-up';
import { LoginComponent } from './login/login';
import { ProductListComponent } from './product-list/product-list';
import { AddCategory } from './add-category/add-category';
import { AddSubCategory} from './add-sub-category/add-sub-category';
import { ProductMapBtn } from './product-map-btn/product-map-btn';  

export const routes: Routes = [
    {path:'',component:LoginComponent,pathMatch: 'full'},
    {path:'signUp',component:SignupComponent},
    {path:'Product',component:AddProductComponent},
    {path:'ProductList',component:ProductListComponent,pathMatch:'full'},
    {path:'manageCategories',component:AddCategory},
    {path:'manageSubCategories',component:AddSubCategory},
    {path:'ProductMapBtn',component:ProductMapBtn}

];  
