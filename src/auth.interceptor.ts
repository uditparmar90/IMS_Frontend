import { HttpInterceptorFn } from "@angular/common/http";
export const authInterceptor:HttpInterceptorFn=(req:any, next:any) => {
    const tocken=localStorage.getItem('Token');
    if(tocken){
        const cloned=req.cloned({
            setHeaders:{
                authorization:`Bearer ${tocken}`
            }
        })
    }
    return next(req);
}