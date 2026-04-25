import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method); 
  console.log('Request Headers:', req.headers);

  return next(req).pipe(tap((event) => {
    if (event instanceof HttpResponse) {
      console.log('Response Status:', event.status);
      console.log('Response Body:', event.body);
    }
  }));
};
