// packages
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// routes
import { routes } from './app.routes';

// services
import { AuthService } from './services/auth.service';
import { initAuth, initUser } from './services/app-initializer';
import { tokenInterceptor } from './services/interceptor/http-interceptor';

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
