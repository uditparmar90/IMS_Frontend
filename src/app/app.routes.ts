import { Routes } from '@angular/router';
import path from 'path';
import { AddProductComponent } from './add-product/add-product';
import{  SignupComponent } from './sign-up/sign-up';
import { LoginComponent } from './login/login';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'signUp',component:SignupComponent},
    {path:'Product',component:AddProductComponent}

];  
