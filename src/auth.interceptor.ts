import { HttpInterceptorFn } from "@angular/common/http";
import { Injectable,PlatformRef,inject,PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
export const authInterceptor:HttpInterceptorFn=(req:any, next:any) => {
    const platformId=inject(PLATFORM_ID);

    if(isPlatformBrowser(platformId)){
    const tocken=localStorage.getItem('Token')?localStorage.getItem('Token'):'';
    if(tocken){
        const cloned=req.clone({
            setHeaders:{
                authorization:`Bearer ${tocken}`
            }
        })
        return next(cloned);
    }
}
return next(req);
}   