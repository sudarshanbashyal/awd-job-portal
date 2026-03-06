// packages
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// routes
import { routes } from './app.routes';

// services
import { AuthService } from './services';

// libs
import { initAuth, initUser, tokenInterceptor } from './lib';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr(),
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initUser,
      deps: [AuthService],
      multi: true,
    },
    provideAnimations(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ],
};
