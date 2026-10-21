import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient,withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
            darkModeSelector: '.dark'
          }
        }}),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
