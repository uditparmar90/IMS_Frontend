import { HttpInterceptorFn } from "@angular/common/http";
import { Injectable,PlatformRef,inject,PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { RedirectCommand } from "@angular/router";
import { Router } from "@angular/router";
export const authInterceptor:HttpInterceptorFn=(req:any, next:any) => {
    const platformId=inject(PLATFORM_ID);
    const router=inject(Router);

    if(isPlatformBrowser(platformId)){
    const token=localStorage.getItem('token')?localStorage.getItem('token'):'';
    if(token){
        const cloned=req.clone({
            withCredentials:true, //ALLoW SESSION & COOKIE FOR CORS
            setHeaders:{
                Authorization:`Bearer ${token}`
            }
        })
        return next(cloned);
    }
    // else{
    //     return router.navigate(['/']);
    // }
    
}
return next(req);
}   