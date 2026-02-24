import { HttpInterceptorFn } from "@angular/common/http";
import { Injectable,PlatformRef,inject,PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "express";
export const authInterceptor:HttpInterceptorFn=(req:any, next:any) => {
    const platformId=inject(PLATFORM_ID);

    if(isPlatformBrowser(platformId)){
    const tocken=localStorage.getItem('Token')?localStorage.getItem('Token'):'';
    if(tocken){
        const cloned=req.clone({
            withCredentials:true, //ALLoW SESSION & COOKIE FOR CORS
            setHeaders:{
                Authorization:`Bearer ${tocken}`
            }
        })
        return next(cloned);
    }
    
}
return next(req);
}   