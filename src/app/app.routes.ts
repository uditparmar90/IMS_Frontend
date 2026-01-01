import { Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product';
import{  SignupComponent } from './sign-up/sign-up';
import { LoginComponent } from './login/login';
import path from 'path';
import { ProductListComponent } from './product-list/product-list';

export const routes: Routes = [
    {path:'',component:LoginComponent,pathMatch: 'full'},
    {path:'signUp',component:SignupComponent},
    {path:'Product',component:AddProductComponent},
    {path:'ProductList',component:ProductListComponent}

];  
